<?php

if(!isset($_SESSION)) 
{ 
    session_start();
} 

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

// $_GET['username'] should give this code the currently active username on the site
$query = "SELECT * FROM Players WHERE username = '" . $_POST["username"] . "' AND password = sha1('" . $_POST["password"] . "')";
// $sth = mysqli_query($conn, $query);
$result = $conn->query($query);

if ($result->num_rows > 0) 
{
    // output data of each row
    $row = $result->fetch_assoc();
    // $_SESSION['username'] = $row["username"];
    // $_SESSION['firstName'] = $row["firstName"];
    // $_SESSION['lastName'] = $row["lastName"];
    // $_SESSION['age'] = $row["age"];
    // $_SESSION['gender'] = $row["gender"];
    // $_SESSION['location'] = $row["location"];
    $_SESSION['username'] = array(
        'username' =>  $row["username"],
        'firstName' => $row["firstName"],
        'lastName' => $row["lastName"],
        'age' => $row["age"],
        'gender' => $row["gender"],
        'location' => $row["location"]
    );

    echo "Success";
}
else 
{
    echo "LoginFailed";
    return;
}

?>