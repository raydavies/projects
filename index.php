<?php
session_start();
?>
<!DOCTYPE html>
<html>
<head>
<title>Comments</title>

<meta http-equiv="content-type" content="text/html; charset=utf-8" />

<link rel="stylesheet" type="text/css" href="style.css" />


<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
<script type="text/javascript" src="cgi/verify.js"></script>
<script type="text/javascript" src="cgi/delete.js"></script>

</head>
<body>

<h1>Comments</h1>

<div id="forum">

<?php require("cgi/viewpost.php"); ?>

</div><!--END FORUM DIV-->

<div id="newcomment">
<?php
$_SESSION['errormsg'] = '';
if (!defined('DB_HOST')){ include_once('cgi/info.php');}
function cleanData($data)
{
	if (get_magic_quotes_gpc()) {
		$data = stripslashes($data);
	}
		$data = str_replace("\n", '', trim($data));
		$data = str_replace("\r", '', $data);
		return $data;

}

if (isset($_POST['user']) && isset($_POST['pass'])) {
	$username = cleanData($_POST['user']);
	$password = cleanData($_POST['pass']);

	@$link = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME) or die("Error ".mysqli_connect_errno().": ".mysqli_connect_error());

	$query = "Select * from users where lower(username)='".strtolower($username)."' and password=sha1('".$password."')";

	@$result = mysqli_query($link, $query) or die("Error ".mysqli_errno($link).": ".mysqli_error($link));

	$rows = mysqli_num_rows($result);

	if ($rows > 0) {
		$row = mysqli_fetch_assoc($result);
		$_SESSION['notbot'] = $row['username'];
		mysqli_free_result($result);
	}
	else {
		$_SESSION['errormsg'] = "Invalid Login!";
	}

	mysqli_close($link);
}
if (isset($_SESSION['notbot']) && !empty($_SESSION['notbot'])) {
?>
	<h2>Post a comment</h2>

	<form id="commentform" method="post" action="cgi/addpost.php">
		<p>Name: <span id="username"><?php echo $_SESSION['notbot'].' <a href="cgi/logout.php">Log Out</a>'; ?></span></p><br>
		<p>Comments: <span class="errormsg" id="commenterrormsg">Please enter some text below</span><br>
		<textarea cols="45" rows="8" name="comment" id="comment"></textarea></p><br>
		<p><input type="submit" id="submit" value="Post" /></p>
	</form>
<?php
}
else {
?>
	<h2>Log in to post a comment</h2>

	<form id="loginform" method="post" action="">
		<p>Username:<br>
		<input type="text" size="30" maxlength="50" name="user" id="user" /></p><br>
		<p>Password:<br>
		<input type="password" size="30" maxlength="30" name="pass" id="pass"/></p><br>
		<p><span id="loginerr"><?php echo $_SESSION['errormsg']; ?></span></p>
		<p><input type="submit" id="submit" value="Log In"/></p>
	</form>
<?php
}
?>
</div><!--END NEWCOMMENT DIV-->
</body>
</html>
