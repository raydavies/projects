<!DOCTYPE html>
<html>
<head>
	<title>Guestbook</title>

	<meta http-equiv="content-type" content="text/html; charset=utf-8" />

	<link rel="stylesheet" type="text/css" href="style.css" />

	<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>
	<script type="text/javascript" src="cgi/verify.js"></script>
	<script type="text/javascript" src="cgi/delete.js"></script>
</head>
<body>
	<div id="guestbook">
		<h1>Guestbook</h1>
		<div id="forum">
			<?php require_once("cgi/viewpost.php"); ?>
		</div><!--END FORUM DIV-->
		
		<div id="newcomment">
		<?php
		if (!empty($_SESSION['notbot'])) {
		?>
			<h2>Post a comment</h2>
	
			<form id="commentform" method="post" action="cgi/addpost.php">
				<div class="element">
					<p class="label">Name: <span id="username"><?php echo $_SESSION['notbot'].' <a class="logout" href="cgi/logout.php">Log Out</a>'; ?></span></p>
				</div>
				<div class="element">
					<p class="label">Comments: <span class="errormsg" id="commenterrormsg">Please enter a comment in the box below</span><p>
					<textarea cols="45" rows="8" name="comment" id="comment"></textarea>
				</div>
				<p class="element">
					<input type="submit" id="submit" value="Post" />
				</p>
			</form>
		<?php
		} else {
		?>
			<h2>Log in to post a comment</h2>
	
			<form id="loginform" method="post" action="">
				<p id="loginerr">
					<span><?php echo $_SESSION['errormsg']; ?></span>
				</p>
				<div class="element">
					<p class="label">Username</p>
					<input type="text" size="30" maxlength="50" name="user" id="user" />
				</div><br>
				<div class="element">
					<p class="label">Password</p>
					<input type="password" size="30" maxlength="30" name="pass" id="pass"/>
				</div><br>
				<div class="element">
					<input type="submit" id="submit" value="Log In"/>
				</div>
			</form>
		<?php
		}
		?>
		</div><!--END NEWCOMMENT DIV-->
	</div>
</body>
</html>
