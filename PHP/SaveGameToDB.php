<?php

$playerName;

if(isset($_SESSION['username']))
    $playerName = $_SESSION['username']['username'];
else
{
    echo "Login";
    return;
}

$jsonInput = json_decode(file_get_contents('php://input'), true);

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
    return;
}

// Create the values that get inserted into SQL
$valueString = "('" . $jsonInput['gameID'] . "', '" . $playerName . "', '" . $jsonInput['gridSize'] . "', '" . $jsonInput['gameDuration'] .
"', '" . $jsonInput['mistakes'] . "', '" . $jsonInput['score'] . "')";

// make a query
$sql = "INSERT INTO game (gameID, username, gridSize, gameDuration, mistakes, score) 
VALUES " . $valueString;

$result = $conn->query($sql);

if($result)
    echo "Game Inserted Successfully";
else
    echo "Failed to Insert";