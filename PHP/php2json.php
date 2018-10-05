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

// make a query
$sql = "select * from sometable";
$result = $conn->query($sql);


$output = array();
$output  = $result->fetch_all(MYSQLI_ASSOC);

echo json_encode($output);
$conn->close();

// agustin

