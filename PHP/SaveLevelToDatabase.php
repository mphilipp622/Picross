<?php

session_start();

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
}

// Check if table exists and create it if not
if(!mysqli_query($conn, "DESCRIBE level"))
{
    // game table does not exist so insert it
    $queryString = "CREATE TABLE IF NOT EXISTS level (levelID VARCHAR(32), username VARCHAR(45), width INT, height INT, tiles VARCHAR(10000), tableColor VARCHAR(45), tileColor VARCHAR(45)) ENGINE=INNODB;";
    $conn->query($queryString);
}

$tileString = "{\"tiles\" : [";
    foreach($jsonInput['tiles'] as &$value)
        $tileString .= $value . ",";

$tileString = rtrim($tileString, ','); // get rid of last ,
$tileString .= "]}";

// Create the values that get inserted into SQL
$valueString = "('" . $jsonInput['levelID'] . "', '" . $playerName . "', '" . $jsonInput['width'] . "', '" . $jsonInput['height'] .
"', '" . $tileString . "', '" . $jsonInput['borderColor'] . "', '" . $jsonInput['tileColor'] . "')";

echo $valueString;
// make a query
$sql = "INSERT INTO level (levelID, username, width, height, tiles, tableColor, tileColor) 
VALUES " . $valueString;

$result = $conn->query($sql);

if($result)
    echo "Level Inserted Successfully";
else
    echo "Failed to Insert";

?>