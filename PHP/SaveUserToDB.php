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
}

// Check if table exists and create it if not
if(mysqli_query($conn, "DESCRIBE Players") == false)
{
    // game table does not exist so insert it
    echo "NO TABLE PLAYER";
    $queryString = "CREATE TABLE IF NOT EXISTS Players (username VARCHAR(45), password VARCHAR(45), firstName VARCHAR(45), lastName VARCHAR(45), age INT, gender VARCHAR(45), location VARCHAR(45)) ENGINE=INNODB;";
    $conn->query($queryString);
}

$username = $_POST["username"];
$password = $_POST["password"];
$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$age = $_POST["age"];
$gender = $_POST["gender"];
$location = $_POST["location"];

// Create the values that get inserted into SQL
$valueString = "('" . $username . "', sha1('" . $password . "'), '" . $firstName . "', '" . $lastName .
"', '" . $age . "', '" . $gender . "', '" . $location . "')";

// make a query
$sql = "INSERT INTO Players (username, password, firstName, lastName, age, gender, location) 
VALUES " . $valueString;

$result = $conn->query($sql);

if($result)
    echo "Success";
else
    echo "UsernameExists";

?>