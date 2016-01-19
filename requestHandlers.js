"use strict";

var querystring = require("querystring"),
	fs = require("fs");

var chat = {};
chat.users = [];
chat.messages = [];

// start chat
function start (response) {
	console.log(chat);

	fs.readFile ("index.html", {encoding: "utf-8"},function (error, data) {
		if (error) {
			console.log (error);
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write(data);
			response.end();
		}
	});

}

// get app.js to browser
function app (response) {
	console.log("Request handler 'app' was called.");

	fs.readFile("app.js", "binary", function(error, data) {
		if(error) {
			console.log (error);
		} else {
			response.writeHead(200, {"Content-Type": "text/script"});
			response.write(data, "binary");
			response.end();
		}
	});

}

// get users
function users (response, request) {
	console.log("Request handler 'login' was called.");

	let name = "";
	request.on ("readable", function () {
		name = JSON.parse(request.read()).name;
	})
	.on ("end", function () {
		name = JSON.parse(name);
		console.log (name);
		chat.users.push(1);
	});
	response.end();
}

// get messages
function messages(response, request) {
	console.log("Request handler 'messages' was called.");
}

// send message
function send(response, request) {
	console.log("Request handler 'send' was called.");
}

exports.start = start;
exports.send = send;
exports.messages = messages;
exports.users = users;
exports.app = app;