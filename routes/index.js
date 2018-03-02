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
	if (!req.body.username) var login = true;
	else login = false;
	res.render('index', { login });
});

router.post('/ttt/play', function tttPost(req, res, next) {
	var cookie = currentUser._doc;
	var move = req.body.move;

	console.log('PLAYER:' + cookie.username + ' MOVE:' + move);
	// if move = null
	if (move == null) {
		console.log("MOVE NULL");
		res.status(200).json({
			status: 'OK',
			grid: [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']
		});
		return;
	}

	User.findOne({ username: cookie.username }, function makeMove(err, user) {
		console.log('FOUND: ' + user.username);

		var firstGame = user.games.length == 0;
		var updateGame = true;

		if (firstGame) {
			var id = 1;
			var startDate = Math.floor(new Date() / 1000);
			var grid = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
			grid[move] = 'X';
			var winner = ' ';

			console.log('First Game: ' + grid);

			//add game to games array
			user.games.push({ id: id, start_date: startDate, grid: grid, winner: winner });

			//update user on database
			user.save(function updateUser(err, updateduser) {
				if (err) return handleError(err);

				//update cookie
				currentUser = Object.assign({}, updateduser);
				//return status and grid
				res.status(200).json({
					status: 'OK',
					grid: grid,
					winner: winner
				});
			});
		} else if (updateGame) {
			var grid = user.games[0].grid;
			grid[move] = 'X';
			console.log("Update: " + grid);

			var winner = checkWinner(grid);

			User.update(
				{'games.id': 1},
				{ $set: {'games.$.grid': grid } },
				function updateGrid(err, result) {
					if (err) console.log(handleError(err));

					//update cookie
					cookie.grid = grid;
					cookie.winner = winner;

					res.status(200).json({
						status: 'OK',
						grid: grid,
						winner: winner
					});
				}
			);


			// //update grid array in game
			// user.games[0].grid[move] = 'X';

			// //update user on database
			// user.save(function updateUser(err, updateduser) {
			// 	if (err) return handleError(err);

			// 	//update cookie
			// 	currentUser = Object.assign({}, updateduser);
			// 	//return status and grid
			// 	res.status(200).json({
			// 		status: 'OK',
			// 		grid: user.games[0].grid,
			// 		winner: user.games[0].winner
			// 	});
			// });
		}
	});
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
					console.log("Verified!");
					res.status(200).json({
						status: 'OK'
					});
				});

			} else {
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

				//add cookie
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
	res.status(200).json({
		status: 'OK',
		games: currentUser._doc.games
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

function checkWinner(grid) {
	if (
		// HORIZONTAL WINS
		(grid[0] == 'X' && grid[1] == 'X' && grid[2] == 'X') ||
		(grid[3] == 'X' && grid[4] == 'X' && grid[5] == 'X') ||
		(grid[6] == 'X' && grid[7] == 'X' && grid[8] == 'X') ||
		// DIAGONAL WINS
		(grid[0] == 'X' && grid[4] == 'X' && grid[8] == 'X') ||
		(grid[2] == 'X' && grid[4] == 'X' && grid[6] == 'X') ||
		// VERTICAL WINS
		(grid[0] == 'X' && grid[3] == 'X' && grid[6] == 'X') ||
		(grid[1] == 'X' && grid[4] == 'X' && grid[7] == 'X') ||
		(grid[2] == 'X' && grid[5] == 'X' && grid[8] == 'X')
	) {
		return 'X'; //return X as winner
	}
	// IF 'O' WINS
	else if (
		// HORIZONTAL WINS
		(grid[0] == 'O' && grid[1] == 'O' && grid[2] == 'O') ||
		(grid[3] == 'O' && grid[4] == 'O' && grid[5] == 'O') ||
		(grid[6] == 'O' && grid[7] == 'O' && grid[8] == 'O') ||
		//DIAGONAL WINS
		(grid[0] == 'O' && grid[4] == 'O' && grid[8] == 'O') ||
		(grid[2] == 'O' && grid[4] == 'O' && grid[6] == 'O') ||
		//VERTICAL WINS
		(grid[0] == 'O' && grid[3] == 'O' && grid[6] == 'O') ||
		(grid[1] == 'O' && grid[4] == 'O' && grid[7] == 'O') ||
		(grid[2] == 'O' && grid[5] == 'O' && grid[8] == 'O')
	) {
		return 'O' //return O as winner
	}else{
		return ' ';
	}
}

module.exports = router;
