/** creating web server by express */
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const {logger} = require('./middleware/logEvent');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOption');
const verifyJWT = require('./middleware/jwtVerify');
const connectDB = require('./config/connDB');

const PORT = process.env.PORT || 3500 ; 

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended : false}));
app.use(express.json());

app.use(cookieParser());

/**serve the static files */
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

/** ROUTES */
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);
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

mongoose.connection.once('open', () => {
    console.log('Connected to DB');
    app.listen(PORT, () => console.log(`Server is running on ${PORT}`));

})
