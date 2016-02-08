var main =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _chat = __webpack_require__(1);

	var _chat2 = _interopRequireDefault(_chat);

	__webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var chat = new _chat2.default({
	    "elem": elem,
	    "CHAT_OPTIONS": CHAT_OPTIONS
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Import styles and HTML template
	 */

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	__webpack_require__(2);

	var _chat = __webpack_require__(6);

	var _chat2 = _interopRequireDefault(_chat);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	/**
	 * Represents a chat.
	 */

	var Chat = function () {

	    /**
	     * @constructor
	     */

	    function Chat(options) {
	        _classCallCheck(this, Chat);

	        // CREATE CHAT ELEMENTS---

	        this._elem = options.elem;
	        this._elem.innerHTML = (0, _chat2.default)();
	        this._formInput = this._elem.querySelector(".chatForm textarea");
	        this._formButton = this._elem.querySelector(".chatForm button");
	        this._messageHistory = this._elem.querySelector(".chatHistory");
	        this._usersList = this._elem.querySelector(".chatUsers");
	        this._errorChat = this._elem.querySelector(".chatForm .chatError");
	        this._errorPlace = this._elem.querySelector(".chatLogin .chatError");
	        this._name = "";

	        // ---CREATE CHAT ELEMENTS

	        // SUBMIT MESSAGE---

	        this._send = this._send.bind(this);
	        this._keySend = this._keySend.bind(this);
	        this._formInput.addEventListener("keydown", this._keySend);
	        this._formButton.addEventListener("click", this._send);

	        // ---SUBMIT MESSAGE

	        // LOGIN---

	        this._login = this._login.bind(this);
	        this._keyLogin = this._keyLogin.bind(this);

	        this._loginInput = this._elem.querySelector(".chatLogin input");
	        this._loginButton = this._elem.querySelector(".chatLogin button");

	        this._loginInput.addEventListener("keypress", this._keyLogin);
	        this._loginButton.addEventListener("click", this._login);

	        // ---LOGIN

	        // LOGOUT---

	        this._goodbye = this._goodbye.bind(this);
	        window.addEventListener("beforeunload", this._goodbye);

	        // ---LOGOUT
	    }

	    /**
	     * send message from ctrl+enter
	     */


	    _createClass(Chat, [{
	        key: '_keySend',
	        value: function _keySend(e) {

	            // clear errors if any
	            this._clearError(this._errorChat);

	            // catch ctrl+enter => send
	            if (e.ctrlKey && e.keyCode == 13) this._send();
	        }

	        /**
	         * send message to chat from button click || _keySend
	         */

	    }, {
	        key: '_send',
	        value: function _send() {

	            // check if input is empty
	            if (this._formInput.value.length == "") {
	                this._error(this._errorChat, "Введите сообщение для отправки!");
	                return;
	            }

	            var self = this;

	            // send message to the server
	            fetch("/send", {
	                method: "POST",
	                body: 'message=' + this._formInput.value + '&user=' + this._name
	            }).then(function (answer) {
	                return answer.json();
	            }).then(function (answer) {

	                // if we got error from server
	                if (answer.error) {
	                    self._error(self._errorPlace, answer.error);
	                } else {
	                    // clear chat input ater good server response
	                    self._formInput.value = "";
	                }
	            }).catch(function (error) {
	                // show error
	                self._error(self._errorPlace, "Произошла ошибка. Попробуйте еще раз");
	            });
	        }

	        /**
	         * login from Enter press
	         */

	    }, {
	        key: '_keyLogin',
	        value: function _keyLogin(e) {

	            // check if enter is pressed
	            if (e.keyCode != 13) return;
	            this._login();
	        }

	        /**
	         * login from mouse click || from _keyLogin
	         */

	    }, {
	        key: '_login',
	        value: function _login() {

	            // clear error if any
	            this._clearError(this._errorPlace);

	            // check if login is empty
	            var name = this._loginInput.value;
	            if (name.length < 3) {
	                this._error(this._errorPlace, "Логин должен быть больше 2 символов!");
	                return;
	            }

	            var self = this;

	            fetch("/login", {
	                method: "POST",
	                body: 'name=' + name
	            }).then(function (answer) {
	                return answer.json();
	            }).then(function (answer) {

	                // if login is occupied tell it to user
	                if (answer.error) {
	                    self._error(self._errorPlace, answer.error);

	                    // if login is free => remove loginform and add username to the top of the page
	                } else {
	                        self._elem.querySelector(".chatLogin").hidden = true;
	                        self._name = answer.name;
	                        self._elem.querySelector(".chatUsername").innerHTML = " - " + self._name;
	                        self._getMessageList();
	                    }
	            }).catch(function (error) {
	                // try again onerror in .5s
	                self._error(self._errorPlace, error);
	                setTimeout(self._login(), 500);
	            });
	        }

	        /**
	         * get message / user lists and fill it to the page
	         */

	    }, {
	        key: '_getMessageList',
	        value: function _getMessageList() {

	            var self = this;

	            // get messages list from server
	            fetch('/messages').then(function (response) {
	                if (response.status != 200) {
	                    throw "Ошибка загрузки";
	                }
	                var answer = response.json();
	                return answer;
	            }).then(function (answer) {

	                var messages = answer.messages.reduceRight(function (sum, current) {
	                    var addition = "";

	                    addition += "<b>" + current.time + "</b> / ";
	                    addition += "<i>" + current.user + "</i> : ";

	                    // convert \r to html <br>
	                    var messageConverted = current.message.replace(/\r\n|\r|\n/g, "<br>");
	                    addition += messageConverted;

	                    return sum + "<br><br>" + addition;
	                }, "");
	                self._messageHistory.innerHTML = messages;

	                var users = answer.users.reduce(function (sum, current) {
	                    return sum + "<p>" + current;
	                }, "<p>");
	                self._usersList.innerHTML = users;
	            }).catch(function (err) {
	                self._error(self._errorChat, err);
	            });

	            // continue listening for new messages
	            setTimeout(self._getMessageList.bind(self), 1000);
	        }

	        /**
	         *user exit
	         */

	    }, {
	        key: '_goodbye',
	        value: function _goodbye() {

	            // check if user is in the chat
	            if (this._name) {

	                // simple XMLHttpRequest for good-bye, no response required
	                var xhr = new XMLHttpRequest();
	                xhr.open("POST", "/close", true);
	                xhr.send(JSON.stringify({ "name": this._name }));
	            }
	        }

	        /**
	         * show error (place, text)
	         */

	    }, {
	        key: '_error',
	        value: function _error(obj, err) {

	            obj.innerHTML = err;
	        }

	        /**
	         * remove error details from page (place)
	         */

	    }, {
	        key: '_clearError',
	        value: function _clearError(obj) {

	            obj.innerHTML = "";
	        }
	    }]);

	    return Chat;
	}();

	exports.default = Chat;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./chat.css", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./chat.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".chatCommon {\n    width: 90%;\n    margin: 0 auto;\n    display: flex;\n}\n\n.chatHistory {\n    margin-top: 50px;\n    width: 85%;\n    height: 500px;\n    border: 2px solid #77a;\n    border-radius: 5px;\n    padding: 10px;\n    background: #fafafa;\n    overflow: auto;\n    margin-right: 10px;\n}\n\n.chatHistory:before {\n    content: \"\\421\\43E\\43E\\431\\449\\435\\43D\\438\\44F\";\n    position: absolute;\n    top: 60px;\n    font-weight: bold;\n    color: #55f;\n}\n\n.chatHistory u {\n    color: #aaa;\n}\n\n.chatHistory i {\n    color: #999;\n}\n\n.chatHistory b {\n    color: #416999;\n}\n\n.chatUsers {\n    margin-top: 50px;\n    top: 50px;\n    width: 15%;\n    height: 500px;\n    border: 2px solid #77a;\n    border-radius: 5px;\n    padding: 10px;\n    background: #fafafa;\n    overflow: auto;\n}\n\n.chatUsers:before {\n    content: \"\\41F\\43E\\43B\\44C\\437\\43E\\432\\430\\442\\435\\43B\\438\";\n    position: absolute;\n    top: 60px;\n    font-weight: bold;\n    color: #55f;\n}\n\n.chatUsers p {\n   margin: 0 0 5px 0;\n}\n\n.chatUsers p:first-letter {\n    font-weight: bold;\n    font-size: 20px;\n    color: #55f;\n    text-transform: uppercase;\n}\n\n.chatWelcome {\n    width: 90%;\n    margin: 0 auto;\n    color: #009;\n    padding: 10px 0;\n    border-bottom: 1px solid #ddd;\n}\n.chatUsername {\n    font-weight: bold;\n}\n\n.chatForm {\n    width: 90%;\n    margin: 0 auto;\n    margin-top: 10px;\n}\n\n.chatForm textarea{\n    padding: 0;\n    width: 100%;\n    margin: 0 auto;\n    height: 80px;\n    border: 1px solid #999;\n    border-radius: 5px;\n}\n\n\n.chatForm button{\n    float: right;\n    width: 200px;\n}\n\n.chatLogin {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    background: rgba(100, 200, 255, 0.9);\n}\n\n.chatLogin div {\n    width: 400px;\n    margin: 0 auto;\n    text-align: center;\n    padding-top: 20%;\n}\n\n.chatError {\n    color: #00f;\n    font-size: 80%\n}\n\n.chatForm .chatError {\n    float:right;\n    padding: 10px 20px 0 0;\n}", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var jade = __webpack_require__(7);

	module.exports = function template(locals) {
	var buf = [];
	var jade_mixins = {};
	var jade_interp;

	buf.push("<div class=\"chatWelcome\">   мойЧат<span class=\"chatUsername\"></span></div><div class=\"chatCommon\"><div class=\"chatHistory\"></div><div class=\"chatUsers\"></div></div><div class=\"chatForm\"><textarea placeholder=\"Для отправки сообщения в чат:\r\n - нажать CTRL+ENTER \r\n - кликнуть кнопку ниже\"></textarea><button>Отправить</button><span class=\"chatError\"></span></div><div class=\"chatLogin\"><div><b>Введите, пожалуйста, логин</b><br><br><input><button>Войти</button><br><br><span class=\"chatError\"></span></div></div>");;return buf.join("");
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	/**
	 * Merge two attribute objects giving precedence
	 * to values in object `b`. Classes are special-cased
	 * allowing for arrays and merging/joining appropriately
	 * resulting in a string.
	 *
	 * @param {Object} a
	 * @param {Object} b
	 * @return {Object} a
	 * @api private
	 */

	exports.merge = function merge(a, b) {
	  if (arguments.length === 1) {
	    var attrs = a[0];
	    for (var i = 1; i < a.length; i++) {
	      attrs = merge(attrs, a[i]);
	    }
	    return attrs;
	  }
	  var ac = a['class'];
	  var bc = b['class'];

	  if (ac || bc) {
	    ac = ac || [];
	    bc = bc || [];
	    if (!Array.isArray(ac)) ac = [ac];
	    if (!Array.isArray(bc)) bc = [bc];
	    a['class'] = ac.concat(bc).filter(nulls);
	  }

	  for (var key in b) {
	    if (key != 'class') {
	      a[key] = b[key];
	    }
	  }

	  return a;
	};

	/**
	 * Filter null `val`s.
	 *
	 * @param {*} val
	 * @return {Boolean}
	 * @api private
	 */

	function nulls(val) {
	  return val != null && val !== '';
	}

	/**
	 * join array as classes.
	 *
	 * @param {*} val
	 * @return {String}
	 */
	exports.joinClasses = joinClasses;
	function joinClasses(val) {
	  return (Array.isArray(val) ? val.map(joinClasses) :
	    (val && typeof val === 'object') ? Object.keys(val).filter(function (key) { return val[key]; }) :
	    [val]).filter(nulls).join(' ');
	}

	/**
	 * Render the given classes.
	 *
	 * @param {Array} classes
	 * @param {Array.<Boolean>} escaped
	 * @return {String}
	 */
	exports.cls = function cls(classes, escaped) {
	  var buf = [];
	  for (var i = 0; i < classes.length; i++) {
	    if (escaped && escaped[i]) {
	      buf.push(exports.escape(joinClasses([classes[i]])));
	    } else {
	      buf.push(joinClasses(classes[i]));
	    }
	  }
	  var text = joinClasses(buf);
	  if (text.length) {
	    return ' class="' + text + '"';
	  } else {
	    return '';
	  }
	};


	exports.style = function (val) {
	  if (val && typeof val === 'object') {
	    return Object.keys(val).map(function (style) {
	      return style + ':' + val[style];
	    }).join(';');
	  } else {
	    return val;
	  }
	};
	/**
	 * Render the given attribute.
	 *
	 * @param {String} key
	 * @param {String} val
	 * @param {Boolean} escaped
	 * @param {Boolean} terse
	 * @return {String}
	 */
	exports.attr = function attr(key, val, escaped, terse) {
	  if (key === 'style') {
	    val = exports.style(val);
	  }
	  if ('boolean' == typeof val || null == val) {
	    if (val) {
	      return ' ' + (terse ? key : key + '="' + key + '"');
	    } else {
	      return '';
	    }
	  } else if (0 == key.indexOf('data') && 'string' != typeof val) {
	    if (JSON.stringify(val).indexOf('&') !== -1) {
	      console.warn('Since Jade 2.0.0, ampersands (`&`) in data attributes ' +
	                   'will be escaped to `&amp;`');
	    };
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will eliminate the double quotes around dates in ' +
	                   'ISO form after 2.0.0');
	    }
	    return ' ' + key + "='" + JSON.stringify(val).replace(/'/g, '&apos;') + "'";
	  } else if (escaped) {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + exports.escape(val) + '"';
	  } else {
	    if (val && typeof val.toISOString === 'function') {
	      console.warn('Jade will stringify dates in ISO form after 2.0.0');
	    }
	    return ' ' + key + '="' + val + '"';
	  }
	};

	/**
	 * Render the given attributes object.
	 *
	 * @param {Object} obj
	 * @param {Object} escaped
	 * @return {String}
	 */
	exports.attrs = function attrs(obj, terse){
	  var buf = [];

	  var keys = Object.keys(obj);

	  if (keys.length) {
	    for (var i = 0; i < keys.length; ++i) {
	      var key = keys[i]
	        , val = obj[key];

	      if ('class' == key) {
	        if (val = joinClasses(val)) {
	          buf.push(' ' + key + '="' + val + '"');
	        }
	      } else {
	        buf.push(exports.attr(key, val, false, terse));
	      }
	    }
	  }

	  return buf.join('');
	};

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	var jade_encode_html_rules = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;'
	};
	var jade_match_html = /[&<>"]/g;

	function jade_encode_char(c) {
	  return jade_encode_html_rules[c] || c;
	}

	exports.escape = jade_escape;
	function jade_escape(html){
	  var result = String(html).replace(jade_match_html, jade_encode_char);
	  if (result === '' + html) return html;
	  else return result;
	};

	/**
	 * Re-throw the given `err` in context to the
	 * the jade in `filename` at the given `lineno`.
	 *
	 * @param {Error} err
	 * @param {String} filename
	 * @param {String} lineno
	 * @api private
	 */

	exports.rethrow = function rethrow(err, filename, lineno, str){
	  if (!(err instanceof Error)) throw err;
	  if ((typeof window != 'undefined' || !filename) && !str) {
	    err.message += ' on line ' + lineno;
	    throw err;
	  }
	  try {
	    str = str || __webpack_require__(8).readFileSync(filename, 'utf8')
	  } catch (ex) {
	    rethrow(err, null, lineno)
	  }
	  var context = 3
	    , lines = str.split('\n')
	    , start = Math.max(lineno - context, 0)
	    , end = Math.min(lines.length, lineno + context);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == lineno ? '  > ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.path = filename;
	  err.message = (filename || 'Jade') + ':' + lineno
	    + '\n' + context + '\n\n' + err.message;
	  throw err;
	};

	exports.DebugItem = function DebugItem(lineno, filename) {
	  this.lineno = lineno;
	  this.filename = filename;
	}


/***/ },
/* 8 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(10);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, "* {\r\n    font-family: Calibri, Arial;\r\n    font-size: 20px;\r\n}", ""]);

	// exports


/***/ }
/******/ ]);