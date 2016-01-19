var querystring = require("querystring"),
	fs = require("fs"),
	formidable = require("formidable");

function start(response) {
  console.log("Request handler 'start' was called.");

  fs.readFile ("index.html", {encoding: "utf-8"},function (err, data) {
	  if (err) {
		  console.log (err);
	  } else {
		  response.write(data);
	  }
  });

}

function upload(response, request) {
  console.log("Request handler 'upload' was called.");

  var form = new formidable.IncomingForm();
  console.log("about to parse");
  form.parse(request, function(error, fields, files) {
	console.log("parsing done");

		console.log (files.upload);
/* �������� ������ � Windows: ������� �������������� ��� ������������� ����� */
	fs.rename(files.upload.path, "tmp/test.png", function(err) {
	  if (err) {
		fs.unlink("tmp/test.png");
		fs.rename(files.upload.path, "tmp/test.png");
	  }
	});
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("received image:<br/>");
	response.write("<img src='/show' />");
	response.end();
  });
}

function show(response) {
  console.log("Request handler 'show' was called.");
  fs.readFile("tmp/test.png", "binary", function(error, file) {
	if(error) {
	  response.writeHead(500, {"Content-Type": "text/plain"});
	  response.write(error + "\n");
	  response.end();
	} else {
	  response.writeHead(200, {"Content-Type": "image/png"});
	  response.write(file, "binary");
	  response.end();
	}
  });
}

exports.start = start;
exports.upload = upload;
exports.show = show;