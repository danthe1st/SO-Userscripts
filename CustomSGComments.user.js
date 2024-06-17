// ==UserScript==
// @name         Custom SG Comments
// @namespace    https://github.com/danthe1st/
// @version      1.1
// @description  Adds custom comment templates to the Staging Ground
// @updateURL    https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/CustomSGComments.user.js
// @downloadURL  https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/CustomSGComments.user.js
// @author       danthe1st
// @match        https://stackoverflow.com/staging-ground/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @run-at      document-idle
// ==/UserScript==

let commentCounter=0;

const escapeHtml = (raw) => {
    return raw.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function addComment(name, description){
    const label=document.createElement("label")
    document.querySelector("div.template-container").appendChild(label)
    label.innerHTML=
        `
        <div class="d-flex">
            <div class="flex--item mr8">
                <input class="s-radio" type="radio" name="comment-template-radio" id="UserDefined" role="menuitemradio" value="${escapeHtml(description)}">
            </div>
            <div class="flex--item">
                <p>${escapeHtml(name)}</p>
            </div>
        </div>
        `;
    label.classList.add("s-menu--label");
    label.classList.add("flex--item6");
    label.classList.add("pl16");
    let btn = document.createElement("a");
    btn.innerText="Remove";
    btn.style="margin-left: auto;color: var(--_an-a-fc-hover);";
    btn.innerText = "Remove";
    const commentId=commentCounter;
    btn.onclick=()=>removeComment(commentId, label);
    label.getElementsByTagName("p")[0].parentElement.parentElement.appendChild(btn)
}


const LOCALSTORAGE_COMMENT_NAME_PREFIX="customSGComments-comment-name";
const LOCALSTORAGE_COMMENT_TEXT_PREFIX="customSGComments-comment-text";
function promptNewComment(newCommentButton){
    const commentName=window.prompt("Please enter the name of the comment:");
    if(!commentName){
        return;
    }
    const commentText=window.prompt("Please enter the text of the comment:");
    if(!commentText){
        return;
    }
    addComment(commentName, commentText)
    localStorage[LOCALSTORAGE_COMMENT_NAME_PREFIX+commentCounter]=commentName;
    localStorage[LOCALSTORAGE_COMMENT_TEXT_PREFIX+commentCounter]=commentText;
    commentCounter++;
    const parentBtn = newCommentButton.parentElement;
    newCommentButton.remove();
    parentBtn.appendChild(newCommentButton);
}

function loadComments(){
    while((LOCALSTORAGE_COMMENT_NAME_PREFIX+commentCounter) in localStorage){
        addComment(localStorage[LOCALSTORAGE_COMMENT_NAME_PREFIX+commentCounter], localStorage[LOCALSTORAGE_COMMENT_TEXT_PREFIX+commentCounter]);
        commentCounter++;
    }
}

function removeComment(id, elem){
    if(confirm(`Remove comment "${elem.getElementsByTagName("p")[0].innerText}"?`)){
        elem.remove();
        if(id!=commentCounter-1){
            for(let i=id; i<commentCounter-1;i++){
                localStorage[LOCALSTORAGE_COMMENT_NAME_PREFIX+i]=localStorage[LOCALSTORAGE_COMMENT_NAME_PREFIX+(i+1)]
                localStorage[LOCALSTORAGE_COMMENT_TEXT_PREFIX+i]=localStorage[LOCALSTORAGE_COMMENT_TEXT_PREFIX+(i+1)]
            }
        }
        localStorage.removeItem(LOCALSTORAGE_COMMENT_NAME_PREFIX+(commentCounter-1))
        localStorage.removeItem(LOCALSTORAGE_COMMENT_TEXT_PREFIX+(commentCounter-1))
        commentCounter--;
        if(id!=commentCounter){
            window.location.reload()
        }
    }
}

function main() {
    'use strict';
    loadComments()
    let btn = document.createElement("a");
    btn.classList.add("pl16")
    btn.style="color: var(--_an-a-fc-hover);"
    btn.innerText = "Add new comment";
    btn.onclick=()=>promptNewComment(btn);
    document.querySelector("div.template-container").appendChild(btn);
};

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

waitForElm("div.template-container").then(main)//https://stackoverflow.com/a/61511955/10871900
