const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const https = require("https");

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/weatherapp.html");
});

app.post("/", (req, res) => {
    const query = req.body.location;
    const apiKey = "ab0f4d558e470017970dea4536dbcbcf";
    const unit = req.body.unit;
    const zip = req.body.zipcode;

    let url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit + "&zip=" + zip + "#";

    https.get(url, resp => {
        console.log(resp.statusCode);

        resp.on('data', (data) => {
            let weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const rain = weatherData.weather[0].main;
            const rainDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

            const time = Date()

            res.write("<p>" + rain + " is a possibility with a/an " + rainDescription + "<img src=" + imageUrl + ">.</p>");
            res.write("<h2>The current temperature in " + query + " is " + temp + ".</h2>");
            res.write("<i>" + time + ".</i>");
            res.send();
        });
    });
});

app.listen(process.env.PORT || port, () => {
    console.log('App is running on port ' + port)
});