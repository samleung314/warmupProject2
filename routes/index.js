var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/ttt', function(req, res, next) {
	res.render('index', {condition:true});
});

router.post('/ttt', function(req, res, next) {
	var username = req.body.username;
	console.log(req);
	res.render('index', {condition:false});
});

router.post('/adduser', function(req, res, next) {
});

router.post('/verify', function(req, res, next) {
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