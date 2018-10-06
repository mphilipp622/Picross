<?php

if(isset($_GET['json']))
{
    $jsonInput = json_decode($_GET['json'], true);
}
else
{
    return;
}

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

$tileString = "";
    foreach($jsonInput['tiles'] as &$value)
        $tileString .= $value . ",";
    
$tileString = rtrim($tileString, ','); // get rid of last ,

// Create the values that get inserted into SQL
$valueString = "('" . $jsonInput['levelID'] . "', '" . $jsonInput['width'] . "', '" . $jsonInput['height'] .
"', '" . $tileString . "', '" . $jsonInput['borderColor'] . "', '" . $jsonInput['tileColor'] . "')";

// make a query
$sql = "INSERT INTO level (levelID, width, height, tiles, tableColor, tileColor) 
VALUES " . $valueString;

$result = $conn->query($sql);

if($result)
    echo "Level Inserted Successfully";
else
    echo "Failed to Insert";