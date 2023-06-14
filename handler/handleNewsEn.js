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

async function getGeneralNewsBKPnewapi() {
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

async function getGeneralNews() {

  const apiResJson = await parse('https://www.news18.com/rss/latest.xml');

  const data = (apiResJson?.items || []).map((news, i) => {
    return {
      key: i + 1,
      author: news.author,
      title: news?.title,
      description: news.content,
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
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?category=sports&apiKey=${config.newsAPIKey}&pageSize=5&country=in`, {
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

async function getTechnologyNews() {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?category=technology&apiKey=${config.newsAPIKey}&pageSize=5&country=in`, {
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

const createKey = (prefNews) => {
  // CREATE KEY
  // CHECK FOR CACHE
  let cacheKey = "En-"
  cacheKey += `${prefNews.includes('General') ? "General" : ""}`; // Key to identify the cached response
  cacheKey += `${prefNews.includes('Health') ? "Health" : ""}`;
  cacheKey += `${prefNews.includes('Entertainment') ? "Entertainment" : ""}`;
  cacheKey += `${prefNews.includes('Sports') ? "Sports" : ""}`;

  return cacheKey;
}

const getDataFromAPI = async (prefNews) => {
  let newsPromises = []
  if (prefNews.includes('Health')) newsPromises.push(getHealthNews());
  if (prefNews.includes('Entertainment')) newsPromises.push(getEntertainmentNews());
  if (prefNews.includes('Sports')) newsPromises.push(getSportsNews());
  if (prefNews.includes('Technology')) newsPromises.push(getTechnologyNews());
  if (prefNews.includes('General')) newsPromises.push(getGeneralNews());

  let promiseData = await Promise.all(newsPromises);
  let results = []

  promiseData.map(async (item) => {
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
    getTechnologyNews(),
  ];
  let promiseData = await Promise.all(newsPromises);
  const data = {
    breaking: promiseData[0].slice(0, 5),
    health: promiseData[1].slice(0, 5),
    entertainment: promiseData[2].slice(0, 5),
    sports: promiseData[3].slice(0, 5),
    technology: promiseData[4].slice(0, 5),
  }
  return data
}

export default async function handleNewsEn(req, res) {
  let { name = "", mobile = "", prefNews = ["General"], home = false } = req?.query || {};

  try {
    try{
      prefNews = (typeof prefNews === 'string') ? JSON.parse(prefNews) : prefNews;
    }catch(e){
      prefNews = ["General"];
    }
    
    if(!Array.isArray(prefNews)) prefNews = ["General"];

  // ADD GENERAL AS DEFAULT IN PREFNEWS
  if (!prefNews.includes("General")) {
    prefNews.push("General");
  }
  
  const cacheKey = home ? "En-Home" : createKey(prefNews);
  const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

    // CHECK RESPONSE ALREADY EXIST NOT EXPIRE
    const cachedData = await CacheNewsHomepag.findOne({ cacheKey });

    //  IF RESPONSE SEND CACHE DATA
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
      console.log('Returning cached response');
      return res.json({ data: cachedData.data });
    }

    let response;
    if (home) {
      response = await getHomepageNewsFromAPI(prefNews);
    } else {
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

  } catch (e) {
    console.error('Error fetching news:', e);
    return res.status(500).json({ error: 'Error fetching news' });
  }

}