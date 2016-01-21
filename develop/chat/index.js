'use strict';

/**
 * Import styles and HTML template
 */
import './chat.css';
import template from './chat.jade';


/**
 * Represents a chat.
 */
export default class Chat {

     /**
      * @constructor
      */
    constructor (options) {

        // CREATE CHAT ELEMENTS---

        this._elem = options.elem;
        this._elem.innerHTML = template();
        this._formInput = this._elem.querySelector(".chatForm textarea");
        this._formButton = this._elem.querySelector(".chatForm button");
        this._messageHistory = this._elem.querySelector(".chatHistory");
        this._usersList = this._elem.querySelector(".chatUsers");
        this._errorChat = this._elem.querySelector(".chatForm .chatError");
        this._errorPlace = this._elem.querySelector(".chatLogin .chatError");
        this._name = "";

        // ---CREATE CHAT ELEMENTS

        // SUBMIT MESSAGE---

        this._send = this._send.bind (this);
        this._keySend = this._keySend.bind (this);
        this._formInput.addEventListener("keydown", this._keySend);
        this._formButton.addEventListener("click", this._send);

        // ---SUBMIT MESSAGE

        // LOGIN---

        this._login = this._login.bind (this);
        this._keyLogin = this._keyLogin.bind (this);

        this._loginInput = this._elem.querySelector(".chatLogin input");
        this._loginButton = this._elem.querySelector(".chatLogin button");

        this._loginInput.addEventListener("keypress", this._keyLogin);
        this._loginButton.addEventListener("click", this._login);

        // ---LOGIN

        // LOGOUT---

        this._goodbye = this._goodbye.bind(this);
        window.addEventListener("beforeunload",this._goodbye);

        // ---LOGOUT
    }



    /**
     * send message from ctrl+enter
     */
    _keySend (e) {

        // clear errors if any
        this._clearError (this._errorChat);

        // catch ctrl+enter => send
        if (e.ctrlKey && e.keyCode == 13) this._send ();

    }


    /**
     * send message to chat from button click || _keySend
     */
    _send () {

        // check if input is empty
        if (this._formInput.value.length == "") {
            this._error (this._errorChat, "Введите сообщение для отправки!");
            return;
        }

        // convert \r to html <br>
        let out = this._formInput.value.replace(/\r\n|\r|\n/g,"<br>");

        // OK, let's use old XMLHttpRequest
        let xhr = new XMLHttpRequest();
        xhr.open ("POST", "/send", true);
        xhr.send (JSON.stringify({meassage : out, user : this._name}));

        // clear chat input
        this._formInput.value = "";

    }



    /**
     * login from Enter press
     */
    _keyLogin (e) {

        // check if enter is pressed
        if (e.keyCode != 13) return;
        this._login();

    }


    /**
     * login from mouse click || from _keyLogin
     */
    _login () {

        // clear error if any
        this._clearError (this._errorPlace);

        // check if login is empty
        let name = this._loginInput.value;
        if (name.length < 3) {
            this._error (this._errorPlace, "Логин должен быть больше 2 символов!");
            return;
        }

        let self = this;

        // OK, let's use better PROMISE here
        // send login
        console.log (name);
        this.httpSend("POST", "/login", JSON.stringify({"name" : name}))

        // get answer from server
        .then(
            result => {

                let answer = JSON.parse (result);

                // if login is occupied tell it to user
                if (answer.error) {
                    self._error (self._errorPlace, answer.error);

                    // if login is free => remove loginform and add username to the top of the page
                } else {
                    self._elem.querySelector(".chatLogin").hidden = true;
                    self._name = answer.name;
                    self._elem.querySelector(".chatUsername").innerHTML = " - " + self._name;
                    self._getMessageList ();
                }
            },
            error => {
                console.log (2222222222);
                // try again onerror in .5s
                self._error (self._errorPlace, error);
                setTimeout(self._login(),500);
            }
        );

    }



    /**
     * get message / user lists and fill it to the page
     */
    _getMessageList () {

        let self = this;

        // OK, let's use modern FETCH here
        fetch('/messages')
        .then(function(response) {

            if (response.status != 200) {
                throw("Ошибка загрузки");
            }
            let answer = response.json();
            return answer;
        })

        .then(function(answer) {

            self._messageHistory.innerHTML = answer.messages;
            self._usersList.innerHTML = answer.users;
        })

        .catch(function(err) {
            self._error (self._errorChat, err);
        });

        // continue listening for new messages
        setTimeout (self._getMessageList.bind(self), 1000);
    }



    /**
     *user exit
     */
    _goodbye () {

        // check if user is in the chat
        if (this._name) {

            // OK, let's use simple XMLHttpRequest again
            let xhr = new XMLHttpRequest();
            xhr.open ("POST", "/close", true);
            xhr.send (JSON.stringify({"name" : this._name}));
        }
    }


    /**
     * show error (place, text)
     */
    _error (obj, err) {

        obj.innerHTML = err;

    }


    /**
     * remove error details from page (place)
     */
    _clearError (obj) {

        obj.innerHTML = "";

    }

    /**
     * function for use PROMISE object
     */
    httpSend(method, url, params) {

        return new Promise(function(resolve, reject) {

            var xhr = new XMLHttpRequest();
            xhr.open(method, url, true);

            xhr.onload = function() {
                if (this.status == 200) {
                    resolve(this.response);
                } else {
                    var error = new Error(this.statusText);
                    error.code = this.status;
                    reject(error);
                }
            };

            xhr.onerror = function() {
             reject(new Error("Network Error"));
            };

            xhr.send(params);
        });

    }

}
