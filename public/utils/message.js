const moment = require('moment-timezone');
const formatMessage = (username, text) => {
    // time zone 
    // const Time = new Date().toLocaleTimeString([], { timeStyle: 'short' });
    return {
        username,
        text,
        // time: Time   // there is some problem while deploying in heroku 
        time: moment().tz("Asia/Kolkata").format('h:mm a')
    }
}

module.exports = { formatMessage };