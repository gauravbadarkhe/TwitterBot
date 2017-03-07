//Methode to examine tweet and tweet a  proper quote reponse
module.exports.react = function(tweet) {
    var tweet_search = jsonquery('hashtags.text', {
        data: tweet.entities
    });
    utils.makeFile(JSON.stringify(tweet_search), "quote-tweet-obj.json")
    var user_mentions = utils.getMentionedUsers(tweet);
    var m_length = user_mentions.length;


    if (tweet_search.value.indexOf('weather') > -1) {
        ai_weather.getWeather(user_mentions,ai_weather.getPlaceName(tweet.text), function(data) {
            utils.tweetIt(data);
        });

        return
    }

    if (tweet_search.value.indexOf('quoteoftheday') > -1) {
        var reaction = user_mentions + " this is your #quoteoftheday #bot #response.";
        ai_quote.randomQuote(function(quote) {
            utils.tweetIt(user_mentions + quote);
        }, m_length);
        return
    }

    if (tweet_search.value.indexOf('quote') > -1) {

        var reaction = user_mentions + " this is your #quote #bot #response.";
        ai_quote.randomQuote(function(quote) {
            utils.logit(quote);
            utils.tweetIt(user_mentions + quote);
        }, m_length);
        return
    }
};


//Get random quote from api alos checks the lenght including user_mentions
module.exports.randomQuote = function(callback, otherString) {
    utils.logit("Fetching quote");
    requestify.get(config.randomQuote).then(function(response) {

        var quote = utils.stripHTML(response.getBody()[0].content) + "-" + utils.stripHTML(response.getBody()[0].title);
        utils.logit(parseInt(quote.length) + parseInt(otherString));
        if (parseInt(quote.length) + parseInt(otherString) > 140) {
            ai_quote.randomQuote(callback, otherString);
        } else {
            callback(quote, otherString);
        }
    });
};
