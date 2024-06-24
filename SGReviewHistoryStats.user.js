// ==UserScript==
// @name         approved Staging Ground review statistics
// @namespace    http://tampermonkey.net/
// @version      1.2
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

    const processStats = async stats => {
        const sums = {};
        let count = 0
        for(let unawaitedStat of stats){
            const stat = await unawaitedStat;
            for(let key in stat){
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
        for(let key in sums){
            if(key.startsWith("error")){
                const infoElem = addInfo(`${key}: ${sums[key]}`);
                infoElem.style="color: red";
            }else {
                addInfo(`average ${key}: ${sums[key]/count} (total: ${sums[key]})`);
            }
        }
    }

    const processHistoryPage = async (historyPageURL, pageInfos) => {
        const doc = await fetch(historyPageURL)
                .then(res => res.text())
                .then(txt => parser.parseFromString(txt, "text/html"));
        const links = doc.querySelectorAll("main table tbody tr td:nth-child(2) a");
        for(let link of links){
            pageInfos.push(loadPageInfo(link));
        }
    }

    const showStats = async evt => {
        resultBox.replaceChildren();

        const params = new URLSearchParams(document.location.search);
        resultBox.replaceChildren();
        const startPage = params.get("page") ? parseInt(params.get("page")) : 1;
        const lastPage = startPage + parseInt(prompt("Enter requested number of history pages to check"))-1

        const pageInfos = []

        addInfo(`processing entries from page ${startPage} up to ${lastPage}...`);
        for(let i=startPage; i <= lastPage; i++){
            addInfo(`processing history page ${i}/${lastPage}...`);
            params.set("page",i);
            const site = document.location.origin + document.location.pathname+"?"+params.toString();
            //pageInfos.push(loadPageInfo(site))
            await processHistoryPage(site, pageInfos);
        }

        processStats(pageInfos)
    }

    const reviewCountIndicator = document.getElementsByClassName("js-sg-review-count")[0]
    const btn = document.createElement("button");
    btn.innerText = "approved question stats";
    btn.onclick = showStats;
    reviewCountIndicator.parentNode.insertBefore(btn, reviewCountIndicator.nextSibling);//https://stackoverflow.com/a/4793630/10871900
    //
})();
