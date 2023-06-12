import mongoose from 'mongoose';
const { parse } = require('rss-to-json');
import { connectDB } from '../src/db';
import config from '../config';

const cacheKeys = {
  en: 'news-en',
  hi: 'news-hi',
  mr: 'news-mr',
};

// Define the schema for the cached response
const cacheSchema = new mongoose.Schema({
  cacheKey: { type: String, required: true, unique: true },
  data: Object,
  timestamp: Number,
});

// Define the model for the cache
const CacheNewsHomepag = mongoose.models.cachenewsbreaking || mongoose.model('cachenewsbreaking', cacheSchema);

// Connect to MongoDB
connectDB();

async function getGeneralNews() {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${config.newsAPIKey}&pageSize=100&country=in`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.content,
      url: news.url,
      urlToImage: news.urlToImage,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news.url,
      logo: news.urlToImage
    }
  });

  return data
}

async function getHealthNews() {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?category=health&apiKey=${config.newsAPIKey}&pageSize=5&country=in`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.content,
      url: news.url,
      urlToImage: news.urlToImage,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news.url,
      logo: news.urlToImage
    }
  });

  return data
}

async function getEntertainmentNews() {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?category=entertainment&apiKey=${config.newsAPIKey}&pageSize=5&country=in`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.content,
      url: news.url,
      urlToImage: news.urlToImage,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news.url,
      logo: news.urlToImage
    }
  });

  return data
}

async function getSportsNews() {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?category=business&apiKey=${config.newsAPIKey}&pageSize=5&country=in`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.content,
      url: news.url,
      urlToImage: news.urlToImage,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news.url,
      logo: news.urlToImage
    }
  });

  return data
}
const createKey = (prefNews)=>{
  // CREATE KEY
  // CHECK FOR CACHE
  let cacheKey = "En-"
  cacheKey += `${prefNews.includes('General')?"General":""}`; // Key to identify the cached response
  cacheKey += `${prefNews.includes('Health')?"Health":""}`;
  cacheKey += `${prefNews.includes('Entertainment')?"Entertainment":""}`;
  cacheKey += `${prefNews.includes('Sports')?"Sports":""}`;

  return cacheKey;
}

const getDataFromAPI = async(prefNews)=>{
  let newsPromises = []
  if(prefNews.includes('General')) newsPromises.push(getGeneralNews());
  if(prefNews.includes('Health')) newsPromises.push(getHealthNews());
  if(prefNews.includes('Entertainment')) newsPromises.push(getEntertainmentNews());
  if(prefNews.includes('Sports')) newsPromises.push(getSportsNews());

  let promiseData = await Promise.all(newsPromises);
  let results = []

  promiseData.map(async(item)=>{
    results = [...results, ...item];
  })

  return results;
}

async function getHomepageNewsFromAPI() {

  let newsPromises = [
    getGeneralNews(),
    getHealthNews(),
    getEntertainmentNews(),
    getSportsNews(),
    getGeneralNews(),
  ];
  let promiseData = await Promise.all(newsPromises);
  const data = {
    breaking: promiseData[0],
    health: promiseData[1],
    entertainment: promiseData[2],
    technology: promiseData[3],
    business: promiseData[4],
  }
  return data
}

export default async function handleNewsEn(req, res) {
  const { name = "", mobile = "", prefNews = ["General"], home=false } = req?.query || {};

  const cacheKey = home?"En-Home":createKey(prefNews);
  const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

  try{
     // CHECK RESPONSE ALREADY EXIST NOT EXPIRE
     const cachedData = await CacheNewsHomepag.findOne({ cacheKey });

    //  IF RESPONSE SEND CACHE DATA
     if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
       console.log('Returning cached response');
       return res.json({ data: cachedData.data });
     }
     
     let response;
     if(home){
      response = await getHomepageNewsFromAPI(prefNews);
     }else{
      response = await getDataFromAPI(prefNews);
     }
     

     // UPDATE OR CREATE THE CACHE WITH NEW RESPONSE
     await CacheNewsHomepag.updateOne(
       { cacheKey },
       { data: response, timestamp: Date.now() },
       { upsert: true }
     );
 
     // Return the response
     return res.json({ data: response });

  }catch(e){
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Error fetching news' });
  }
  
}