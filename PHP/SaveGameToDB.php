<?php

if(!isset($_SESSION)) 
{ 
    session_start();
} 

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
$dbName = "DBMarkPhilipp";

// Create connection
$conn = new mysqli($servername, $username, $password,$dbName);

// Check connection
if (mysqli_connect_errno())
{
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
    return;
}

// Check if table exists and create it if not
if(!mysqli_query($conn, "DESCRIBE Games"))
{
    // game table does not exist so insert it
    $queryString = "CREATE TABLE IF NOT EXISTS Games (gameID VARCHAR(32), username VARCHAR(45), gridSize INT, gameDuration INT, mistakes INT, score INT) ENGINE=INNODB;";
    $conn->query($queryString);
}

// Create the values that get inserted into SQL
$valueString = "('" . $jsonInput['gameID'] . "', '" . $playerName . "', '" . $jsonInput['gridSize'] . "', '" . $jsonInput['gameDuration'] .
"', '" . $jsonInput['mistakes'] . "', '" . $jsonInput['score'] . "')";

// make a query
$sql = "INSERT INTO Games (gameID, username, gridSize, gameDuration, mistakes, score) 
VALUES " . $valueString;

$result = $conn->query($sql);

if($result)
    echo "Game Inserted Successfully";
else
    echo "Failed to Insert";

?>