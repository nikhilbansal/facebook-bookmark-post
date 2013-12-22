var defaultLocation = "";
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
function printAllBookmarks() {
	var id="1";
	var listDiv="<label class='listAll' >";
	chrome.bookmarks.getChildren(id, function(children) {
		//console.debug(children);
	 	for (i = 0; i < children.length; i++) {
			if(children[i].url){
				listDiv += '<p >'+children[i].title+'</p>';
			}
  		}
		listDiv+=listDiv+'</label>';
		document.getElementById("listAllBookmarks").innerHTML=listDiv;
 	});
}
function loadBookmarkLocations(id) {

	chrome.bookmarks.getChildren(id, function(children) {
		//console.debug(children);
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
		loadBookmarkLocations('1'); 
		printAllBookmarks(); 
	});
});
