var nlp;
module.exports.getNouns = function(str, callback) {
    if (!nlp) {
        nlp = require('nlp_compromise');
    }
    var words = str.split(" ");
    var tags = nlp.text(str).tags()[0];
    //console.log(JSON.stringify(tags));
    var nouns = [];
    for (var i = 0; i < tags.length; i++) {
        if (words[i] != "weather" && tags[i] === "Noun" || tags[i] === "City" || tags[i] === "region" || tags[i] === "country") {
            nouns.push(words[i]);
        }
    }
    ai_nlp.verifyCities(nouns, function(cities) {
        callback(cities);
    });

};

module.exports.verifyCities = function(cities, callback2) {
    var verifiedCities = [];
    require("fs").readFile(__dirname + "/cities.txt", function(err, cont) {
        if (err)
            throw err;   
        for (var i = 0; i < cities.length; i++) {
            var city = cities[i].charAt(0).toUpperCase() + cities[i].slice(1);
            if (cont.indexOf(city) > -1) {
                verifiedCities.push(city);
            }
        }
          callback2(verifiedCities);
    });
};
