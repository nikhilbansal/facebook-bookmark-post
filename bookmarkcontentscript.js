$("<style>").text(".topbar {background: #3B5998;border-bottom: solid 2px #EEE;padding: 3px 0;text-align: center;color: white;}").appendTo("head");

function getPostLink(postInfo){
    for(var i = 0; i < postInfo.children.length; i++) {
    	var eachPostEachItem = postInfo.children.item(i);
	// If bookmark is already added
	if(eachPostEachItem.title == "Bookmark this post")	return null;
	else if(eachPostEachItem.nodeName !=null && eachPostEachItem.nodeName == "SPAN" && eachPostEachItem.children != null){
		if(eachPostEachItem.children.item(0) != null){
			var possibleTimePost = eachPostEachItem.children.item(0);
			if(possibleTimePost.nodeName == "A" && possibleTimePost.href != null && possibleTimePost.className!=null && possibleTimePost.className == "_5pcq"){
				return possibleTimePost;
			}
		}
	}
    }
    return null;
}

function appendBookmarkTab(){
    var postInfoList = document.getElementsByClassName('_5pcp');
    for(var i = postInfoList.length - 1; i >= 0; i--) {
	var postInfo = postInfoList.item(i);
	var postLinkElement = getPostLink(postInfo);
	if(postLinkElement != null){
		//console.log(postLinkElement);
		var separatorTextNode = document.createTextNode(' · ');
		if(postLinkElement.parentNode == null || postLinkElement.parentNode.parentNode == null)	continue;
		if(postLinkElement.href == null)	continue;
    		var textNode = document.createElement('label');
    		var inputNode = document.createElement('input');
    		textNode.className='uiLinkButton';
    		textNode.title='Bookmark this post';
    		inputNode.type = "button";
    		inputNode.value = "Bookmark";
		inputNode.param = postLinkElement;
		inputNode.addEventListener('click', function(evt){
			var title = 'Facebook bookmark post on ';
			//console.log("=> postLinkElement : " + evt.target.param);
			bookmark(evt.target.param);
		}, false);
    		textNode.appendChild(inputNode);
		textNode = textNode;
		postLinkElement.parentNode.parentNode.insertBefore(separatorTextNode, postLinkElement.parentNode);
    		separatorTextNode.parentNode.insertBefore(textNode, separatorTextNode);
	}
    }
}
appendBookmarkTab();

function createNewBookmarkFolder(){
	chrome.runtime.sendMessage({bookmark_location: "Facebook Posts"}, function(response) {
		console.log("bookmark_location set");
	});
}

createNewBookmarkFolder();

function listener()
{
    console.debug("listener fired.");
    appendBookmarkTab();
}

var timeout = null;
document.addEventListener("DOMSubtreeModified", function() {
    if(timeout) {
        clearTimeout(timeout);
    }
    timeout = setTimeout(listener, 500);
}, false);

function bookmark(postLinkElement){
	//console.log("postLinkElement : " + postLinkElement);
	var title = 'Somebody posted on ';
	if(postLinkElement.parentNode == null || postLinkElement.parentNode.parentNode ==null || postLinkElement.parentNode.parentNode.parentNode ==null || postLinkElement.parentNode.parentNode.parentNode.parentNode == null){
		alert("Sorry, cannot create Bookmark without a title");
		return;
	}
	var postInfo = postLinkElement.parentNode.parentNode.parentNode.parentNode;
	if(postLinkElement.href == null){
		alert("Sorry, cannot create Bookmark without a url");
		return;
	}
	var titleValue = getTitle(postInfo);
	if(titleValue != null)	title = titleValue + " posted on ";
	if(postLinkElement.children!=null && postLinkElement.children.item(0)!=null && postLinkElement.children.item(0).title!=null){
		title = title + postLinkElement.children.item(0).title;
	}else{
		title = title + "some fine day";
	}
	//console.log("postUrl : " + postLinkElement.href);
	//console.log("postTitle : " + title);
	chrome.storage.sync.get('bookmark_location', function (result) {
        	bookmark_location = result.bookmark_location;
		if(bookmark_location){
			// User has not set the bookmark location in his/her preferences
			// Get the user to set the Bookmark location
			chrome.runtime.sendMessage({url: postLinkElement.href, title: title}, function(response) {
					displayBookmarkTopMessage(response.responseMessage);
			});
 		}
        });
	//alert(done);
	//alert("Bookmark created");
	//displayBookmarkTopMessage("Bookmark created");
}

function getTitle(postInfo)
{
	if(postInfo.children == null || postInfo.children.item(0)==null){
		if(postInfo.innerHTML != null){
			return postInfo.innerHTML;
		}else{
			return null;
		}
	}else{
		return getTitle(postInfo.children.item(0));
	}
}

function displayBookmarkTopMessage(message){
	$("<div />", { class: 'topbar', text: message }).hide().appendTo("#blueBar").slideDown('fast').delay(2000).slideUp(function() { $(this).remove(); });
}


