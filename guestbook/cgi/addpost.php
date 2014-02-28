<?php
session_start();
if (!empty($_SESSION['notbot'])) {
	$user = stripslashes($_SESSION['notbot']);
	$cmmt = stripslashes($_POST['comment']);
	if (empty($cmmt)) {
		header("Location: ../index.php");
		die;
	} else {
		include_once('../inc/postclass.php');
		
		require_once('../config/info.php');
		require_once('../DbAdapter.php');

		$db = new DbAdapter($db_params['production']);

		date_default_timezone_set('America/Chicago');
		$post = new Post();
		$post->formatPost($user, $cmmt);

		$sql = "SELECT user_id FROM users WHERE LOWER(username) = '".strtolower($_SESSION['notbot'])."'";
		$result = $db->query($sql);

		if ($result->getAffectedRows()) {
			$current = $result->fetchAssoc();
			$user_id = $current['user_id'];
		} else {
			$user_id = 0;
		}
		
		$post->comment = $db->escape($post->comment);
		
		$sql = "INSERT INTO posts(user_id, comment) VALUES (".$user_id.", '".$post->comment."')";
		
		$result = $db->query($sql);
		if ($result) {
			header("Location:../index.php");
			die;
		} else {
			print_r('Could not post comment!');
			exit;
		}
	}
} else {
	header("Location: ../index.php");
	die;
}
