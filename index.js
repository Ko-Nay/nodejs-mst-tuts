// const {format} = require('date-fns');
// const { v4 : uuid } = require('uuid');

// console.log(format(new Date(), 'yyyy:MM:dd\tHH:mm:ss'))
// console.log(uuid());


/* Event Emitter */
const logEvents = require('./logEvent');
const EventEmitter = require('events');

//we need to create an emitter class that extended from event
class MyEmitter extends EventEmitter{};

//we need to initialize the emitter object
const myEmitter = new MyEmitter();

//then we need to listen(add listener) for the initialized emitter, name the emitter, callBack func to pass to the event emitter 
myEmitter.on('msg', (msg) => logEvents(msg));
myEmitter.on('sms', (sms) => logEvents(sms));


//and then we emit the log event after a specific timeout
setTimeout(() => {
    // myEmitter.emit('msg', 'Log event emitted');
    myEmitter.emit('sms', 'This is sms log event');
}, 2000);

setTimeout(() => {
    myEmitter.emit('msg', 'This is logging message events');
}, 5000);