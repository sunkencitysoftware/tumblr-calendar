if (typeof tumblr_api_read == "undefined") {
    document.write("<div>Unable to load tumblr posts</div>");
} else {
    var tumblrCal = new TumblrCalendar(tumblr_api_read);
    tumblrCal.populatePhotoPosts();
    for (var i = 0; i < 12; i++) {
        document.write(tumblrCal.getCalendarHtmlForMonth(i, "2011"));
        document.write("<br>");
    }
} 