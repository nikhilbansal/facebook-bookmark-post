var defaultLocation = "";
var bookmark_ids=new Array(); 
function onchangeFolderLocation(id)
{
	chrome.storage.sync.get("bookmark_location", function (obj) {
    		defaultLocation=obj.bookmark_location;
		//console.debug("before setting def loc : "+ defaultLocation);			
		chrome.storage.sync.set({"bookmark_location":id}, function () {});
		chrome.storage.sync.get("bookmark_location", function (obj) {
	    		defaultLocation=obj.bookmark_location;
			//console.debug("after setting def loc : "+ defaultLocation);	
		});	
	});
}
var folderlist="<select id='folderlocation' class='ask' >";
var foldername ="";
var listDiv="<label class='listAll' ><ul>";
function printBookmarkForNode(id)
{
	chrome.bookmarks.getChildren(id, function(children) {
		children.forEach(function(bookmark) { 
			
			if(bookmark.url) {
				//console.debug(bookmark_ids);
				if(bookmark_ids.indexOf(bookmark.id.toString()) > 0){
					console.debug(bookmark.id);
					listDiv += '<li><a href="'+bookmark.url+'" target="_blank" >'+bookmark.title+'</a></li>';
				}
			}
			printBookmarkForNode(bookmark.id);
		});
	});	
	listDiv+='</ul></label>';
	document.getElementById("listAllBookmarks").innerHTML=listDiv;
}
function printAllBookmarks() {
	printBookmarkForNode('1');
}

function loadBookmarkLocations(id) {
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
function updateBookmarkedIds()
{
	chrome.storage.sync.get('bookmark_ids', function (bookmark_ids_object){
		if(bookmark_ids_object.bookmark_ids){
			bookmark_ids=bookmark_ids_object.bookmark_ids.split(",");
		}
		printAllBookmarks(); 
	});
}
document.addEventListener('DOMContentLoaded', function () {
	chrome.storage.sync.get("bookmark_location", function (obj) {
    		defaultLocation=obj.bookmark_location;
		console.debug("initial def loc "+defaultLocation);
		if(!defaultLocation){
			chrome.storage.sync.set({"bookmark_location":"1"}, function () {});
		}
		loadBookmarkLocations('1'); 
		updateBookmarkedIds();
		
	});
});
