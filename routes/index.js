var express = require('express');
var router = express.Router();
var session = require('express-session');
var currentUser;
var id = 0;

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

var newGame = false;
router.post('/ttt/play', function tttPost(req, res, next) {
	var cookie = currentUser._doc;
	var move = req.body.move;

	console.log('PLAYER:' + cookie.username + ' MOVE:' + move);

	if (move == null) {
		console.log("MOVE NULL");
		res.status(200).json({
			status: 'OK',
			grid: cookie.games[id - 1].grid
		});
		return;
	}
	var firstGame = cookie.games.length == 0;
	if (firstGame || newGame) {
		newGame = false;
		return addNewGame(cookie.username, move, res);
	}

	var playing = cookie.games[cookie.games.length - 1].winner == ' ';
	if (playing) {
		var grid = cookie.games[cookie.games.length - 1].grid;
		if (grid[move] == 'X') return errorPlay(res);
		else grid[move] = 'X';

		var winner = checkWinner(grid);

		User.update(
			{ 'username': cookie.username, 'games.id': id },
			{ $set: { 'games.$.grid': grid, 'games.$.winner': winner } },
			function updateGrid(err, result) {
				if (err) console.log(handleError(err));

				//update cookie
				cookie.games[cookie.games.length - 1].grid = grid;
				cookie.games[cookie.games.length - 1].winner = winner;

				console.log("Update: " + grid + "Winner: " + winner + '\n');
				res.status(200).json({
					status: 'OK',
					grid: grid,
					winner: winner
				});
			}
		);
	}
});

function addNewGame(name, move, res) {
	User.findOne({ username: name }, function makeMove(err, user) {
		id += 1;
		var startDate = Math.floor(new Date() / 1000);
		var grid = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
		grid[move] = 'X';
		var winner = ' ';

		//add game to games array
		user.games.push({ id: id, start_date: startDate, grid: grid, winner: winner });

		//update user on database
		user.save(function updateUser(err, updateduser) {
			if (err) return handleError(err);

			//update cookie
			currentUser = Object.assign({}, updateduser);
			//return status and grid
			console.log('New Game(id: ' + id + '): ' + grid + '\n');
			res.status(200).json({
				status: 'OK',
				grid: grid,
				winner: winner
			});
		});
	});
}

function errorPlay(res) {
	res.status(200).json({
		status: 'ERROR'
	});
}

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
	//id = 0; //reset cookie id

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
	var gameid = req.body.id;
	console.log('Game id: ' + gameid);

	User.findOne({'games.id': gameid}, function(err, game){
		if(err)console.log(err)
		if(game){
			res.status(200).json({
				status: 'OK',
				grid: game[0].grid,
				winner: game[0].winner,
			});
		}
	})
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
		newGame = true;
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
	} else {
		return ' ';
	}
}

module.exports = router;
