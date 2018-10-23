<?php

//File destination
$destination = "../Avatars/" . $_POST["firstName"] . $_POST["lastName"] . ".jpg";

//Get convertable base64 image string
$image_base64 = $_POST["avatar"];
$image_base64 = str_replace("data:image/png;base64,", "", $image_base64);
$image_base64 = str_replace(" ", "+", $image_base64);

//Convert base64 string to image data
$image = base64_decode($image_base64);

//Save image to final destination
file_put_contents($destination, $image);