

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
  if (prefNews.includes('General')) newsPromises.push(getGeneralNews());
  if (prefNews.includes('Health')) newsPromises.push(getHealthNews());
  if (prefNews.includes('Entertainment')) newsPromises.push(getEntertainmentNews());
  if (prefNews.includes('Sports')) newsPromises.push(getSportsNews());
  if (prefNews.includes('Technology')) newsPromises.push(getTechnologyNews());

  let promiseData = await Promise.all(newsPromises);
  let results = []

  promiseData.map(async (item) => {
    results = [...results, ...item];
  })

  return results;
}

const sendOSNotification = (notiData) => {
  var axios = require('axios');
  var data = {
    "app_id": "e20037d9-067f-417f-b8f8-dc919bb0b6dd",
    "included_segments": ["Subscribed Users"],
    // "include_external_user_ids":["8983712448"],
    "data": {
      "url": `${notiData.url}`
    },
    "big_picture": `${notiData.urlToImage}`,
    "headings": {
      "en": `${notiData.title}`
    },
    "contents": {
      "en": `${notiData.description}`
    }
  };

  var config = {
    method: 'post',
    url: 'https://onesignal.com/api/v1/notifications',
    headers: {
      'Authorization': 'Basic MjE3NmMzNTctYjBhZS00ZTBhLTk0NzgtNTAzZDY5YmFjMmZi',
      'Content-Type': 'application/json',
      'Cookie': '__cf_bm=dZpKCcDNj5f.jZACpmQQXq85j1C4u0aF70ciabXt5H4-1686636421-0-AbnPnGsin+cGAIYDr3gdoOFFMpSRcibNPVMlWqw2gXha9uRkUc7X41khhBQHCgj5pvuCiBzBbHhXr/CSo4Cj5cg='
    },
    data: data
  };

  axios(config)
    .then(function (response) {
      console.log("***********************axios", JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log('error**************************', error);
    });
}

export default async function handleOSPushNotification(notiNo = 0) {
  const prefNews = ["General"];

  const cacheKey = createKey(prefNews);
  const cacheExpiration = config.cacheExpiration; // 4 hours in milliseconds

  try {
    // CHECK RESPONSE ALREADY EXIST NOT EXPIRE
    const cachedData = await CacheNewsHomepag.findOne({ cacheKey });

    //  IF RESPONSE SEND CACHE DATA
    if (cachedData && Date.now() - cachedData.timestamp < cacheExpiration) {
      sendOSNotification(cachedData.data[notiNo])
      //  CALL THE OS-NOTIFICATION API
      //  return res.json({ data: cachedData.data });
    }

    let response = await getDataFromAPI(prefNews);
    //  CALL THE OS-NOTIFICATION API
    sendOSNotification(response[notiNo])

  } catch (e) {
    console.error('Error fetching news:', error);
    return res.status(500).json({ error: 'Error fetching news' });
  }

}