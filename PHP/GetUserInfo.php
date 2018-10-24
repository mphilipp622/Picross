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
$query = "SELECT * FROM player WHERE username = '" . $_GET["username"] . "'";

$sth = mysqli_query($conn, $query);
$rows = array();
while($r = mysqli_fetch_assoc($sth)) {
    $rows[] = $r;
}

echo json_encode($rows);