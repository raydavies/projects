<?php
$result = $db->query('SELECT p.*, u.username FROM posts as p LEFT JOIN users as u ON u.user_id = p.user_id');

$numrows = $result->getAffectedRows();
for ($i = 0; $i < $numrows; $i++) {
	$row = $result->fetchAssoc();
	$row['comment'] = str_replace('\r\n', '\n', $row['comment']);
	$date = date('F j, Y \@ g:i a', strtotime($row['timestamp']));
	echo "<div class=\"comment\"><span class=\"timestamp\">".$date." </span>";
	echo "<span class=\"username\">".$row['username']."</span><br />";
	echo "<p class=\"usercomment\">".nl2br($row['comment'])."<br /></p>";
	echo "<div class=\"delete\"><a href=\"cgi/deletepost.php?postid=".$row['postid']."\">Delete</a></div></div><hr />";			
}
$result->freeResult();
