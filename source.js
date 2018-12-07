const DarkSky = require('forecast.io');
const twilio = require('twilio');
const schedule = require('node-schedule');

//pull out local environment variables.
let accountSid = process.env.TWILIO_SID;
let authToken = process.env.TWILIO_AUTHTOKEN;

let client = new twilio(accountSid, authToken); // connect twilio developer account.

let options = {
    APIKey: process.env.DARKSKY_API_KEY
};

let latitude = 34.9422185;
let longitude = -81.0324493;




console.log('started');
schedule.scheduleJob("30 8 * * *", () => {

    darksky = new DarkSky(options);
    darksky.get(latitude, longitude, function(err, res, data) {
        let daily = {
            high: Math.round(data.daily.data[0].apparentTemperatureHigh),
            low: Math.round(data.daily.data[0].apparentTemperatureLow)
        };
        let current = {
            temp: Math.round(data.currently.apparentTemperature),
            condition: conditionCheck(data.currently.icon)
        };

        function conditionCheck(iconString) {
            switch (iconString) {
                case "rain":
                    return "rain. Necesitas paraguas hombre";
                    break;
                case "snow":
                    return "BEAUTIFUL WHITE POWDER! HAPPY SNOW DAY! ";
                    break;
                case "sleet":
                    return "miniature ice bullets falling from the sky. Good luck my dude it's mankey out there. ";
                    break;
                case "fog":
                    return "a dense void of grey. Take solice in the agony of your own existence. ";
                    break;
                default:
                    return "that it looks pretty normal. ";
                    break;
            }
        }

        let report = {
            intro: "Good Morning Dom! It's just future you hitting you up with that weather dawg! At the moment it's about ",
            currentString: current.temp + " degrees outside. Take a gander through the window. You should see " + current.condition,
            dailyString: "For the rest of the day you can get amped about a max heat of around " + daily.high + " and a max cold of about " + daily.low + ". Check wit ya manana."
        };

        console.log(report.intro + report.currentString + report.dailyString);

        client.messages.create({
            to: "+13212988230",
            from: "+17403060543",
            body: report.intro + report.currentString + report.dailyString
        });

    });
});
