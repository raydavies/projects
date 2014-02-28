<?php
session_start();
$_SESSION['errormsg'] = '';

require_once('config/info.php');
require_once('DbAdapter.php');

$db = new DbAdapter($db_params['development']);

if (isset($_POST['user'], $_POST['pass'])) {
	$username = cleanData($_POST['user']);
	$password = cleanData($_POST['pass']);
	
	$sql = "SELECT * FROM users WHERE LOWER(username) = '".strtolower($username)."' AND password = SHA1('".$password."')";

	$result = $db->query($sql);
	$rows = $result->getAffectedRows();

	if ($rows > 0) {
		$row = $result->fetchAssoc();
		$_SESSION['notbot'] = $row['username'];
		$result->freeResult();
	} else {
		$_SESSION['errormsg'] = "Invalid Login!";
	}
}

include_once('templates/forum.php');

function cleanData($data)
{
	if (get_magic_quotes_gpc()) {
		$data = stripslashes($data);
	}
	$data = str_replace("\n", '', trim($data));
	$data = str_replace("\r", '', $data);
	return $data;
}