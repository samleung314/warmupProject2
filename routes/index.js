var express = require('express');
var router = express.Router();

/* GET requests */
router.get('/ttt', function (req, res, next) {
	res.render('index', { login: true });
});

/* POST requests */
// https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8
var User = require('../user/User');
router.post('/ttt', function (req, res, next) {
	res.status(200).json({
		message: 'It works!'
	});

	var username = req.body.username;

	console.log(username)
	var login = !(username.length > 0);
	res.render('index', { login });
});

router.post('/adduser', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;

	var newUser = new User({
		username: username,
		password: password,
		email: email
	});

	newUser.save(function (err, newUser) {
		if (err) return console.error(err);
		else console.log("User Saved!");
	});

	res.status(200).json({
		status: 'OK'
	});
});

router.post('/verify', function (req, res, next) {
	var email = req.body.email;
	var key = req.body.key;

	User.findOne({ email: email }, function (err, user) {
		var backDoor = 'abracadabra';
		if (err || !user) {
			res.status(200).json({
				status: 'ERROR'
			});
		} else {
			if (email == user.email) {
				res.status(200).json({
					status: 'OK'
				});
			}
		}
	});
});

router.post('/login', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	console.log("username: " + username + "\nPass: " + password);

	User.findOne({ username: username }, function (err, user) {
		if (err || !user) {
			res.status(200).json({
				status: 'ERROR'
			});
		} else {
			console.log("username2: " + user.username + "\nPass2: " + user.password);
			if ((username == user.username) && (password == user.password)) {
				res.status(200).json({
					status: 'OK'
				});
			} else {
				res.status(200).json({
					status: 'ERROR'
				});
			}
		}
	});
});

router.post('/logout', function (req, res, next) {
	res.status(200).json({
		status: 'OK'
	});
});

router.post('/listgames', function (req, res, next) {
	res.status(200).json({
		status: 'OK'
	});
});

router.post('/getgame', function (req, res, next) {
	res.status(200).json({
		status: 'OK'
	});
});

router.post('/getscore', function (req, res, next) {
	res.status(200).json({
		status: 'OK'
	});
});

module.exports = router;
