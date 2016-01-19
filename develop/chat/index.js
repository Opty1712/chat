'use strict';

import './chat.css';
import template from './chat.jade';

export default class Chat {

    constructor (options) {

        // CREATE CHAT---

        this._elem = options.elem;
        this._elem.innerHTML = template();
        this._form = this._elem.querySelector(".chatForm");
        this._messageHistory = this._elem.querySelector(".chatHistory");

        // ---CREATE CHAT

        // SUBMIT MESSAGE---

        this._send = this._send.bind (this);
        this._form.addEventListener("submit", this._send);


        // ---SUBMIT MESSAGE

        // LOGIN---

        this._login = this._login.bind (this);
        this._keyLogin = this._keyLogin.bind (this);

        this._loginInput = this._elem.querySelector(".chatLogin input");
        this._loginButton = this._elem.querySelector(".chatLogin button");

        this._loginInput.addEventListener("keypress", this._keyLogin);
        this._loginButton.addEventListener("click", this._login);

        // ---LOGIN
    }

    // send message to chat
    _send () {

        let input = this._form.querySelector("textarea");
        let xhr = new XMLHttpRequest();
        xhr.open ("POST", "/send", true);
        xhr.send (JSON.stringify({meassage : input.innerHTML}));
        input.innerHTML = "";
        return false;

    }

    // login from Enter press
    _keyLogin (e) {

        if (e.keyCode != 13) return;
        this._login();

    }

    // login from mouse click || from _keyLogin
    _login (name) {

        let xhr = new XMLHttpRequest();
        xhr.open ("GET", "/send", true);
        xhr.send ();
        this._loginInput.value;
        this._elem.querySelector(".chatLogin").hidden = true;
        return false;

    }

    // get message list
    _getMessageList () {

        let xhr = new XMLHttpRequest();
        xhr.open ("GET", "/messages", true);

        xhr.addEventListener("load", this._getMessageList (xhr));

        let self = this;
        xhr.addEventListener("error", function () {
            setTimeout (self._getMessageList, 500);
        });

        xhr.send ();

    }

    // show message list
    _showMessageList (xhr) {

        this._messageHistory.innerHTML = xhr;

    }

}
