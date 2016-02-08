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

	let answer = "",
		name = "",
		err = "";

    request.on('data', function (data) {
        answer += data;
	})

	.on ("end", function () {
        name = String(querystring.parse(answer).name);
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
			addMessage ("СИСТЕМА", "Вошел пользователь " + name);
		}
		response.end();
	});
}

// get messages
function messages(response, request) {
	console.log("Request handler 'messages' was called.");

	if (chat.messages.length > 0) {

		let messages = chat.messages;
		let users =  chat.users;

		response.write(JSON.stringify({"messages" : messages, "users" : users}));
		response.end();
	}
}

// send message
function send(response, request) {
	console.log("Request handler 'send' was called.");

	let read = "",
        mess = "",
		user = "",
		err = "";

    request.on('data', function (data) {
        read += data;
	})

	.on ("end", function () {

        user = String(querystring.parse(read).user);
        mess = String(querystring.parse(read).message);

		if (err != "") {
			response.write(JSON.stringify({error : err}));
		} else {
			response.write(JSON.stringify({status : "ok"}));
			addMessage (user, mess);
		}
		response.end();
	});
}

// add system message
function addMessage (user, mess) {
	let now = new Date();
	let sec = now.getSeconds();
	if (sec < 10) sec = "0" + sec;
	chat.messages.push ({
        time : `${now.getHours()}:${now.getMinutes()}:${sec}`,
        message : mess,
        user : user
    });

}

// close chat
function close (response, request) {
	console.log("Request handler '/close' was called.");

	request.on ("readable", function () {
		let name = JSON.parse(request.read()).name;
		name = String(name);
		addMessage ("СИСТЕМА", "Ушел пользователь " + name);
		chat.users.splice(chat.users.indexOf (name), 1);
	});

}

exports.start = start;
exports.send = send;
exports.messages = messages;
exports.users = users;
exports.app = app;
exports.close = close;
