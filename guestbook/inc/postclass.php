<?php

class Post
{
	public $name;
	public $comment;

	public function formatPost($user, $cmmt)
	{
		$this->name = htmlentities(stripslashes($user), ENT_QUOTES, "UTF-8");
		$this->comment = htmlentities(stripslashes($cmmt), ENT_QUOTES, "UTF-8");
	}
}
