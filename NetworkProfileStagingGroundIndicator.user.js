// ==UserScript==
// @name         Staging Ground Questions in Network profile
// @namespace    https://github.com/danthe1st/
// @version      1.0.0
// @description  Adds an indicator for Staging Ground questions to the network profile
// @author       danthe1st
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/NetworkProfileStagingGroundIndicator.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/NetworkProfileStagingGroundIndicator.user.js
// @match        https://stackexchange.com/users/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==

const parser = new DOMParser();

const processSEAccount = seAccountDoc => {
    const siteProfileLinks = seAccountDoc.querySelectorAll(".account-container .account-site a");
    for(const link of siteProfileLinks){
        const profileUrl = link.href;
        const matchResult = profileUrl.match(/https:\/\/stackoverflow\.com\/users\/(\d+)\/.*/);
        if(matchResult){
            const userId = matchResult[1];
            const searchUrl = `https://stackoverflow.com/search?q=user%3A${userId}+sg%3A1`;
            GM.xmlHttpRequest( {
                url: searchUrl,
                onload: res => {
                    const text = res.response;
		            const htmlDocument = parser.parseFromString(text, "text/html");
                    const postElement = htmlDocument.documentElement.querySelector(".js-search-results .js-post-summary");
		            if(postElement){
                        const contentDiv=document.createElement("a");
                        document.getElementsByClassName("user-details")[0].appendChild(contentDiv);
                        contentDiv.href=searchUrl;
                        contentDiv.textContent="Staging Ground questions found";
                    }
                }});
        }
    }
}

(function() {
    'use strict';

    const currentPageMatch = document.location.href.match(/(https:\/\/stackexchange.com\/users\/\d+)\/.*/);
    if(currentPageMatch){
        const seBaseUserUrl = currentPageMatch[1];
        fetch(`${seBaseUserUrl}?tab=accounts`)
            .then(res => res.text())
            .then(text => {
                const htmlDocument = parser.parseFromString(text, "text/html");
                processSEAccount(htmlDocument);
            })
    }
})();