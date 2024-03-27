# My personal user-scripts for Stack Overflow

This repository contains user scripts I wrote for Stack Overflow.
These userscripts are made for [Tampermoney](https://www.tampermonkey.net/) but other userscript managers may work as well

### Load Anonymous feedback

When people vote on questions but are either not logged in or do not have the required reputation threshold,
they can still use the vote buttons but this will not affect the score of the post.
These posts can be accessed in the [10k tools](https://stackoverflow.com/tools) and in [Stack Exchange Data Explorer](https://data.stackexchange.com/).

This user script displays the number of anonymous up- and downvotes below the voting UI.
The data is gathered using [Stack Exchange Data Explorer](https://data.stackexchange.com/) which is only updated once per week.
Because of that, it doesn't show recent (anonymous/low-rep) votes.

[view](https://github.com/danthe1st/SO-Userscripts/blob/master/anonymous_feedback.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/anonymous_feedback.user.js)

### View other OP posts in Staging Ground

This user script displays existing posts of the OP (other than the current post) when reviewing a post in the [Staging Ground](https://stackoverflow.com/help/staging-ground).
These posts are shown below the comment box.

[view](https://github.com/danthe1st/SO-Userscripts/blob/master/ViewOtherPostsInSG.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/ViewOtherPostsInSG.user.js)

### Custom Staging Ground Comments

The [Staging Ground](https://stackoverflow.com/help/staging-ground) provides a few comment templates but it does not allow writing custom comment templates.
This user script addresses this gap and allows writing custom comment templates for the Staging Ground.

[view](https://github.com/danthe1st/SO-Userscripts/blob/master/CustomSGComments.user.js) [install](https://raw.githubusercontent.com/danthe1st/SO-Userscripts/master/CustomSGComments.user.js)
