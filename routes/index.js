const express = require('express')
const router = express.Router()
const axios = require('axios')
const hbs = require('hbs')
const fs = require('fs')

const searchTemp = hbs.handlebars.compile(fs.readFileSync('views/searchResults.hbs').toString('utf-8'))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index',
    {
      title: 'Youtube videos',
    }
    );
});

/**
 * Fn to hit the google translation API
 * @param {*} queryObject 
 * @returns translated text object
 */
const fetchVideos = async (queryObject) => {
  const options = {
    method: 'GET',
    url: `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&channelId=${queryObject.channelId}&key=AIzaSyAKPjJWtsj3JbFuagFOMouHhsJ78kQ-uCc`,
  };
  const language = await axios(options)
  return language.data
}


/* API to fetch the translations */
router.post('/fetch_videos', async (req, res) => {
  try {
    const translatedResult = await fetchVideos(req.body)

    const html = searchTemp({
      message: translatedResult.items
    })

    console.log(html)

    res.send({
      html,
    })

  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
