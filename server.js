/** creating web server by express */
const { application } = require('express');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3500 ; 


/** MIDDLEWARE */


/** Custom Middleware */
/** without custom middleware */
// app.use((req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLogs.txt');
//     console.log(`${req.method} ${req.url}`)
//     next();
// })

/** with logger middleware */
app.use(logger);


/** third-party middlewares */
const whiteList = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500','https://www.amazon.com'];
const corsOptions = {
    origin : (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1 || !origin ){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus : 200
}
app.use(cors(corsOptions));



/**bilt-in middleware */
/**app.use apply the middleware urlencoded/form data represents the data coming from url */
app.use(express.urlencoded({ urlencoded : false}));

/**middleware for json */
app.use(express.json());

/**serve the static files */
app.use(express.static(path.join(__dirname, '/public')));


app.get('/', (req, res) => {
    console.log('Hello express!')
    // res.send('Hello Express JS');
    // res.sendFile('./views/new-page.html', { root : __dirname }) ;
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/**start with / or end / OR index.html  */
app.get('^/$|index.html', (req,res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

/**with or without extension */
app.get('^/$|new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

/**moved location and redirect to new location */
app.get('^/$|old-page(.html)?', (req, res) => {
    res.redirect( 301, '/new-page.html');
});

/**calling next()/controller/middleware  */
app.get('/hello(.html)?', (req, res, next) => {
    console.log('your are calling middleware');
    next();
}, (req, res) => {
    res.send('Hello there Im middleware');
});

/**cannot sent header after it is sent */
app.get('/middleware(.html)?', (req, res, next) => {
    res.send('Hello handler')
    next();
}, (req, res) => {
    res.send('Hello there Im middleware');
})

// app.get('/*', (req, res) => {
//     res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
// })

app.all('*', (req, res) =>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else  if(req.accepts('json')){
        res.json({error: "404 Page Not Found!"})
    }else{
        res.type('txt').send("404 Page not found")
    }
})

/** error handler */
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));