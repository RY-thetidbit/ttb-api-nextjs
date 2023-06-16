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

  const apiResJson = await parse('https://www.prabhatkhabar.com/stories.rss');

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

  const apiResJson = await parse('https://www.abplive.com/lifestyle/health/feed');

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

  const apiResJson = await parse('https://www.abplive.com/entertainment/bollywood/feed');

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

  const apiResJson = await parse('https://www.abplive.com/sports/feed');
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

async function getTechnologyNews() {

  const apiResJson = await parse('https://www.abplive.com/technology/feed');
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

const createKey = (prefNews) => {
  // CREATE KEY
  // CHECK FOR CACHE
  let cacheKey = "Hi-"
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

export default async function handleNewsHi(req, res) {
  try {
    let { name = "", mobile = "", prefNews = "General", home = false, newsType = "swapable" } = req?.query || {};

    // SET THE DEFAULT VALUE
    if (!prefNews) prefNews = "General";
    if (!newsType) newsType = "swapable";

    // NEWS TYPE IS 1.SWAPABLE, 2.HOME, 3.SINGLE   AND PARSE THE VALUE
    prefNews = (prefNews || "").split(",");
    newsType = (newsType || "").toLowerCase();

    // ADD GENERAL AS DEFAULT IN PREFNEWS IF NEWSTYPE IS SWAPABLE
    if (!prefNews.includes("General") && newsType === 'swapable') {
      prefNews.push("General");
    }

    const cacheKey = (newsType === 'home') ? "Hi-Home" : createKey(prefNews);
    const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

    // CHECK RESPONSE ALREADY EXIST NOT EXPIRE
    const cachedData = await CacheNewsHomepag.findOne({ cacheKey });

    //  IF RESPONSE SEND CACHE DATA
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
      console.log('Returning cached response');
      return res.json({ data: cachedData.data });
    }

    let response;
    if ((newsType === 'home')) {
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