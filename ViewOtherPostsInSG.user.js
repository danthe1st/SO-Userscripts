// ==UserScript==
// @name         View other OP posts in SG
// @namespace    https://github.com/danthe1st/
// @version      1.0
// @description  Display questions from OP when viewing posts in the Staging Ground
// @author       danthe1st
// @match        https://stackoverflow.com/staging-ground/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/ViewOtherPostsInSG.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/ViewOtherPostsInSG.user.js
// @grant        none
// ==/UserScript==

function addPosts(questionId, uID, sg){
	fetch(`https://stackoverflow.com/search?tab=newest&q=is%3Aq+user%3A${uID}+staging-ground%3A${sg}`)
	.then(response => response.text())
	.then(text => {
		const parser = new DOMParser();
		const htmlDocument = parser.parseFromString(text, "text/html");
		const elems = htmlDocument.documentElement.querySelectorAll(".js-search-results .js-post-summary");
        for(const elem of elems){
            const postLink = htmlDocument.querySelector(".s-post-summary--content-title a.s-link").href;
            if(!postLink.contains(questionId)){
                document.querySelector("main").parentElement.appendChild(elem);
            }
        }
	})
}


function getUserId() {//thanks to @Vlaz
    const ownerProfileLink = document.querySelector(".post-signature.owner .user-details a");

    const path = ownerProfileLink.pathname;
    const userId = path.split("/").at(-2);

    return userId;
}

function main(){
    try{
        const questionId = StackExchange.question.getQuestionId();
        const uID=getUserId();
        addPosts(questionId, uID, 0);
        addPosts(questionId, uID, 1);
    }catch(e){
        console.log(e);
    }
}

StackExchange.initialized.then(main);
