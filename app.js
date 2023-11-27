// get express
const express = require('express');
const app = express();

// get ejs layouts
const expressLayouts = require('express-ejs-layouts');

// get routers from controllers (routes)
const indexRouter = require('./routes/index');
const updateStatusRouter = require('./routes/update-status');
const getStatusRouter = require('./routes/get-status');

// setup basics
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

// some middlewares to parse POST data
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// sanity check for launch
console.log("Starting...");

// send all traffic to index router in routes
app.use('/', indexRouter);
app.use('/update-status', updateStatusRouter);
app.use('/get-status', getStatusRouter);

// listen at the port, default to 3000
app.listen(process.env.PORT || 80);
