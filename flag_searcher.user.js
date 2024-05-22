// ==UserScript==
// @name         Flag searcher
// @namespace    https://github.com/danthe1st/
// @version      1.0.1
// @description  Search flags on Stack Exchange sites
// @author       danthe1st
// @match        *://*.stackexchange.com/users/flag-summary/*
// @match        *://*.stackoverflow.com/users/flag-summary/*
// @match        *://*.superuser.com/users/flag-summary/*
// @match        *://*.serverfault.com/users/flag-summary/*
// @match        *://*.askubuntu.com/users/flag-summary/*
// @match        *://*.stackapps.com/users/flag-summary/*
// @match        *://*.mathoverflow.net/users/flag-summary/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/flag_searcher.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/flag_searcher.user.js
// ==/UserScript==

(function() {
    'use strict';

    const processPage = (parsed, expected) => {
        const flaggedPosts = parsed.getElementsByClassName("flagged-post");
        for(let elem of flaggedPosts){
            content = elem.textContent.trim().toLowerCase().replaceAll(/\s+/g," ");
            if(content.includes(expected)){
                resultBox.appendChild(elem);
            }
        }
    };

    const findFlagsWithOutcome = expected => {
        const params = new URLSearchParams(document.location.search);
        const parser = new DOMParser();
        resultBox.replaceChildren();
        for(let i=1; i<= lastPage; i++){
            params.set("page",i);
            const site = document.location.origin + document.location.pathname+"?"+params.toString();
            fetch(site)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"))
                .then(doc => processPage(doc, expected));
        }
    };

    const nextPageButton = document.querySelector('a.s-pagination--item[rel="next"]');
    let lastPage = 1;
    if(nextPageButton){
        lastPage = parseInt(nextPageButton.previousElementSibling.text);
    }


    const sidebar = document.getElementById("sidebar");
    const btn = document.createElement("button");
    btn.innerText = "Search flags";
    btn.onclick = evt => {
        const text = prompt("Enter search string");
        findFlagsWithOutcome(text.toLowerCase().replaceAll(/\s+/g," "));
    };
    sidebar.appendChild(btn);

    const resultBox = document.getElementById("mainbar");
})();
