var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '123456789',
	database : 'nodelogin'
});

var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/login', function(request, response) {
	response.sendFile(path.join(__dirname + '/login.html'));
});


app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		connection.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (results.length > 0) {
				request.session.loggedin = true;
				request.session.username = username;
				//response.set({'Content-Length':80});
				//response.writeHead(200,{'Location':'./configure.html'});
				response.redirect('/configure');
				//return(response.redirect('/configure'));
			} else {
				response.send('Incorrect Username and/or Password!');

			}			
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

//var conf=require('./configure.html');
//app.use('/configure',conf);

app.get('/configure', function(request, response) {
	if (request.session.loggedin) {
		//response.send('Welcome back, ' + request.session.username + '!');
		console.log("hy ");
		response.sendFile(path.join(__dirname + '/configure.html'));
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);