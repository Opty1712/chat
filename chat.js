"use strict";

var querystring = require("querystring"),
	fs = require("fs");

var chat = {};
chat.users = [];
chat.messages = [];

// start chat
function start (response) {
	console.log("Request handler '/' was called.");

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

	let name = "",
		err = "";

	request.on ("readable", function () {
		name = JSON.parse(request.read()).name;
		name = String(name);
	})

		.on ("end", function () {
		if (name != "") {
			if  (chat.users.length > 0) {
				if (chat.users.indexOf(name) != "-1") {
					err = "Данный логин занят!";
				}
			}
		} else {
			err = "Непредвиденная ошибка!";
		}

		if (err != "") {
			console.log (err);
			response.write(JSON.stringify({error : err}));
		} else {
			chat.users.push (name);
			response.write(JSON.stringify({name : name}));
			addMessage ("<i>Вошел пользователь <b>" + name + "</b></i>");
		}
		response.end();
	});
}

// get messages
function messages(response, request) {
	console.log("Request handler 'messages' was called.");

	if (chat.messages.length > 0) {

		let messages =  chat.messages.reduceRight(function(sum, current) {
			return (sum + "<br><br>" + current);
		});
		let users =  chat.users.reduce(function(sum, current) {
			return (sum + "<p>" + current);
		},"<p>");

		response.write(JSON.stringify({"messages" : messages, "users" : users}));
		response.end();
	}
}

// send message
function send(response, request) {
	console.log("Request handler 'send' was called.");

	let mess = "",
		user = "",
		err = "";

	request.on ("readable", function () {
		let read = JSON.parse(request.read());
		mess = String(read.meassage);
		user = String(read.user);
	})

		.on ("end", function () {

		if (err != "") {
			response.write(JSON.stringify({error : err}));
		} else {
			response.write(JSON.stringify({status : "ok"}));
			let message = "<b>" + user + "</b>: " + mess;
			addMessage (message);
		}
		response.end();
	});
}

// add system message
function addMessage (mess) {
	let now = new Date();
	let sec = now.getSeconds();
	if (sec < 10) sec = "0" + sec;
	chat.messages.push (`<u>${now.getHours()}:${now.getMinutes()}:${sec}</u> /  ${mess}`);
}

// close chat
function close (response, request) {
	console.log("Request handler '/close' was called.");

	request.on ("readable", function () {
		let name = JSON.parse(request.read()).name;
		name = String(name);
		addMessage ("<i>Ушел пользователь <b>" + name + "</b></i>");
		chat.users.splice(chat.users.indexOf (name), 1);
	});

}

exports.start = start;
exports.send = send;
exports.messages = messages;
exports.users = users;
exports.app = app;
exports.close = close;
