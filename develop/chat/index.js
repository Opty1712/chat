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

        let self = this;

        // send message to the server
        fetch("/send", {
            method: "POST",
            body: 'message='+ this._formInput.value +'&user='+ this._name
        })
        .then(function (answer) {
            return answer.json();
        })
        .then(function (answer) {

            // if we got error from server
            if (answer.error) {
                self._error (self._errorPlace, answer.error);

            } else {
                // clear chat input ater good server response
                self._formInput.value = "";
            }
        })
        .catch(function (error) {
            // show error
            self._error (self._errorPlace, "Произошла ошибка. Попробуйте еще раз");
        });



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

        fetch("/login", {
            method: "POST",
            body: 'name='+name
        })
        .then(function (answer) {
            return answer.json();
        })
        .then(function (answer) {

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
        })
        .catch(function (error) {
            // try again onerror in .5s
            self._error (self._errorPlace, error);
            setTimeout(self._login(),500);
        });

    }



    /**
     * get message / user lists and fill it to the page
     */
    _getMessageList () {

        let self = this;

        // get messages list from server
        fetch('/messages')
        .then(function(response) {
            if (response.status != 200) {
                throw("Ошибка загрузки");
            }
            let answer = response.json();
            return answer;
        })

        .then(function(answer) {

            let messages =  answer.messages.reduceRight(function(sum, current) {
                let addition = "";

                addition += "<b>" + current.time + "</b> / ";
                addition += "<i>" + current.user + "</i> : ";

                // convert \r to html <br>
                let messageConverted = current.message.replace(/\r\n|\r|\n/g,"<br>");
                addition += messageConverted;
                if (addition != "") addition += "<br><br>";

                return (sum  + addition);
            }, "");
            self._messageHistory.innerHTML = messages;

            let users =  answer.users.reduce(function(sum, current) {
                return (sum + "<p>" + current);
            },"<p>");
            self._usersList.innerHTML = users;

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

            // simple XMLHttpRequest for good-bye, no response required
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

}
