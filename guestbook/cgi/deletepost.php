<?php
session_start();
if (isset($_SESSION['notbot']) || !empty($_SESSION['notbot'])){
	include_once("../inc/postclass.php");
	if (!defined('DB_HOST')){ include_once('info.php');}
	@$link = mysqli_connect(DB_HOST,DB_USER,DB_PASS);
	if (!$link){
		echo mysqli_connect_errno($link).": ".mysqli_connect_error($link);
		exit;
}
	@$db = mysqli_select_db($link, DB_NAME);
	if (!$db){
		echo mysqli_errno($link).": ".mysqli_error($link);
		exit;
	}
	$post = $_GET['postid'];
	$query = "Delete from posts where postid=".$post."";
	$result = mysqli_query($link, $query);
	if (!$result) {
		echo mysqli_errno($link).": ".mysqli_error($link);
		exit;
	}
	mysqli_close($link);
	header("Location:../index.php");
	die;
}
else {
	header("Location:../index.php");
	die;
}
?>	
