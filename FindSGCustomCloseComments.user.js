// ==UserScript==
// @name         Staging Ground custom close comment finder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Displays statistics about published posts in the Staging Ground review history
// @author       danthe1st
// @match        https://stackoverflow.com/staging-ground/review-history?*reviewAction=VoteAsOffTopic*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/FindSGCustomCloseComments.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/FindSGCustomCloseComments.user.js
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
    
    const processPost = async (pageUrl, row, posts) => {
        const doc = await fetch(pageUrl)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"));
        const commentElements = doc.getElementsByClassName("comment-body");
        let store = false;
        for(let elem of commentElements){
            if(elem.textContent.trim().includes("I think that this topic is off-topic")){
                store=true;
            }
        }
        if(store && !posts.has(pageUrl)){
            posts.add(pageUrl);
            mainTableRowBody.appendChild(row);
        }
    }

    const processHistoryPage = async (historyPageURL, posts) => {
        const doc = await fetch(historyPageURL)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"));
        const rows = doc.querySelectorAll("main table tbody tr");
        const postPromises = []
        for(let row of rows){
            const linkElem=row.querySelector("td:nth-child(2) a");
            if(linkElem){
                postPromises.push(processPost(linkElem.href, row, posts));
            }
        }
        for(let promise of postPromises){
            await promise;
        }
    }

    const run = async evt => {
        resultBox.replaceChildren();
        mainTableRowBody.replaceChildren();

        const params = new URLSearchParams(document.location.search);
        const startPage = params.get("page") ? parseInt(params.get("page")) : 1;
        const lastPage = startPage + parseInt(prompt("Enter requested number of history pages to check"))-1

        const posts = new Set();
        
        addInfo(`processing entries from page ${startPage} up to ${lastPage}...`);
        for(let i=startPage; i <= lastPage; i++){
            addInfo(`processing history page ${i}/${lastPage}...`);
            params.set("page",i);
            const site = document.location.origin + document.location.pathname+"?"+params.toString();
            //limit concurrency by not requsting all pages at once
            //if this is not wanted, it's possible to collect all promises and await them together at the end
            await processHistoryPage(site, posts);
        }
        resultBox.replaceChildren();
        addInfo(`${posts.size} posts found`);
    }

    const reviewCountIndicator = document.getElementsByClassName("js-sg-review-count")[0]
    const btn = document.createElement("button");
    btn.innerText = "find custom close comments";
    btn.onclick = run;
    reviewCountIndicator.parentNode.insertBefore(btn, reviewCountIndicator.nextSibling);//https://stackoverflow.com/a/4793630/10871900
})();

