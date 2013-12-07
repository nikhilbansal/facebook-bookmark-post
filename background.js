chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.bookmarks.create({'parentId': '1','title': request.title, 'url': request.url});
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    sendResponse({farewell: true});
  });

function printBookmarks(id) {
 chrome.bookmarks.getChildren(id, function(children) {
    children.forEach(function(bookmark) { 
      console.debug(bookmark.title);
      printBookmarks(bookmark.id);
    });
 });
}
