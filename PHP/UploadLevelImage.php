<?php

//File destination

$targetDir = "../LevelImages/";
$target_file = $targetDir . basename($_FILES["image"]["name"]);
$uploadOk = 1;
$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
$target_file = $targetDir . "temp.jpg";

$check = getimagesize($_FILES["image"]["tmp_name"]);
if($check !== false) 
{
    echo "File is an image - " . $check["mime"] . ".";
    $uploadOk = 1;
} 
else 
{
    echo "File is not an image.";
    $uploadOk = 0;
}

// Check file size
if ($_FILES["image"]["size"] > 10000000 ) 
{
    echo "Sorry, your file is too large. 10MB max";
    $uploadOk = 0;
}

// Check if $uploadOk is set to 0 by an error
if ($uploadOk == 0) {
    echo "Sorry, your file was not uploaded.";
// if everything is ok, try to upload file
} 
else 
{
    if (move_uploaded_file($_FILES["image"]["tmp_name"], $target_file)) 
    {
        echo "The file ". basename( $_FILES["image"]["name"]). " has been uploaded.";
    } 
    else 
    {
        echo "Sorry, there was an error uploading your file.";
    }
}
?>