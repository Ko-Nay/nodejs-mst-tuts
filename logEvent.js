const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const { format } = require('date-fns');
const { v4: uuid } = require('uuid');


// this function only works when the event is emitted that is listened in the index.js file
const logEvents = async (message) => {
    const dateTime = `${format(new Date(), 'yyyy:MM:dd\tHH:mm:ss')}`;
    const logItems = `${dateTime}\t${uuid()}\t${message}\n`;
    console.log(logItems);

    //we wanna append the log
    try{
        if(!fs.existsSync(path.join(__dirname, 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'))
        }
        await fsPromises.appendFile(path.join(__dirname, 'logs', 'eventLogs.txt'), logItems);
    }
    catch(err){
        console.log(err);
    }
}

module.exports = logEvents;