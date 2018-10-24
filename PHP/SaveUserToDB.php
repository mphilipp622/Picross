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

$userID = $_POST["userID"];
$username = $_POST["username"];
$password = $_POST["password"];
$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$age = $_POST["age"];
$gender = $_POST["gender"];
$location = $_POST["location"];

// Create the values that get inserted into SQL
$valueString = "('" . $userID . "', '" . $username . "', sha1('" . $password . "'), '" . $firstName . "', '" . $lastName .
"', '" . $age . "', '" . $gender . "', '" . $location . "')";

// make a query
$sql = "INSERT INTO player (userID, username, password, firstName, lastName, age, gender, location) 
VALUES " . $valueString;

$result = $conn->query($sql);

if($result)
    echo "Level Inserted Successfully";
else
    echo "Failed to Insert";

?>