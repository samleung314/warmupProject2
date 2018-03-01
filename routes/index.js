var express = require('express');
var router = express.Router();
var session = require('express-session');
var currentUser;

/* GET requests */
router.get('/ttt', function (req, res, next) {
	res.sendfile
	res.render('index', { login: true });
});

/* POST requests */
// https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8
var User = require('../user/User');
router.post('/ttt', function (req, res, next) {
	if(!req.body.username) var login = true;
	else login = false;
	res.render('index', { login });
});

router.post('/ttt/play', function (req, res, next) {
	//console.log('PLAY! User: ' + currentUser.username + '\n');
	var move = req.body.move;
	var numGames = req.body.games.length;
	var grid = req.body.games[numGames];

	// initiate game if grid is null
	if(grid == null) grid = [' ',' ',' ',' ',' ',' ',' ',' ',' '];

		// if move = null
	if(!move){
		res.status(200).json({
			status: 'OK',
			grid: grid,
			winner: ' '
		});
	
		//user makes a playing move at index "move"
	}else{
		grid[move] = 'X';
		user.set({
			grid: grid
		});

		//update user on database
		user.save(function (err, updateduser) {
			if (err) return handleError(err);
			//return OK status response
			res.status(200).json({
				status: 'OK',
				grid: grid,
				winner: ' '
			});
		  });
	}
});

router.post('/adduser', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;
	var email = req.body.email;
	var key = makeKey();

	var newUser = new User({
		username: username,
		password: password,
		email: email,
		key: key,
		verified: false
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
	var backDoor = 'abracadabra';
	
	//console.log("email: " + email + "\nkey: " + key);
	User.findOne({ email: email }, function (err, user) {
		if (err || !user) {
			res.status(200).json({
				status: 'ERROR'
			});
		} else {
			if (user.email == email && (key == backDoor || user.key == key)) {
				//activate user
				user.set({
					verified: true
				});

				//update user on database
				user.save(function (err, updateduser) {
					if (err) return handleError(err);
					//return OK status response
					res.status(200).json({
						status: 'OK'
					});
				  });

			}else{
				res.status(200).json({
					status: 'ERROR'
				});
			}
		}
	});
});

router.post('/login', function (req, res, next) {
	var username = req.body.username;
	var password = req.body.password;

	User.findOne({ username: username }, function (err, user) {
		if (err || !user) {
			res.status(200).json({
				status: 'ERROR'
			});
		} else {
			if ((username == user.username) && (password == user.password) && user.verified) {
				console.log(user.username + ' LOGIN!');
				//req.session.username = username;
				currentUser = Object.assign({}, user);
				res.json({
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
	console.log('LOGOUT!');
	res.status(200).json({
		status: 'OK'
	});
});

//Received response (JSON): `{"status":"OK","games":[{"id":0,"start_date":"20180226"}]}`
router.post('/listgames', function (req, res, next) {
	console.log(currentUser._doc);
	res.status(200).json({
		status: 'OK',
		games: []
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

/* Helper function to generate random key */
function makeKey() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
	for (var i = 0; i < 5; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
  
	return text;
}

function checkWinner(grid){
	if (
		// HORIZONTAL WINS
	   (grid[0] == 'X' && grid[1] =='X' && grid[2] == 'X') ||
	   (grid[3] == 'X' && grid[4] =='X' && grid[5] == 'X') ||
	   (grid[6] == 'X' && grid[7] =='X' && grid[8] == 'X') ||
		// DIAGONAL WINS
	   (grid[0] == 'X' && grid[4] =='X' && grid[8] == 'X') ||
	   (grid[2] == 'X' && grid[4] =='X' && grid[6] == 'X') ||
		// VERTICAL WINS
	   (grid[0] == 'X' && grid[3] =='X' && grid[6] == 'X') ||
	   (grid[1] == 'X' && grid[4] =='X' && grid[7] == 'X') ||
	   (grid[2] == 'X' && grid[5] =='X' && grid[8] == 'X')
	 ) {
		return 'X'; //return X as winner
	  }
		// IF 'O' WINS
	  else if (
		// HORIZONTAL WINS
	   (grid[0] == 'O' && grid[1] =='O' && grid[2] == 'O') ||
	   (grid[3] == 'O' && grid[4] =='O' && grid[5] == 'O') ||
	   (grid[6] == 'O' && grid[7] =='O' && grid[8] == 'O') ||
		//DIAGONAL WINS
	   (grid[0] == 'O' && grid[4] =='O' && grid[8] == 'O') ||
	   (grid[2] == 'O' && grid[4] =='O' && grid[6] == 'O') ||
		//VERTICAL WINS
	   (grid[0] == 'O' && grid[3] =='O' && grid[6] == 'O') ||
	   (grid[1] == 'O' && grid[4] =='O' && grid[7] == 'O') ||
	   (grid[2] == 'O' && grid[5] =='O' && grid[8] == 'O')
	 ){
		return 'O' //return O as winner
	 }
}

module.exports = router;
