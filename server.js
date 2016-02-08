// add dependencies
var http = require("http");
var url = require("url");
var chat = require("./server-chat");

// create callback functions object
var handle = {};
handle["/"] = chat.start;
handle["/send"] = chat.send;
handle["/login"] = chat.users;
handle["/messages"] = chat.messages;
handle["/app.js"] = chat.app;
handle["/close"] = chat.close;

// start server
http.createServer( (request, response) => {

    // get pathname to call function after
    var pathname = url.parse(request.url).pathname;

    // if we have function for this url => go there
    if (typeof handle[pathname] === 'function') {
        handle[pathname](response, request);

    // if we don't have function => 404 error
    } else {
        console.log("No request handler found for " + pathname);
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write("404 Not found");
        response.end();
    }

}).listen(8080);