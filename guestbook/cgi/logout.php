<?php

session_start();

unset($_SESSION['notbot']);
session_destroy();

header("Location: ../index.php");
die;
?>
