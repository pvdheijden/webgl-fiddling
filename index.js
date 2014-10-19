'use strict';

var express = require("express");
var morgan = require('morgan');
var compression = require('compression');
var serve_favicon = require('serve-favicon');
var serve_static = require('serve-static');

var app = express();
app.disable('x-powered-by');

app.use(morgan('dev'));

app.use(serve_favicon('public/favicon.ico', { maxAge: 365 * 86400000 }));
app.use(serve_static('public', {'index': ['index.html']}));

app.use(compression());


var port = process.env.PORT || 8080;
app.listen(port, function() {
	console.log("Listening on " + port);
});
