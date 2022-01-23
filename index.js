const mysql = require('mysql');
const http = require('http');

const port = process.env.PORT || 3000;

const dbConfig = {
	host: "kutnpvrhom7lki7u.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
	user: "eczhxfw46z8qk0op",
	password: "pka5icd23iflxo1t",
	database: "t9ssv5gmp1hwbfux",
	multipleStatements: false,
	reconnect: true
};

var database = mysql.createPool(dbConfig);

database.getConnection((err, dbConnection) => {
	if (!err) {
		console.log("Successfully connected to MySQL");
	}
	else {
		console.log("Error Connecting to MySQL");
		console.log(err);
	}
});

if (process.env.IS_HEROKU) {
	var database = mysql.createPool(dbConfig_heroku);
}

http.createServer(function(req, res) {
	console.log("page hit");
	database.getConnection(function (err, dbConnection) {
		if (err) {
			//Send an HTTP Status code of 500 for server error.
			res.writeHead(500, {'Content-Type': 'text/html'});
			//write the HTML
			res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
			console.log("Error connecting to mysql");
		}
		else {
			dbConnection.query("SHOW VARIABLES LIKE 'version';", (err, result) => {
				if (err) {
					//Send an HTTP Status code of 500 for server error.
					res.writeHead(500, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Database error, check the Heroku logs for the details.</div></body></html>');
					console.log("Error reading from mysql");
					console.log(err);
				}
				else { //success
					//Send an HTTP Status code of 200 for success!
					res.writeHead(200, {'Content-Type': 'text/html'});
					//write the HTML
					res.end('<!doctype html><html><head></head><body><div>Connected to the database, check the Heroku logs for the results.</div></body></html>');

					//Output the results of the query to the Heroku Logs
					console.log(result);
				}
			});
			dbConnection.release();
		}
	});
}).listen(port);



