<?php
if (!defined('DB_HOST')) {
	include_once('cgi/info.php');
}

@$link = mysqli_connect(DB_HOST,DB_USER,DB_PASS);
if (!$link) {
	echo mysqli_connect_errno($link).": ".mysqli_connect_error($link);
	exit;
}

@$db = mysqli_select_db($link, DB_NAME);
if (!$db) {
	echo mysqli_errno($link).": ".mysqli_error($link);
	exit;
}

$query = "select * from posts";
@$result = mysqli_query($link, $query);
if (!$result) {
	echo mysqli_errno($link).": ".mysqli_error($link);
	exit;
}
		
$numrows = mysqli_num_rows($result);
for ($i = 0; $i < $numrows; $i++) {
	$row = mysqli_fetch_assoc($result);
	$row['comment'] = str_replace('\r\n', '\n', $row['comment']);
	$date = date('H:i F j, Y', strtotime($row['timestamp']));
	echo "<div class=\"comment\"><span class=\"timestamp\">".$date." </span>";
	echo "<span class=\"username\">".$row['username']."</span><br />";
	echo "<p class=\"usercomment\">".nl2br($row['comment'])."<br /></p>";
	echo "<div class=\"delete\"><a href=\"cgi/deletepost.php?postid=".$row['postid']."\">Delete</a></div></div><hr />";			
}
mysqli_free_result($result);

mysqli_close($link);
