const moment = require('moment');

const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('LT')
    }
}

console.log(moment().format('LT'));

module.exports = { formatMessage };