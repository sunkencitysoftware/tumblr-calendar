var dow = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function valButton(btn) {
    var cnt = -1;
    for (var i=btn.length-1; i > -1; i--) {
        if (btn[i].checked) {
            cnt = i;
            i = -1;
        }
    }
    if (cnt > -1) return btn[cnt].value;else return null;
}
function monthLength(month,year) {
    var dd = new Date(year, month, 0);
    return dd.getDate();
}
function setCell(f,day,col) {
    var c = [];
    var t = '<td';
    if (f==0) c.push('previous');
    if (col==0 || col==6) c.push('weekend');
    if (f==9) c.push('next');
    if (c.length>0) t+=' class="'+c.join(' ')+'"';
    t += '><span class="date">'+day+'<\/span><div class="day"><\/div><\/td>\n';
    return t;
}
function setCal(fm) {
    var m = 0;//parseInt(fm.month.value,10);
    var y = 2011;//parseInt(fm.year.value,10);
    if (y < 1901 || y > 2100) {
        alert('year must be after 1900 and before 2101');
        return false;
    }
    var c = new Date();
    c.setDate(1);
    c.setMonth(m);
    c.setFullYear(y);
    var x = 0;//parseInt(valButton(fm.day),10);
    var s = (c.getDay()-x)%7;
    if (s<0) s+=7;
    var dm = monthLength(m,y);
    var h = '<table id="month">\n<thead>\n<tr>\n';
    for (var i=0;i<7;i++) {
        h+= '<th';
        if ((i+x)%7==0 || (i+x)%7==6) h+= ' class="weekend"';
        h+= '>'+dow[(i+x)%7]+'<\/th>\n';
    }
    h += '<\/tr>\n<\/thead>\n<tbody>\n<tr>\n';
    for (var i=s;i>0;i--) {
        h += setCell(0,dm-i+1,(s-i+x)%7);
    }
    dm = monthLength(m+1,y);
    for(var i=1; i <= dm; i++) {
        if((s%7)==0) {
            h += '<\/tr><tr>\n';
            s = 0;
        }
        h += setCell(1,i,(s+x)%7);
        s++;
    }
    var j=1;
    for (var i=s;i<7;i++) {
        h += setCell(9,j,(i+x)%7);
        j++;
    }
    h += '<\/tr>\n<\/tbody>\n<\/table>';
//    fm.html.value = h;
//    document.getElementById('sample').innerHTML = h;
    return h;
}

