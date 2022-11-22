const {logEvents} = require('./logEvent');

// we want to sent this to the LogEvent for error handling
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}`, 'errLog.txt');
    console.log(err.stack);
    res.status(500).send(err.message);

}

module.exports = errorHandler;