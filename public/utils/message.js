
const formatMessage = (username, text) => {
    // time zone 
    const Time = new Date().toLocaleTimeString([], { timeStyle: 'short' });
    return {
        username,
        text,
        time: Time
    }
}

module.exports = { formatMessage };