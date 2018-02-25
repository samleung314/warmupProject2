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

module.exports = router;