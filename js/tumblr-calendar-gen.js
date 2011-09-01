
var tumblrCal, oldestPost, postDate;

//get the current year for later use
var now = new Date();
var currentYear = now.getFullYear();
var firstOfYear = new Date(currentYear, 0, 1);
var lastOfYear = new Date(currentYear, 12, 31);
    
//dynamically load the posts using jsonp
var headID = document.getElementsByTagName("head")[0];         
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.src = baseUrl + '&jsonp=parseResponse';
headID.appendChild(newScript);

var parseResponse = function(json) {
    //Create the TumblrCalendar object and populate it with the Photos 
    tumblrCal = new TumblrCalendar(json.response.posts);
    tumblrCal.populatePhotoPosts();

    checkForMorePhotos();
};

var addPhotos = function(json) {
    //add all the new photos we just got
    tumblrCal.addPosts(json.response.posts);

    checkForMorePhotos();
};

var checkForMorePhotos = function() {
    //Figure out what the oldest photo is in the set
    oldestPost = tumblrCal.getOldestPost();
    postDate = new Date(oldestPost.timestamp*1000);
    
    //if the oldest photo is before the 1st of the year, go get more
    if (postDate.getTime() > firstOfYear.getTime()) {
        //make a new request using the offset parameter and a new callback of addPhotos
        var requestUrl = baseUrl + "&offset=" + (tumblrCal.getNumPosts() + 1) + "&jsonp=addPhotos";
        
        var bodyID = document.getElementsByTagName("body")[0]
        var extraPhotoScript = document.createElement("script");
        
        extraPhotoScript.type = 'text/javascript';
        extraPhotoScript.src = requestUrl;
        bodyID.appendChild(extraPhotoScript);
    } else {
        //we have all the photos for the year!  Generate the calendar!
        generateCalendar(tumblrCal);
    }
};

var generateCalendar = function(tumblrCal) {
    for (var i = 0; i < 12; i++) {
        $(document.body).insert(tumblrCal.getCalendarHtmlForMonth(i, "2011") + "<br>");
    }
};

