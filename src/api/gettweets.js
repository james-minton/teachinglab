require("dotenv").config();

var Twitter = require("twitter");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var params = {screen_name: "TeachingLabHQ", count: "10"};

function getCallbackObj(statusCode, bodyObj) {
  return {
    statusCode: statusCode,
    headers: {
      'content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'x-requested-with, x-requested-by, Access-Control-Allow-Origin, content-type, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
    },
    body: JSON.stringify(bodyObj)
  };
}

function getTweets(callback) {
  console.log("getTweets");
  client.get("statuses/user_timeline", params, function(error, tweets, response) {
    if (!error) {
      callback(null, {
        statusCode: 200,
        headers: {
          'content-type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(tweets)
      })
    } else {
      // console.log("have error");
      callback(error.message);
    }
  });
}

function preflight(callback) {
  console.log('preflight');
  callback(null, getCallbackObj(204, {'result': 'Preflight success.'}))
}

exports.handler = (event, context, callback) => {
  // If it's a get request, we return the tweets data.
  if (event.httpMethod === "GET") {
    console.log("getting tweets");
    const result = getTweets(callback);
  }
  if (event.httpMethod === "OPTIONS") {
    console.log("returning preflight response");
    const result = preflight(callback);
  }
}
