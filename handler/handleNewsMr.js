import mongoose from 'mongoose';
const { parse } = require('rss-to-json');
import { connectDB } from '../src/db';
import config from '../config';

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

  const apiResJson = await parse('https://marathi.abplive.com/latest-news/feed');

  const data = (apiResJson?.items || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.description,
      url: news.link,
      urlToImage: news.media.thumbnail?.url,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news?.link,
      logo: news.media.thumbnail?.url
    }
  });

  return data
}

async function getHealthNews() {

  const apiResJson = await parse('https://marathi.abplive.com/lifestyle/feed');

  const data = (apiResJson?.items || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.description,
      url: news.link,
      urlToImage: news.media.thumbnail?.url,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news?.link,
      logo: news.media.thumbnail?.url
    }
  });

  return data
}

async function getEntertainmentNews() {

  const apiResJson = await parse('https://marathi.abplive.com/entertainment/feed');

  const data = (apiResJson?.items || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.description,
      url: news.link,
      urlToImage: news.media.thumbnail?.url,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news?.link,
      logo: news.media.thumbnail?.url
    }
  });

  return data
}

async function getSportsNews() {

  const apiResJson = await parse('https://marathi.abplive.com/sports/cricket/feed');
  const data = (apiResJson?.items || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.description,
      url: news.link,
      urlToImage: news.media.thumbnail?.url,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news?.link,
      logo: news.media.thumbnail?.url
    }
  });

  return data
}

const createKey = (prefNews)=>{
  // CREATE KEY
  let cacheKey = "Mr-"
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

export default async function handleNewsEn(req, res) {
  const { name = "", mobile = "", prefNews = ["General"] } = req?.query || {};

  const cacheKey = createKey(prefNews);
  const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

  try{
     // CHECK RESPONSE ALREADY EXIST NOT EXPIRE
     const cachedData = await CacheNewsHomepag.findOne({ cacheKey });

    //  IF RESPONSE SEND CACHE DATA
     if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
       console.log('Returning cached response');
       return res.json({ data: cachedData.data });
     }

     const response = await getDataFromAPI(prefNews);

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