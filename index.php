
<?php
//date_default_timezone_set($tumblrfeed->tumblelog->timezone);
date_default_timezone_set('America/Denver');

?>

<html>

    <head>
        <title>Calendar</title>
        <link rel="stylesheet" type="text/css" href="css/calendar.css" />
    </head>
    <body>
        <?php
        $photos = getPosts();

        echo generateCalendar($photos, "01", "2011");
//        echo showCalendar();
        ?>
    </body>
</html>

<?php
        function getPosts() {
            $postArray = array();

            $displayposts = 10;
            $tumblrfeed = "http://andrewserff.tumblr.com/api/read?&num=31&start=" . $start;
//            $tumblrfeed = "http://andrewserff.tumblr.com/api/read?chrono=1&tagged=photo365&num=10&start=" . $start;
//            $tumblrfeed = "http://localhost/~serff/tumblr/photo-calendar/sample/sampleTumblrRead.xml";
            $tumblrfeed = simplexml_load_file($tumblrfeed);
            //print "<pre>"; print_r ( $tumblrfeed ); print "</pre>";
            // what post to start at


            $start = $tumblrfeed->posts->attributes()->start;
            // total posts
            $total = $tumblrfeed->posts->attributes()->total;
            // ceil() will round up a fraction
            $pages = ceil($total / $displayposts);


            foreach ($tumblrfeed->posts->post as $blog) {

                switch ($blog->attributes()->type) {

                    case "photo";
                        $photoDate = getDateOnlyFromDateTime($blog->attributes()->{"date"});
                        logMsg("Adding photo with date " . $photoDate);
                        $photoArray[$photoDate] = $blog;
                        break;
                }
            }
            return $photoArray;
        }

        function getDateOnlyFromDateTime($date) {
            if (empty($date)) {
                return "No date provided";
            }
            $unix_date = strtotime($date);
            // check validity of date
            if (empty($unix_date)) {
                return "Bad date";
            }
            return date('Y-m-d', $unix_date);
        }

        function generateCalendar($photos, $month, $year) {
            // Get key day informations.
            // We need the first and last day of the month and the actual day
            $monthAsDate = getdate(mktime(0, 0, 0, $month, 1, $year));
            $firstDay = getdate(mktime(0, 0, 0, $monthAsDate['mon'], 1, $monthAsDate['year']));
            $lastDay = getdate(mktime(0, 0, 0, $monthAsDate['mon'] + 1, 0, $monthAsDate['year']));

            // Create a table with the necessary header informations
            echo "<div id=\"month-year\">" . $monthAsDate['month'] . " - " . $monthAsDate['year'] . "</div>";
            echo '<table id="month">';
            echo '<thead';
            echo '  <tr>';
            echo '<th class="weekend">Monday</th>';
            echo '<th>Tuesday</th>';
            echo '<th>Wednesday</th>';
            echo '<th>Thursday</th>';
            echo '<th>Friday</th>';
            echo '<th class="weekend">Saturday</th>';
            echo '<th class="weekend">Sunday</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';

            // Display the first calendar row with correct positioning
            echo '<tr>';
            for ($i = 1; $i < $firstDay['wday']; $i++) {
                echo '<td>&nbsp;</td>';
            }
            for ($i = $firstDay['wday']; $i <= 7; $i++) {
                $actday++;
                logMsg("calling getDayContent(" . $actday . "," . $month . "," . $year . ")");
                echo "<td$class>" . getDayContent($photos, $actday, $month, $year) . "</td>";
            }
            echo '</tr>';

            //Get how many complete weeks are in the actual month
            $fullWeeks = floor(($lastDay['mday'] - $actday) / 7);

            for ($i = 0; $i < $fullWeeks; $i++) {
                echo '<tr>';
                for ($j = 0; $j < 7; $j++) {
                    $actday++;
                    echo "<td$class>" . getDayContent($photos, $actday, $month, $year) . "</td>";
                }
                echo '</tr>';
            }

            //Now display the rest of the month
            if ($actday < $lastDay['mday']) {
                echo '<tr>';

                for ($i = 0; $i < 7; $i++) {
                    $actday++;
                    if ($actday <= $lastDay['mday']) {
                        echo "<td$class>" . getDayContent($photos, $actday, $month, $year) . "</td>";
                    } else {
                        echo '<td>&nbsp;</td>';
                    }
                }

                echo '</tr>';
            }

            echo '</tbody>';

            echo '</table>';
        }

        function getDayContent($photos, $day, $month, $year) {
            $dateToLookFor = getRealDateToLookFor($day, $month, $year);
            if (array_key_exists($dateToLookFor, $photos)) {
                $imgTag = "<img border=\"0\" src=\"" . getPhotoUrlForDate($photos, $day, $month, $year) . "\"/>";
                $hrefTag = "<div class=\"photo\"><a href=\"" . getPostUrlForDate($photos, $day, $month, $year) . " \">" . $imgTag . "</a></div>";
                return $hrefTag;
            } else {
                return "<div class=\"nopost\"><span >" . $day . "</span></div>";
            }
        }

        function getRealDateToLookFor($day, $month, $year) {
            if ($day < 10) {
                $day = "0" . $day;
            }
            $dateToLookFor = $year . "-" . $month . "-" . $day;
            logMsg("looking up photo for date " . $dateToLookFor);
            return $dateToLookFor;
        }

        function getPostUrlForDate($photos, $day, $month, $year) {
            $dateToLookFor = getRealDateToLookFor($day, $month, $year);
            if (array_key_exists($dateToLookFor, $photos)) {
                return $photos[$dateToLookFor]->attributes()->{"url"};
            } else {
                return "http://tumblr.serff.net"; 
            }
        }

        function getPhotoUrlForDate($photos, $day, $month, $year) {
            $dateToLookFor = getRealDateToLookFor($day, $month, $year);
            return $photos[$dateToLookFor]->{"photo-url"}[5]; //75sq
        }

        function getNoPostImgUrl() {
            return "/images/nopost.png";
        }

        function logMsg($msg) {
            // open file
            $fd = fopen("/tmp/php.log", "a");
            // write string
            fwrite($fd, $msg . "\n");
            // close file
            fclose($fd);
        }
?>