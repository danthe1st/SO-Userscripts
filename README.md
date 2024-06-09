# My personal user-scripts for Stack Overflow

This repository contains user scripts I wrote for Stack Overflow.
These userscripts are made for [Tampermoney](https://www.tampermonkey.net/) but other userscript managers may work as well.

### Load Anonymous feedback
[view](https://github.com/danthe1st/SO-Userscripts/blob/master/anonymous_feedback.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/anonymous_feedback.user.js) [Stackapps post](https://stackapps.com/q/9680/65705)

When people vote on questions but are either not logged in or do not have the required reputation threshold,
they can still use the vote buttons but this will not affect the score of the post.
These posts can be accessed in the [10k tools](https://stackoverflow.com/tools) and in [Stack Exchange Data Explorer](https://data.stackexchange.com/).

This user script displays the number of anonymous up- and downvotes below the voting UI.
The data is gathered using [Stack Exchange Data Explorer](https://data.stackexchange.com/) which is only updated once per week.
Because of that, it doesn't show recent (anonymous/low-rep) votes.

### View other OP posts in Staging Ground
[view](https://github.com/danthe1st/SO-Userscripts/blob/master/ViewOtherPostsInSG.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/ViewOtherPostsInSG.user.js) [Stackapps post](https://stackapps.com/q/10571/65705)

This user script displays existing posts of the OP (other than the current post) when reviewing a post in the [Staging Ground](https://stackoverflow.com/help/staging-ground).
These posts are shown below the comment box.

### Custom Staging Ground Comments
[view](https://github.com/danthe1st/SO-Userscripts/blob/master/CustomSGComments.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/CustomSGComments.user.js) [Stackapps post](https://stackapps.com/q/10570/65705)

The [Staging Ground](https://stackoverflow.com/help/staging-ground) provides a few comment templates but it does not allow writing custom comment templates.
This user script addresses this gap and allows writing custom comment templates for the Staging Ground.

I am personally using the following custom comment templates:

|Name|Text|
|---|---|
|Include Code inside question|`Questions on Stack Overflow should contain everything necessary to answer them. Please [edit] your question and include the _relevant_ parts of your code using a [code block].`|
|Include info from comments|`Please [edit] your question and include that in it. When it gets published, the comments will be cleaned up so all necessary information should be present in the question itself.`|
|multiple questions/too broad|`It seems like you asked multiple questions in one. Please reduce your post to a single question.`|
|not specific/too general|`Please [edit] your question to specifically and clearly define the problem you are trying to solve. It seems like your question is quite broad. When asking questions on Stack Overflow, please ask about _specific_ programming problems or similar. Questions that are too broad are [not considered on-topic on Stack Overflow](/help/on-topic)`.|
|'Why' question|`See [this](https://meta.stackoverflow.com/a/323382/10871900) on why questions asking for (historical) reasoning are typically considered opinion-based on Stack Overflow. Essentially these questions are unlikely to lead to satisfying answers. People probably decided to do it that way so they did.`|

### Flag searcher
[view](https://github.com/danthe1st/SO-Userscripts/blob/master/flag_searcher.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/flag_searcher.user.js) [Stackapps post](https://stackapps.com/q/10563/65705)

This user script adds a button to the flagging history that allows searching all flags of the current user.

When that button is pressed, it asks the user for a search string.
After that search string is entered, it replaces the flag list with the flags containing the search string in some way.
This only shows flags matching the current filters.

### Staging Ground comment chat profile links
[view](https://github.com/danthe1st/SO-Userscripts/blob/master/SGCommentChatLinks.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/SGCommentChatLinks.user.js)

This user script adds a link to the [chat.stackoverflow.com](https://chat.stackoverflow.com) profile of reviewers posting comments in the Staging Ground.
