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

// Get the function name that's passed from HighScores.js
$jsonInput = json_decode(file_get_contents('php://input'), true);

// Execute functionality accordingly.
if($jsonInput["function"] == "populate")
    Populate();
else
    SortData($jsonInput["sortData"]);

function ReturnData($queryResult)
{
    if ($queryResult->num_rows > 0) 
    {
        $myArray = array();
        
        while($row = $queryResult->fetch_object()) 
            array_push($myArray, $row);

        echo json_encode($myArray);
    }
    else 
    {
        echo "NoData";
        return;
    }
}

function Populate()
{
    $query = "SELECT * FROM Games";

    $result = $GLOBALS["conn"]->query($query);

    ReturnData($result);
}

function SortData($sortData)
{
    // echo $sortData["gameDuration"] . "    " . $sortData["score"];
    $query = "SELECT * FROM Games ORDER BY ";
    // $sortingOrder = $_POST["order"];

    foreach($sortData as $key => $val) 
    {
        if($val == "none")
            continue;

        $query = $query . $key . " " . $val . ", ";
    }

    $query = rtrim($query, ', ');

    $result = $GLOBALS["conn"]->query($query);

    ReturnData($result);
}



?>