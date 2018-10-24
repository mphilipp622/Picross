<?php

$servername = "localhost";
$username = "root";
$password = "";
$dbName = "picross";

// Create connection
$conn = new mysqli($servername, $username, $password,$dbName);

// Check connection
if (mysqli_connect_errno())
{
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

// $_GET['username'] should give this code the currently active username on the site
$query = "SELECT * FROM player WHERE username = '" . $_GET["username"] . "' AND password = sha1('" . $_GET["password"] . "')";
$sth = mysqli_query($conn, $query);

if(!$sth)
{
    echo "Password Failed";
    return;
}

$query = "UPDATE player
SET isActive = 1
WHERE username = '" . $_GET["username"] . "' AND password = sha1('" . $_GET["password"] . "')";

$rows = array();
while($r = mysqli_fetch_assoc($sth)) {
    $rows[] = $r;
}

$conn->query($query);

echo json_encode($rows);