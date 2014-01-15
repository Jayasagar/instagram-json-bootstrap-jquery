// Instantiate an empty object.
var Instagram = {};
// Contains 1 media object
function MediaByTag() {
	var caption;
	var link;
	var tags;
	var comments;
	var likes;
	var imageUrls;
	var userInfo;
};

// Pagination
var currentPage = 1;
$('#next').click(function() {
	console.log("next called");
	if (currentPage < 10) {
		currentPage = currentPage+1;
		loadNextPage();
		$("#currentPage").empty().append(currentPage+"/10");
		
	} else {
		//Disable next page
	}
});

$('#previous').click(function() {
	console.log("previous called");
	if (currentPage > 1) {
		currentPage = currentPage-1;
		loadNextPage();
		$("#currentPage").empty().append(currentPage+"/10");
	} else {
		
	}
});

$('#first').click(function() {
	console.log("first called");
	currentPage = 1;
	loadNextPage();
	$("#currentPage").empty().append(currentPage+"/10");
});

$('#last').click(function() {
	console.log("last called");
	currentPage = 10;
	loadNextPage();
	$("#currentPage").empty().append(currentPage+"/10");
});


// Contains all collections of media objects
var mediaList = [];

function cacheData(content) {
	console.log(content);
	$.each(content.data, function(index, tagContent) {
		mediaObject = new MediaByTag();

		mediaObject.link = tagContent.link;
		mediaObject.tags = tagContent.tags;
		mediaObject.caption = tagContent.caption.text;
		mediaObject.comments = tagContent.comments;
		mediaObject.likes = tagContent.likes;
		mediaObject.imageUrls = tagContent.images;
		mediaObject.userInfo = tagContent.user;

		// push to array
		mediaList.push(mediaObject);

		// console.log(tagContent.tags);
		// console.log(tagContent.comments);
		// console.log(tagContent.likes);
	});
	
	loadNextPage();
}

function loadNextPage() {
	var firstMedia = mediaList[currentPage-1];

	// Tag Name
	var tagEle = "<h3> <span class=\"label label-default\"><a href='"+ firstMedia.link +"' target='_blank'>" +firstMedia.link+ " </a></span></h3>";
	$("#tagName").empty().append(tagEle); 

	// BOX2 Tags and Desc
	var desc = "<span class=\"label label-info\">Description </span> " +firstMedia.caption;
	$("#description").empty().append(desc); // Desc
	// Tags
	var tagsText = "";
	$.each(firstMedia.tags, function(index, tag) {
		tagsText = tagsText + "  ";
	});
	var tagHtmlEle = "<span class=\"label label-primary\">Tags</span>" +tagsText;
	$("#tags").empty().append(tagHtmlEle); // Tags		
	

	// BOX1 - Comments
	var comments = firstMedia.comments;
	$("#comments").empty();
	if (comments.count > 0) {
		$.each(comments.data, function(index, comment) {
			var comment_div = "<div class=\"panel panel-info\">"
				+ "<div class=\"panel-body\">" + "<div class=\"row\">"
				+ "<img src=\"" + comment.from.profile_picture
				+ "\" width=\10%\">" + "</div>" + "<div class=\"row\">"
				+ comment.text + "</div>" + "</div>" + "</div>";
			
			$("#comments").append(comment_div);
		});
	} else {
		$("#comments").append("Opps! No comments ...");
	}

	// BOX 3 - Likes By
	var likes = firstMedia.likes;
	$("#likesDiv").empty();
	if (likes.count > 0) {
		$.each(likes.data, function(index, like) {
			var profile_div = "<div class=\"panel panel-info\">"
					+ "<div class=\"panel-body\">" + "<div class=\"row\">"
					+ "<img src=\"" + like.profile_picture
					+ "\" width=\10%\">" + "</div>" + "<div class=\"row\">"
					+ like.full_name + "</div>" + "</div>" + "</div>";

			$("#likesDiv").append(profile_div);
		});
	} else {
		$("#likesDiv").append("Opps! No likes yet");
	}

	// BOX 4,5,6 - > Images
	/*var low_resol_image = firstMedia.imageUrls.low_resolution;
	//console.log("<img src=\"" + low_resol_image.url + "\" width=\"20%\">");
	$("#image_low_resolution").empty().append(
			"<img src=\"" + low_resol_image.url + "\" width=\"30%\">");
	*/var standard_resol_image = firstMedia.imageUrls.standard_resolution;
	$("#image_standard").empty().append(
			"<img src=\"" + standard_resol_image.url + "\" width=\"100%\">");
	/*var thumbnail_image = firstMedia.imageUrls.thumbnail;
	$("#image_thumbnail").empty().append(
			"<img src=\"" + thumbnail_image.url + "\" width=\"30%\">");
*/
	// BOX 7 -> User info
	$("#user_info_profile").empty().append("<img src=\"" + firstMedia.userInfo.profile_picture + "\" width=\"25%\">");
	$("#user_info_name").empty().append(firstMedia.userInfo.full_name);
}

// Invoke api call to instagram to get recent media by tag
function getRecentMediaByTag(tag) {
	var url = "https://api.instagram.com/v1/tags/"
			+ tag
			+ "/media/recent"
			+ "?access_token=539668504.2c39d74.5b6021beec4048f0bdba845c38919103&client_id=97bf64bca67344afbbe8ea64caa8e617";

	$.getJSON(url, cacheData);
}

// Assign to instance field
Instagram.recentMediaByTag = getRecentMediaByTag;

// Call method by passing tag 'travel'
Instagram.recentMediaByTag('travel');