var express = require('express');
var  app = express();
var shortenURLcontroller = require('./controllers/shortenURLcontroller');

// set template engine
app.set('view engine', 'ejs');

// static files
app.use(express.static('./public'));

// fire todocontroller
shortenURLcontroller(app);


app.listen(3000);
console.log('You listen in port 3000');
