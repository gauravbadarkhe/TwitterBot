module.exports.getWeather = function(user, place, callback) {
    var weather = require('weather-js');
    weather.find({
        search: place,
        degreeType: 'C'
    }, function(err, result) {
        if (err) {
            console.log("Error==>>"+err)
            return
        }else{
          callback(user+"#Current #Weather for #"+place+" \n\n"+ai_weather.createWeatherReport(result));
        }
        utils.appendFile(JSON.stringify(result), "weather.json");
    });

    // //import weather from 'yahoo-weather'; // or require it
    // var weather = require('yahoo-weather')
    // console.log("place==>>" + place)
    // weather(place).then(info => {
    //
    //     utils.appendFile(JSON.stringify(info), "weather.json");
    // }).catch(err => {
    //     // Oops! Errors! :(
    //     console.log("Error==>>" + err)
    // });
};


module.exports.getPlaceName = function(str) {
    nlp = require('nlp_compromise');
    return nlp.place(str).city;

};


module.exports.createWeatherReport = function(data) {
    var sky = data[0].current.skytext;
    var temp = data[0].current.temperature;
    var humid = data[0].current.humidity;
    var wind = data[0].current.winddisplay;
    var local_time = data[0].current.date + "  " + data[0].current.observationtime
    var report = '#SkyType : %s\n#Temperature : %s°C\n#Humidity : %s\n#Winds : %s';//\nUpdatedOn : %s';
    return utils.parse(report, sky, temp, humid, wind);
};
