const axios = require('axios');

const getShortUrl = async (req, res) => {
  try {
    const { url } = req?.query || {};
    if (!url) return res.status(400).json({ error: "Please provide url" });

    const encodedParams = new URLSearchParams();
    encodedParams.set('url', url);

    const options = {
      method: 'POST',
      url: 'https://url-shortener-service.p.rapidapi.com/shorten',
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'e278301744msh1c99c69b72ab917p149b25jsn246205d45abb',
        'X-RapidAPI-Host': 'url-shortener-service.p.rapidapi.com'
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return res.status(200).json({ data: response?.data?.result_url });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: 'invalid url'});
    }
  } catch (e) {
    console.log("Method- getUser :", e);
    return res.status(500).json({ message: 'Error fetching user' });
  }
}

// HANDLE ALL USER REQUEST
const handler = async (req, res) => {
  if (req.method === 'GET') {
    await getShortUrl(req, res)
  } else if (req.method === 'POST') {
  } else if (req.method === 'PUT') {
  }
  else {
    res.status(400).json({ error: 'Invalid request method' });
  }
};

export default handler;
