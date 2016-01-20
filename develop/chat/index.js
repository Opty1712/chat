'use strict';

import './chat.css';
import template from './chat.jade';

export default class Chat {

    constructor (options) {

        // CREATE CHAT---

        this._elem = options.elem;
        this._elem.innerHTML = template();
        this._formInput = this._elem.querySelector(".chatForm textarea");
        this._formButton = this._elem.querySelector(".chatForm button");
        this._messageHistory = this._elem.querySelector(".chatHistory");
        this._usersList = this._elem.querySelector(".chatUsers");
        this._errorChat = this._elem.querySelector(".chatForm .chatError");
        this._name = "";

        // ---CREATE CHAT

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

        this._errorPlace = this._elem.querySelector(".chatLogin .chatError");

        // ---LOGIN
    }

    // send message from ctrl+enter
    _keySend (e) {

        this._clearError (this._errorChat);
        if (e.ctrlKey && e.keyCode == 13) this._send ();

    }


    // send message to chat from button click || _keySend
    _send () {

        if (this._formInput.value.length == "") {
            this._error (this._errorChat, "Введите сообщение для отправки!");
            return;
        }

        let out = this._formInput.value.replace(/\r\n|\r|\n/g,"<br>");
        let xhr = new XMLHttpRequest();
        xhr.open ("POST", "/send", true);
        xhr.send (JSON.stringify({meassage : out, user : this._name}));

        this._formInput.value = "";
        return false;

    }

    // login from Enter press
    _keyLogin (e) {

        if (e.keyCode != 13) return;
        this._login();

    }

    // login from mouse click || from _keyLogin
    _login () {

        this._clearError (this._errorPlace);

        let name = this._loginInput.value;

        if (name.length < 3) {
            this._error (this._errorPlace, "Логин должен быть больше 2 символов!");
            return;
        }

        let xhr = new XMLHttpRequest();
        xhr.open ("POST", "/login", true);
        xhr.send (JSON.stringify({"name" : name}));

        let self = this;

        xhr.onload = function () {
            let answer = JSON.parse (this.responseText);
            if (answer.error) {
                self._error (self._errorPlace, answer.error);
            } else {
                self._elem.querySelector(".chatLogin").hidden = true;
                self._name = answer.name;
                self._elem.querySelector(".chatUsername").innerHTML = " - " + self._name;
                self._getMessageList ();
            }
        };

        xhr.onerror = xhr.onabort = function () {
            setTimeout(self._login(),500);
        };

    }

    // get message list
    _getMessageList () {

        let self = this;

        let xhr = new XMLHttpRequest();
        xhr.open ("GET", "/messages", true);
        xhr.send ();

        xhr.addEventListener("load", function () {
            let answer = JSON.parse (this.responseText);
            self._messageHistory.innerHTML = answer.messages;
            self._usersList.innerHTML = answer.users;
        });

        xhr.addEventListener("error", function () {
            console.log ("error => ", this);
            self._error (self._errorChat, "Ошибка получения списка сообщений");
        });
        setTimeout (self._getMessageList.bind(self), 1000);
    }

    // show error
    _error (obj, err) {

        obj.innerHTML = err;

    }

    // show error
    _clearError (obj) {

        obj.innerHTML = "";

    }

}
