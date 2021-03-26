// Cloud hosts like Heroku or Azure, sets NODE_ENV to production and thus dotenv is not required in that case
// Otherwise we need to add it as a dependency and also need to push .env file which is a bad practice.
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config();
// }
const express = require("express");
const bp = require("body-parser");
const https = require("https");
// Cloud hosts like Heroku or Azure, however, use the PORT variable to tell you on which port your server should listen for the routing to work properly
// Helpful read: https://docs.microsoft.com/en-us/azure/app-service/configure-language-nodejs
const PORT = process.env.PORT || 3000
// openweatherapi key
const API_KEY = process.env.API_KEY
// imp read: https://www.dynatrace.com/news/blog/the-drastic-effects-of-omitting-node-env-in-your-express-js-applications/
const app = express();

app.use(bp.urlencoded({extended:true}));

// home route - handle get request
app.get("/" , function (req,res) {
    res.sendFile(__dirname + "/index.html");
});

// home route - handle post request
app.post("/" , function (req,res) {
    var city = req.body.city;
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + API_KEY + "&units=metric";
    https.get(url , function (response) {
        response.on("data" , function (data) {
            var weatherData = JSON.parse(data);
            // console.log(weatherData);
            if (weatherData.cod != 200) {
                res.write('<h1> Sorry your Location is not Found! Try Again with another Location! </h1>');
                res.write("<form action=\"/\" method=\"get\">\n<input type=\"submit\" value=\"Go to Home\"\n />\n</form>");
                res.send();
            }
            else {
                var temp = weatherData.main.temp;
                var desc = weatherData.weather[0].description;
                var icon = weatherData.weather[0].icon;
                var imgUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
                res.write("<h1> Current Temperature in " + weatherData.name + " is : " + temp + " degree Celcius. </h1>");
                res.write("<h2> Description of the Current Weather : " + desc + ". </h2>");
                res.write("<img src = " + imgUrl + ">");
                res.write("<form action=\"/\" method=\"get\">\n<input type=\"submit\" value=\"Go to Home\"\n />\n</form>");
                res.send();
            }
        });
    });    
});

// listen to PORT
app.listen(PORT, function () {
    console.log("Server has started on localhost:" + PORT);
});
