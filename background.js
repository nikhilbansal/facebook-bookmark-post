var found;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var responseJson = {};
    console.log(request);
    if(request.bookmark_location){
	// Create bookmark folder
	console.log("Creating new bookmark folder with the name : " + request.bookmark_location);
	chrome.storage.sync.get('bookmark_location', function (result) {
                id = result.bookmark_location;
		if (id){
			console.log("Extension storage already has a bookmark id stored, id : " + id);
			chrome.bookmarks.get(id, function(results) {
				console.log("results  : " + results);
				if (!results) {
					console.log("Extension storage already has a bookmark id stored, but bookmark folder doesn't exist with the same id, creating one with this id now");
					var found = false;
					var bookmarksNodes = chrome.bookmarks.getTree(function(bookmarkTreeNodes){
						for(var i=0;i<bookmarkTreeNodes.length;i++) {
							if(bookmarkTreeNodes[i].title.localeCompare(request.bookmark_location) == 0){
								console.log(bookmarkTreeNodes[i]);
								found = true;
							}
						}
						if(found == false){
							chrome.bookmarks.create({'parentId': '1','title': request.bookmark_location},function(newFolder) {
								chrome.storage.sync.set({'bookmark_location': newFolder.id}, function() {
									sendResponse({"newFolderId": newFolder.id});
								});
							});
						}
					});
					
				}
			});
		}else{
			console.log("No bookmark id found in Extension storage, creating one now");
			var bookmarksNodes = chrome.bookmarks.getTree(function(bookmarkTreeNodes){
				var found = false;
				console.debug(bookmarkTreeNodes);
				for(var i=0;i<bookmarkTreeNodes.length;i++) {
					if(bookmarkTreeNodes[i].title.localeCompare(request.bookmark_location) == 0){
						console.log(bookmarkTreeNodes[i]);
						found = true;
					}
				}
				console.log("found : " + found);
				if(found == false){
				chrome.bookmarks.create({'parentId': '1','title': request.bookmark_location},function(newFolder) {
					chrome.storage.sync.set({bookmark_location: newFolder.id}, function() {
						sendResponse({"newFolderId":newFolder.id});
					});
				});
				}
			});
		}
	});
    }else if(request.url){
	console.log("Bookmark this url " + request.url);
        var bookmarksNodes = chrome.bookmarks.search(request.url, function(bookmarksNodes){
            if(bookmarksNodes.length > 0){ 
		responseJson={"response":false,"responseMessage":"Bookmark already exists for this post"};
		sendResponse(responseJson);
            }else{
		chrome.storage.sync.get('bookmark_location', function (result) {
			id = result.bookmark_location;
			if (id){
				chrome.bookmarks.create({'parentId': id,'title': request.title, 'url': request.url},function(bookmarkCreated){
					var newBookmarkId = bookmarkCreated.id;
					console.debug("newBookmarkId : " + newBookmarkId);
					chrome.storage.sync.get('bookmark_ids', function (bookmark_ids_object){
						var bookmark_ids = bookmark_ids_object.bookmark_ids;
						console.debug("bookmark_ids : " + bookmark_ids);
						if(bookmark_ids){
							var h = toObject(bookmark_ids);
						}else{
							var h = {};
						}
						console.debug("ids from local storage : " + h);
						h[newBookmarkId]=1;
						chrome.storage.sync.set({bookmark_ids: toString(h)}, function() {
							console.debug("toString(h) : " + toString(h));
							responseJson={"response":true,"responseMessage":"Bookmark created successfully"};
							sendResponse(responseJson);
						});
					});
				});
			}else{
				console.log("Where to save bookmarks ?, id not found");
			}
		});
                //chrome.bookmarks.create({'parentId': '1','title': request.title, 'url': request.url});
		//responseJson={"response":true,"responseMessage":"Bookmark created successfully"};
		//sendResponse(responseJson);
            }
        });
    }
    return true;
  });

function printBookmarks(id) {
 chrome.bookmarks.getChildren(id, function(children) {
    children.forEach(function(bookmark) { 
      console.debug(bookmark.title);
      printBookmarks(bookmark.id);
    });
 });
}

function toString(h){
    console.debug(h);
    var res = "";
    for (var k in h) {
    // use hasOwnProperty to filter out keys from the Object.prototype
        if (h.hasOwnProperty(k)) {
            if(!res.localeCompare("")==0){
                res = res + ",";
            }   
            res = res + k;
        }
    }
    return res;
}


function toObject(h){
    var arr = h.split(",");
    console.debug(arr);
    var h = {};
    arr.map( function(item) {
     h[item]=1;
    });
    return h;
}
