"use strict";

var server = require("./server");
var router = require("./router");
var requestHandlers = require("./requestHandlers");


var handle = {};
var dir = "/public";

handle["/"] = requestHandlers.start;
handle["/send"] = requestHandlers.send;
handle["/login"] = requestHandlers.users;
handle["/messages"] = requestHandlers.messages;
handle["/app.js"] = requestHandlers.app;

server.start(router.route, handle);