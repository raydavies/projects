<?php
session_start();
if (isset($_SESSION['notbot']) && !empty($_SESSION['notbot'])){
	$user = stripslashes($_SESSION['notbot']);
	$cmmt = stripslashes($_POST['comment']);
	if (!isset($cmmt) || empty($cmmt)) {
		header("Location: ../index.php");
		die;
	}
	else {
		include_once('../inc/postclass.php');
		if (!defined('DB_HOST')){ include_once('info.php');}
		date_default_timezone_set('America/Chicago');
		$post = new Post();
		$post->formatPost($user, $cmmt);

		@$link = mysqli_connect(DB_HOST,DB_USER,DB_PASS);
		if (!$link){
			echo mysqli_connect_errno($link).": ".mysqli_connect_error($link);
			exit;
		}
		@$db = mysqli_select_db($link,DB_NAME);
		if (!$db){	
			echo mysqli_errno($link).": ".mysqli_error($link);
			exit;
		}
		$post->comment = mysqli_real_escape_string($link, $post->comment);
		$query = "insert into posts(username, comment) values ('$post->name','$post->comment')";
		@$result = mysqli_query($link, $query);
		if (!$result){
			echo mysqli_errno($link).": ".mysqli_error($link);
			exit;
		}
		mysqli_close($link);
		header("Location:../index.php");
	die;
	}
}
else {
	header("Location: ../index.php");
	die;
}
?>