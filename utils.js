//Common method to make files in temp directory
module.exports.makeFile = function(data, filename) {
    fs.writeFile("./tmp/" + filename, data, function(err) {
        if (err) {
            return console.log(err);
        }
        //console.log("The file was saved!");
    });
}

//Common method to append files in temp directory
module.exports.appendFile = function(data, filename) {
    fs.appendFile("./tmp/" + filename, data, function(err) {
        if (err) {
            return console.log(err);
        }
        //console.log("The file was updated!");
    });
}

//Common method to log/print data
module.exports.logit = function(data) {
    console.log(data);
}

//Get mentioned user names from any tweet
module.exports.getMentionedUsers = function(tweet) {

    var tweet_search = jsonquery('user_mentions.screen_name', {
        data: tweet.entities
    });
    tweet_search.value.push(tweet.user.screen_name);
    var usernames = "";
    for (var i = 0; i < tweet_search.value.length; i++) {
        if (config.screen_name != tweet_search.value[i]) {
            usernames += "@" + tweet_search.value[i] + " ";
        }
    }
    return usernames;
};

//Common method to handel Twit response
module.exports.tweetedResponse = function(err, data, response) {
    if (err) {
        utils.logit("Error Occured while tweeting!!");
        utils.makeFile(JSON.stringify(err), "tweeted-error.json");
    } else {
        utils.logit("Tweeted Successfully!!");
    }
}

//Common methode to handel Followed response
module.exports.followed = function(data) {
    utils.logit("Followed by : @" + data.source.screen_name + " aka " + data.source.name);
    utils.makeFile(JSON.stringify(data), "followed-response.json");
    ai_quote.randomQuote(function(quote) {
        utils.tweetIt("@"+data.source.screen_name+" " + quote);
    }, data.source.screen_name.length+2);
};

//Common methode to send simple tweet
module.exports.tweetIt = function(data) {
    var tweet = {
        status: data
    };
    T.post('statuses/update', tweet, utils.tweetedResponse);
};

//Start a Stream with given filter and handel response within
module.exports.filterStream = function(endpoint, keyword) {
    var stream = T.stream(endpoint, {
        track: keyword
    });
    stream.on('tweet', filteredTweet);

    function filteredTweet(tweet) {
        utils.logit(tweet.text + "\n\n");
        //  utils.makeFile(JSON.stringify(tweet), "filtered-tweet.json");
    }
};

//Start a Stream with given filter and handel response within
module.exports.myTweetStream = function() {
    var stream = T.stream('user');
    stream.on('tweet', filteredTweet);

    function filteredTweet(tweet) {
        if (tweet.user.screen_name != config.screen_name) {
            utils.logit('tweet occured!!');
            utils.appendFile("\n\n" + tweet.text + "\n-By " + tweet.user.screen_name + " aka " + tweet.user.name, "user-tweet.txt");
            utils.makeFile(JSON.stringify(tweet), "user-tweet-obj.json")
            ai_quote.react(tweet);
        } else {
            utils.logit('tweet occured by me!!');
        }
    }
};


//String html from stirng and get basic/simple text
module.exports.stripHTML = function(str) {
    return  createTextVersion(entities.decode(str));
}


module.exports.parse = function (str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
};
