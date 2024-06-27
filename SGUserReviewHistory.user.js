// ==UserScript==
// @name         Staging Ground user review history
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Filters the Staging Ground review history by users
// @author       danthe1st
// @match        https://stackoverflow.com/staging-ground/review-history*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGUserReviewHistory.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGUserReviewHistory.user.js
// ==/UserScript==

(function() {
    'use strict';
    const resultBox = document.createElement("div");
    const tableContainer = document.querySelector("main .s-table-container")
    tableContainer.parentNode.insertBefore(resultBox, tableContainer);

    const parser = new DOMParser();
    
    const mainTableRowBody = document.querySelector("main table tbody");
    
    const addInfo = info => {
        const resultElem = document.createElement("div");
        resultElem.innerText = info;
        resultBox.appendChild(resultElem);
        return resultElem;
    }

    const processHistoryPage = async (historyPageURL, reviews, targetUserId) => {
        const doc = await fetch(historyPageURL)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"));
        const rows = doc.querySelectorAll(`main table tbody tr[data-userid='${targetUserId}']`);
        for(let row of rows){
            mainTableRowBody.appendChild(row);
            reviews[0]++;
        }
    }

    const run = async evt => {
        resultBox.replaceChildren();
        mainTableRowBody.replaceChildren();

        const params = new URLSearchParams(document.location.search);
        const startPage = params.get("page") ? parseInt(params.get("page")) : 1;
        const lastPage = startPage + parseInt(prompt("Enter requested number of history pages to check"))-1;

        const reviews = [0];
        
        const targetUserId = parseInt(prompt("Please enter user ID of target user"));
        
        if(!targetUserId){
            addInfo("invalid target user ID");
            return;
        }
        
        addInfo(`processing entries from page ${startPage} up to ${lastPage}...`);
        const promises = [];
        for(let i=startPage; i <= lastPage; i++){
            params.set("page",i);
            const site = document.location.origin + document.location.pathname+"?"+params.toString();
            //promises.push(processHistoryPage(site, reviews, targetUserId));
            await processHistoryPage(site, reviews, targetUserId);
            resultBox.replaceChildren();
            addInfo(`processed page ${i}/${lastPage}`);
        }
        resultBox.replaceChildren();
        addInfo(`${reviews[0]} reviews found`);
    }

    const reviewCountIndicator = document.getElementsByClassName("js-sg-review-count")[0]
    const btn = document.createElement("button");
    btn.innerText = "filter by user";
    btn.onclick = run;
    reviewCountIndicator.parentNode.insertBefore(btn, reviewCountIndicator.nextSibling);//https://stackoverflow.com/a/4793630/10871900
})();

