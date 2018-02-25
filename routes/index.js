var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ttt', function(req, res, next) {
	res.render('index', {login:true});
});

router.post('/ttt', function(req, res, next) {
	res.status(200).json({
		message: 'It works!'
	});

	var username = req.body.username;

	console.log(username)
	var login = !(username.length > 0);
	res.render('index', {login});
});

router.post('/adduser', function(req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	res.status(200).json({
		username: username,
		password: password,
		email: email
	});
});

router.post('/verify', function(req, res, next) {
	var email = req.body.email;
	var key = req.body.key;

	res.status(200).json({
		email: email,
		key: key
	});
});

router.post('/login', function(req, res, next) {
});

router.post('/logout', function(req, res, next) {
});

router.post('/listgames', function(req, res, next) {
});

router.post('/getgame', function(req, res, next) {
});

router.post('/getscore', function(req, res, next) {
});

module.exports = router;