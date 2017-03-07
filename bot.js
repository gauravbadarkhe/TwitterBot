console.log("Bot is starting!!");

var Twit = require('twit'); //Get twit in current project
config = require('./config'); //Get twitter api keys or other constants and configs
utils = require('./utils'); //Get all utils methods
requestify = require('requestify'); //Get requestify to make Http calls
ai_quote = require('./ai_quotes'); //In house methodes for quotes bot
ai_weather = require('./ai_weather'); //In house methodes for quotes bot
fs = require('fs'); //Get node file system to manipulate files
jsonquery = require('json-query'); // Get json-query to appy complex filters in JSON array/object
createTextVersion = require("textversionjs"); //Strip HTML from string and get plain text verison
Entities = require('html-entities').XmlEntities; //Strip HTML from string and get plain text verison


entities = new Entities();
T = new Twit(config.apiKeys_quotesBot);
stream = T.stream('user');
stream.on('follow', utils.followed);
//utils.tweetIt("#HelloWorld I am alive!!!");
//utils.filterStream("statuses/filter","India");
utils.myTweetStream();
