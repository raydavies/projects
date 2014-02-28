<?php
session_start();
if (!empty($_SESSION['notbot'])) {
	include_once("../inc/postclass.php");
	
	require_once('../config/info.php');
	require_once('../DbAdapter.php');
	$db = new DbAdapter($db_params['production']);
	
	$post = $_GET['postid'];
	$sql = "DELETE FROM posts WHERE postid = ".$post;
	$result = $db->query($sql);
	if ($result) {
		header("Location:../index.php");
		die;
	} else {
		print_r('Unable to delete post!');
		exit;
	}
} else {
	header("Location:../index.php");
	die;
}
