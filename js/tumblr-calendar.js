function TumblrCalendar(tumblelog) {
    // class "constructor" initializes this.hour field
    this.tumblelog = tumblelog;
    var dow = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    this.months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.photoPosts = new Hash();

    this.populatePhotoPosts = function() {
        if (typeof this.tumblelog != "undefined") {
            for (var i = 0; i < this.tumblelog.posts.length; i++) {
                var post = this.tumblelog.posts[i];
                if (post.type == "photo") {
                    var d = new Date(post.date);
                    var day = this.getDateOnly(d);
                    this.photoPosts.set(day, post);
                }
            }
        }
        return this.photoPosts;
    }

    this.getZeroPaddedNumber = function(num, digits) {
        if (digits <= 1 || num.length >= digits) {
            return num;
        }
        if (num < (10 * digits - 1)) {
            var newNum = num;
            for (var i = 0; i<digits - 1; i++) {
                newNum = "0" + newNum;
            }
            return newNum;
        } else {
            return num;
        }
    }
    
    this.getPhotosForMonth = function(month, year) {
        var monthPhotos = new Hash();
        var mo = this.getZeroPaddedNumber(month, 2);
        var length = this.monthLength(month,year);
        for (var i = 1; i <= length ; i++) {
            var day = this.getZeroPaddedNumber(i, 2);
            var date = year + "-" + mo + "-" + day;
            if (this.photoPosts.get(date)) {
                monthPhotos.set(date, this.photoPosts.get(date));
            }
        }
        return monthPhotos;
    }
    
    // display greeting
    this.getCalendarHtmlForMonth = function(month, year) {
        var c = new Date();
        c.setDate(1);
        c.setMonth(month);
        c.setFullYear(year);

        var posts = this.getPhotosForMonth(month + 1, year);
        
        var startDay = 0;//0 = Sunday
        var calStart = (c.getDay()-startDay)%7;
        if (calStart<0) calStart+=7;
        var dm = this.monthLength(month,year);
        var html = "<div id=\"month-year\">" + this.months[c.getMonth()] + "-" + year + "</div><br>";
        html += '<table id="month">\n<thead>\n<tr>\n';
        for (var i=0;i<7;i++) {
            html+= '<th';
            if ((i+startDay)%7==0 || (i+startDay)%7==6) html+= ' class="weekend"';
            html+= '>'+dow[(i+startDay)%7]+'<\/th>\n';
        }
        html += '<\/tr>\n<\/thead>\n<tbody>\n<tr>\n';
        for (var i=calStart;i>0;i--) {
            html += this.getDayCellHtml(0,dm-i+1,(calStart-i+startDay)%7);
        }
        dm = this.monthLength(month+1,year);
        for(var i=1; i <= dm; i++) {
            if((calStart%7)==0) {
                html += '<\/tr><tr>\n';
                calStart = 0;
            }
            html += this.getDayCellHtml(1,i,(calStart+startDay)%7, this.getPostForDay(posts, i, month +1, year));
            calStart++;
        }
        var j=1;
        for (var i=calStart;i<7;i++) {
            html += this.getDayCellHtml(9,j,(i+startDay)%7);
            j++;
        }
        html += '<\/tr>\n<\/tbody>\n<\/table>';
        return html;
    }

    this.monthLength = function(month,year) {
        var dd = new Date(year, month, 0);
        return dd.getDate();
    }

    this.getDayCellHtml = function(f,day,col,post) {
        var c = [];
        var t = '<td';
        if (f==0) c.push('previous');
        if (col==0 || col==6) c.push('weekend');
        if (f==9) c.push('next');
        if (c.length>0) t+=' class="'+c.join(' ')+'"';
        if (post) {
            t += '><span class="date">' + this.getPhotoHtml(post) + '<\/span><\/div><\/td>\n';
        } else {
            //            t += '><span class="date">'+day+'<\/span><div class="day"><\/div><\/td>\n';
            t += "><div class=\"nopost\"><span >" +day+ "</span></div><\/td>\n";
        }
        return t;
    }

    this.getPostForDay = function(posts, day, month, year) {
        var date = year + "-" + this.getZeroPaddedNumber(month, 2) + "-" + this.getZeroPaddedNumber(day, 2);
        return posts.get(date);
    }
    
    this.getPhotoHtml = function(post) {
        var img = "<img border=\"0\" src=\"" + post["photo-url-75"] + "\"/>";
        var href =  "<div class=\"photo\"><a href=\"" + post["url"] + " \">" + img + "</a></div>";
        return href;
    }

    this.getDateOnly = function(date) {
        var day = this.getZeroPaddedNumber(date.getDate(), 2);
        var month = this.getZeroPaddedNumber(date.getMonth()+1,2);//January is 0!
        var year = date.getFullYear();
        //        if(day<10){day='0'+day}
        //        if(month<10){mm='0'+}
        return year + "-" + month + "-" + day;
    }
}
