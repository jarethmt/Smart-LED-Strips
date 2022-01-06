var ledController = require('./components/led-controller');

var express = require("express");
var app = express();


//Run a web server to change flash patterns
app.listen(80, () => {
    console.log("Server running on port 80");


	app.get('/', (req, res) => {
		res.sendFile(__dirname + '/frontend/index.html');
	});

    app.get("/pattern/:patternId/:color", (req, res, next) => {
		ledController.setPattern(req.params.patternId, req.params.color);
		res.redirect('/');
    });

	app.get("/color/:color", (req, res, next) => {
		ledController.setColor(req.params.color);
		res.redirect('/');
    });

	app.get("/power/on", (req, res, next) => {
		ledController.setPattern('pulse', '#ffffff');	
		res.redirect('/');
	});

	app.get('/power/off', (req, res, next) => {
		ledController.powerOff();
		res.redirect('/');
	});
});
