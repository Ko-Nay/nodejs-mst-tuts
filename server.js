/** Creating NODE WEB SERVER **/
/** node web server is created by http common core module */
const http = require('http');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = require('./logEvent');
const eventEmitter = require('events');
class Emitter extends eventEmitter{};

const myEmitter = new Emitter();

myEmitter.on('log', (msg, fileName) => logEvents(msg, fileName))

/* define the port number that will host server */
const PORT = process.env.PORT || 3500; 

/* the files that will be served have path, contentType and response */
const serveFile = async(pathFile, contentType, response) => {
    try{
        const rawData = await fsPromises.readFile(
            pathFile, 
            !contentType.includes('image') ? 'utf8' : ''
            );
        const data = contentType === 'application/json' ? JSON.parse(rawData) : rawData;
        response.writeHead(200, { 'Content-type' : contentType });
        response.end(
            contentType === 'application/json' ? JSON.stringify(data) : data
        );

    }catch(err){
        console.log(err);
        myEmitter.emit('log',`${err.name} \t ${err.message}`, 'errLog.txt');
        response.statusCode = 500;
        response.end();
    }
}

/* create actual server to host to the PORT by http.createServer() */
const server = http.createServer((req, res) => {
    console.log(req.url, req.method);

    myEmitter.emit('log',`${req.url} \t ${req.method}`, 'reqLog.txt');

    const extension = path.extname(req.url);
    let contentType ;
    switch(extension) {
        case '.css' : 
            contentType = 'text/css';
            break;
        case '.js':
            contentType = "text/javascript";
            break;
        case '.json': 
            contentType ="application/json";
            break;
        case '.jpg':
            contentType = "image/img";
            break;
        case '.png':
            contentType = "image/img";
            break;
        case '.txt':
            contentType = "text/plain";
            break;
        default:
            contentType ="text/html";
    }

    let pathFile = 
        contentType === 'text/html' && req.url === '/'
            ? path.join(__dirname, 'views', 'index.html')
            : contentType === 'text/html' && req.url.slice(-1) === '/'
                ? path.join(__dirname, 'views', req.url, 'index.html') 
                : contentType === 'text/html' 
                    ? path.join(__dirname, 'views', req.url)
                    : path.join(__dirname, req.url);

    if(!extension  && req.url.slice(-1) !== '/' ) pathFile += '.html';

    const fileExists = fs.existsSync(pathFile);

    if(fileExists){
        //server file
        serveFile(pathFile, contentType, res);

    }else{
        //404
        //301 Redirect
        switch(path.parse(pathFile)){
            case 'old-page.html':
                res.writeHead(301, {'Location ' : '/new-page.html'}) ;
                res.end();
                break;
            case 'www-page.html':
                res.writeHead(301, { 'Location ' : '/'});
                res.end();
                break;
            default :
            serveFile(path.join(__dirname, 'views', '404.html' ), 'text/html', res);
        }
    }

})

/* server is listen to the PORT and return a call back function */
server.listen(PORT, () => console.log(`Server is running on ${PORT}`))