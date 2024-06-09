// ==UserScript==
// @name         Staging Ground comment chat profile links
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Adds a link to the chat.SO profiles of non-OP's Staging Ground comments
// @author       danthe1st
// @match        https://stackoverflow.com/staging-ground/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGCommentChatLinks.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGCommentChatLinks.user.js
// ==/UserScript==

(function() {
    'use strict';

    const nonOPCommentUserCards = document.querySelectorAll(".threadable-comment__body .comment-body:not(:has(.s-badge)) .s-user-card");
    for(let userCard of nonOPCommentUserCards){
        const userID = userCard.getElementsByClassName("s-avatar")[0].getAttribute("data-user-id");
        const newLink = document.createElement("a");
        newLink.href = `https://chat.stackoverflow.com/users/${userID}`;
        newLink.text = "(Chat)"
        userCard.appendChild(newLink);
    }
})();

