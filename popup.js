var defaultLocation = "";
function onchangeFolderLocation(id)
{
	chrome.storage.sync.get("bookmark_location", function (obj) {
    		defaultLocation=obj.bookmark_location;
		console.debug("before setting def loc : "+ defaultLocation);			
		
		chrome.storage.sync.set({"bookmark_location":id}, function () {});
		chrome.storage.sync.get("bookmark_location", function (obj) {
	    		defaultLocation=obj.bookmark_location;
			console.debug("after setting def loc : "+ defaultLocation);	
		});	
	});
}
var folderlist="<select id='folderlocation' class='ask' >";
var foldername ="";
function printBookmarks(id) {
	chrome.bookmarks.getChildren(id, function(children) {
		console.debug(children);
	 	for (i = 0; i < children.length; i++) {
			if(!children[i].url){
				if(children[i].id == defaultLocation)  //watever nikil set variable
	    				foldername += '<option  value="'+children[i].id+'" selected>'+children[i].title+'</option>';
				else				
    					foldername += '<option  value="'+children[i].id+'" >'+children[i].title+'</option>';
			}
  		}
		folderlist+=foldername+'</select>';
		document.getElementById("bookmarks").innerHTML=folderlist;
 		document.getElementById("folderlocation").addEventListener('change', function() {
										onchangeFolderLocation(this.options[this.selectedIndex].value);
										},false);
	});
}
document.addEventListener('DOMContentLoaded', function () {
	chrome.storage.sync.get("bookmark_location", function (obj) {
    		defaultLocation=obj.bookmark_location;
		console.debug("initial def loc "+defaultLocation);
		if(!defaultLocation){
			chrome.storage.sync.set({"bookmark_location":"1"}, function () {});
		}
		printBookmarks('1'); 
	});
	
});




/*chrome.bookmarks.getTree(function(bookmarks) {
  printBookmarks(bookmarks);
});

function printBookmarks(bookmarks) {
  bookmarks.forEach(function(bookmark) {
    console.debug(bookmark.id + ' - ' + bookmark.title + ' - ' + bookmark.url);
    if (bookmark.children)
      printBookmark(bookmark.children);
  });
}
*/

/*
function dumpBookmarks(query) {
  var bookmarkTreeNodes = chrome.bookmarks.getTree(
    function(bookmarkTreeNodes) {
      $('#bookmarks').append(dumpTreeNodes(bookmarkTreeNodes, query));
    });
}
function dumpTreeNodes(bookmarkNodes, query) {
  var list = $('<ul>');
  var i;
  for (i = 0; i < bookmarkNodes.length; i++) {
    list.append(dumpNode(bookmarkNodes[i], query));
    alert("namr "+bookmarkNodes[i].title)
  }

  return list;
}
function dumpNode(bookmarkNode, query) {
  if (bookmarkNode.title) {
    if (query && bookmarkNode.children) {
      if (String(bookmarkNode.title).indexOf(query) == -1) {
        return $('<span></span>');
      }
    }
	
		var anchor = $('<a>');
		anchor.attr('href', bookmarkNode.url);
		anchor.text(bookmarkNode.title);
		anchor.click(function() {
		chrome.tabs.create({url: bookmarkNode.url});
		});

		var span = $('<span>');
		span.hover(function() {}, function() {}).append(anchor); 
  
  }
  var li = $(bookmarkNode.title ? '<li>' : '<div>').append(span);
  if (bookmarkNode.children && bookmarkNode.children.length > 0) {
    li.append(dumpTreeNodes(bookmarkNode.children, query));
  }
  return li;
}

document.addEventListener('DOMContentLoaded', function () {
  dumpBookmarks();
});

 //document.getElementById("bookmarks").innerHTML="<h1>helllo</h1>";*/
