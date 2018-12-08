<?php

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

$query = "SELECT * FROM Levels";

$result = $conn->query($query);

if ($result->num_rows > 0)
{
    $myArray = array();
    
    while($row = $result->fetch_object()) 
        array_push($myArray, $row);

    echo json_encode($myArray);
}
else 
{
    echo "NoData";
    return;
}

?>