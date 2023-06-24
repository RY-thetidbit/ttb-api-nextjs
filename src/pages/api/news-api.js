import mongoose from 'mongoose';
const { parse } = require('rss-to-json');
import { connectDB } from '../../db';
import config from '../../../config';
import handleNewsEn from '../../../handler/handleNewsEn';
import handleNewsHi from '../../../handler/handleNewsHi';
import handleNewsMr from '../../../handler/handleNewsMr';
import { v4 as uuidv4 } from 'uuid';
// const cacheKeys = {
//   en: 'news-en-general',
//   en: 'news-en-health',
//   en: 'news-en-entertainment',
//   en: 'news-en-sport',
//   hi: 'news-hi-general',
//   hi: 'news-hi-health',
//   hi: 'news-hi-entertainment',
//   hi: 'news-hi-sport',
//   mr: 'news-mr-general'
//   mr: 'news-mr-health'
//   mr: 'news-mr-entertainment',
//   mr: 'news-mri-sport'
// };

const homepageNews = {
  en: getHomepageNewsEn(),
  hi: getHomepageNewsHi(),
  mr: getHomepageNewsMr(),
}

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



async function getHomepageNewsEn() {
  const apiRes = await fetch(`https://newsapi.org/v2/top-headlines?country=in&apiKey=${config.newsAPIKey}&pageSize=100&country=in`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      kkey: uuidv4(),
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

async function getHomepageNewsHi() {

  const apiResJson = await parse('https://www.abplive.com/home/feed');

  const data = (apiResJson?.items || []).map((news, i) => {
    return {
      key: uuidv4(),
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

async function getHomepageNewsMr() {
  const apiRes = await fetch(`https://gnews.io/api/v4/search?q=example&apikey=20f8b9a1bfbb46ef961e11cec6367fd7&lang=hi`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const apiResJson = await apiRes.json();

  const data = (apiResJson?.articles || []).map((news, i) => {
    return {
      key: uuidv4(),
      author: news.author,
      title: news?.title,
      description: news.description,
      content: news.content,
      url: news.url,
      urlToImage: news.image,
      video: false,
      time: (news?.publishedAt ? (new Date(news?.publishedAt)).toLocaleDateString() : ''),
      sourceLink: news?.source?.url,
      logo: news.image
    }
  });

  return data
}

// const getKeys = (prefLanguage,prefNews)=>{

//   if(prefLanguage==='en' && prefNews='')
// }

// Handler for the /api/news route
export default async function handler(req, res) {

  let {name="", mobile="", prefNews=["General"], prefLanguage="english", lang = 'en' } = req?.query || {};

  prefLanguage = prefLanguage.toLowerCase();

  if(prefLanguage==="english"){
    handleNewsEn(req, res);
  }else if(prefLanguage==="hindi"){
    handleNewsHi(req, res);
  }else if(prefLanguage==="marathi"){
    handleNewsMr(req, res);
  }else{
    handleNewsEn(req, res);
  }

  return;



  // const cacheKey = 


  // const cacheKey = cacheKeys[lang] ? cacheKeys[lang] : 'en'; // Key to identify the cached response
  // const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

  // try {
  //   // Check if the response is already cached and not expired
  //   const cachedData = await CacheNewsHomepag.findOne({ cacheKey });
  //   if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
  //     console.log('Returning cached response');
  //     return res.json({ data: cachedData.data });
  //   }
  //   console.log("New Request Send");

  //   const response = await homepageNews[lang];

  //   // Update or create the cache with the new response
  //   await CacheNewsHomepag.updateOne(
  //     { cacheKey },
  //     { data: response, timestamp: Date.now() },
  //     { upsert: true }
  //   );

  //   // Return the response
  //   return res.json({ data: response });

  // } catch (error) {
  //   console.error('Error fetching news:', error);
  //   return res.status(500).json({ error: 'Error fetching news' });
  // }
}
