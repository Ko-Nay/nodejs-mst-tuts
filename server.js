/** creating web server by express */
const { application } = require('express');
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const {logger} = require('./middleware/logEvent')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3500 ; 

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

app.use(express.urlencoded({ urlencoded : false}));
app.use(express.json());

/**serve the static files */
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));


/** ROUTES */
app.use('/', require('./routes/root'));
app.use('/subdir', require('./routes/subdirRoute'));
app.use('/employees', require('./routes/api/employees'));


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