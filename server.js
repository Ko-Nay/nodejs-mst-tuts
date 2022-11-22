/** creating web server by express */
const { application } = require('express');
const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 3500 ; 

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

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));