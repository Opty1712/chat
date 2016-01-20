DESCRIPTION

Frontend simple chat using webpack. Written on ES6 class with Babel 6 support
Working under WINDOWS:
- NODE v5.4.1
- npm v3.5.3




INSTALLATION

1) run "npm i" - it will load all dependencies from package.json

2) run "webpack" - it will build "app.js" and move it to the root folder

2.1) use "NODE_ENV=development" for developing (watch = true, minification = false, devtool = "cheap-module-inline-source-map")

2.2) use "NODE_ENV=production" for production (watch = false, minification = true, NO devtool)

3) start app "node index.js" and navigate your browser to http://127.0.0.1:8080/



KNOWN ISSUES

If project runs not under WINDOWS may be you need to check lines 19-20 in "webpack.config.js"