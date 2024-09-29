// ==UserScript==
// @name         approved Staging Ground review statistics
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Displays statistics about published posts in the Staging Ground review history
// @author       danthe1st
// @match        https://stackoverflow.com/staging-ground/review-history?*reviewAction=ApproveAndPublish*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGReviewHistoryStats.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGReviewHistoryStats.user.js
// ==/UserScript==

(function() {
    'use strict';
    const resultBox = document.createElement("div");
    const tableContainer = document.querySelector("main .s-table-container")
    tableContainer.parentNode.insertBefore(resultBox, tableContainer);

    const parser = new DOMParser();
    const loadPageInfo = async pageUrl => {
        const doc = await fetch(pageUrl)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"));

        const postInfoBox = doc.getElementsByClassName("js-post-summary")[0];
        if(!postInfoBox){
            return {"error": 1,"error request failure (no information about answers in post)":1}
        }
        const statElements = postInfoBox.getElementsByClassName("s-post-summary--stats-item");
        const result = {}
        for(let elem of statElements){
            const keyChild = elem.children[1];
            if(elem.className.includes("is-deleted")){
                result["deleted"]=1;
            }else if(!keyChild){
                result["error"]=1;
                result["error unknown key element"]=1;
            }else{
                let keyName = keyChild.textContent;
                if(isNaN(keyName)){
                    if(!keyName.endsWith("s")){
                        keyName = keyName + "s";
                    }
                    result[keyName] = parseInt(elem.children[0].textContent);
                }
            }
        }
        const postTitle = postInfoBox.getElementsByClassName("s-post-summary--content-title")[0].textContent.trim();
        if(postTitle.endsWith("[closed]")){
            result["closed"]=1;
        }
        if(postTitle.endsWith("[duplicate]")){
            result["duplicate"]=1;
        }
        return result;
    }

    const addInfo = info => {
        const resultElem = document.createElement("div");
        resultElem.innerText = info;
        resultBox.appendChild(resultElem);
        return resultElem;
    }

    const processStats = async (stats, statsPerAuthor) => {
        const sums = {};
        let count = 0
        for(const unawaitedStat of stats){
            const stat = await unawaitedStat;
            for(const key in stat){
                if(!(key in sums)){
                    sums[key]=0;
                }
                sums[key]+=stat[key];
            }
            if(!("error" in stat)){
                count++;
            }
        }
        resultBox.replaceChildren();

        addInfo(`posts checked: ${count}`);
        for(const key in sums){
            if(key.startsWith("error")){
                const infoElem = addInfo(`${key}: ${sums[key]}`);
                infoElem.style="color: red";
            }else {
                addInfo(`average ${key}: ${sums[key]/count} (total: ${sums[key]})`);
            }
        }
        const authorStatsBox = document.createElement("details");
        const authorStatsDiv = document.createElement("textarea");
        const authorStatsBoxSummary = document.createElement("summary");
        authorStatsBoxSummary.innerText = "per author stats";
        authorStatsBox.appendChild(authorStatsBoxSummary);
        authorStatsBox.appendChild(authorStatsDiv);
        const actualAuthorStats = {};
        for (const [authorUrl, authorStats] of Object.entries(statsPerAuthor)) {
            const statsOfThisAuthor = [];
            for (const stat of authorStats) {
                statsOfThisAuthor.push(await stat);
            }
            actualAuthorStats[authorUrl] = statsOfThisAuthor;
        }
        authorStatsDiv.innerText = JSON.stringify(actualAuthorStats);
        resultBox.appendChild(authorStatsBox);
    }

    const processHistoryPage = async (historyPageURL, pageInfos, pageInfosPerAuthor) => {
        const doc = await fetch(historyPageURL)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"));
        const trs = doc.querySelectorAll("main table tbody tr");
        for(let tr of trs){
            const authorLink = tr.querySelector("td:nth-child(1) a");
            const questionLink = tr.querySelector("td:nth-child(2) a");
            const pageInfo = loadPageInfo(questionLink);
            pageInfos.push(pageInfo);
            if (!(authorLink in pageInfosPerAuthor)) {
                pageInfosPerAuthor[authorLink] = [];
            }
            pageInfosPerAuthor[authorLink].push(pageInfo);
        }
    }

    const showStats = async evt => {
        resultBox.replaceChildren();

        const params = new URLSearchParams(document.location.search);
        resultBox.replaceChildren();
        const startPage = params.get("page") ? parseInt(params.get("page")) : 1;
        const lastPage = startPage + parseInt(prompt("Enter requested number of history pages to check"))-1

        const pageInfos = [];
        const pageInfosPerAuthor = {};

        addInfo(`processing entries from page ${startPage} up to ${lastPage}...`);
        for(let i=startPage; i <= lastPage; i++){
            addInfo(`processing history page ${i}/${lastPage}...`);
            params.set("page",i);
            const site = document.location.origin + document.location.pathname+"?"+params.toString();
            //pageInfos.push(loadPageInfo(site))
            await processHistoryPage(site, pageInfos, pageInfosPerAuthor);
        }

        processStats(pageInfos, pageInfosPerAuthor)
    }

    const reviewCountIndicator = document.getElementsByClassName("js-sg-review-count")[0]
    const btn = document.createElement("button");
    btn.innerText = "approved question stats";
    btn.onclick = showStats;
    reviewCountIndicator.parentNode.insertBefore(btn, reviewCountIndicator.nextSibling);//https://stackoverflow.com/a/4793630/10871900
})();
