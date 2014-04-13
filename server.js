var express = require("express");

var app = express();
app.use(express.logger());

app.use(express.compress());
app.use(express.static(__dirname + "/www", { maxAge: 365 * 86400000 }));
app.use(express.favicon(path.join(__dirname + '/www/favicon.ico'), { maxAge: 365 * 86400000 }));

app.get("/", function(request, response) {
	response.send("ZifZaf's WebGL demo");
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
	console.log("Listening on " + port);
});
