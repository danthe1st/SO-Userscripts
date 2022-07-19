// ==UserScript==
// @name         Load Anonymous feedback
// @namespace    https://github.com/danthe1st/
// @version      1.0
// @description  Loads anonymous feedback of StackOverflow posts
// @author       danthe1st
// @updateURL   https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/anonymous_feedback.user.js
// @downloadURL https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/anonymous_feedback.user.js
// @match       *://*.stackexchange.com/questions/*
// @match       *://*.stackoverflow.com/questions/*
// @match       *://*.superuser.com/questions/*
// @match       *://*.serverfault.com/questions/*
// @match       *://*.askubuntu.com/questions/*
// @match       *://*.stackapps.com/questions/*
// @match       *://*.mathoverflow.net/questions/*
// @connect      data.stackexchange.com
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackexchange.com
// @grant        GM.xmlHttpRequest
// ==/UserScript==

(function() {
    'use strict';
    let votingContainers=$('.js-voting-container')
    for (let votingContainer of votingContainers){
        let postId=votingContainer.getAttribute("data-post-id")
        let dataExplorerURL=`https://data.stackexchange.com/${StackExchange.options.site.name.toLowerCase().replace(/\W+/gi,'').replace("stackexchange","")}/csv/1973758?postId=${postId}`
        GM.xmlHttpRequest( {
            url: dataExplorerURL,
            onload: res=>{
                if(res.status==200){
                    let content=res.response.split("\n")
                    content.shift()
                    let data={}
                    for(let line of content){
                        let splittedLine=line.split('"')
                        data[splittedLine[1]]=splittedLine[3]
                    }
                    for(let type in data){
                        let div=document.createElement('div')
                        let text=data[type]
                        if(!text){
                            continue
                        }else if(type=="UpMod"){
                            text=`+ ${text}`
                        }else if(type=="DownMod"){
                            text=`- ${text}`
                        }else{
                            text=`${type}=${text}`
                        }
                        div.innerText=text
                        votingContainer.appendChild(div)
                    }
                }
            }
        } )
    }
})();
