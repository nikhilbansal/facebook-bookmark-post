var found;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    var responseJson = {};
    var bookmarksNodes = chrome.bookmarks.search(request.url, function(bookmarksNodes){
        if(bookmarksNodes.length > 0){ 
		responseJson={"response":false,"responseMessage":"Bookmark already exists for this post"};
		sendResponse(responseJson);
        }else{
                chrome.bookmarks.create({'parentId': '1','title': request.title, 'url': request.url});
		responseJson={"response":true,"responseMessage":"Bookmark created successfully"};
		sendResponse(responseJson);
        }
    });
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
