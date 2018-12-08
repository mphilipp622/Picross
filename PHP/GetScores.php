<?php

$servername = "localhost";
$username = "csci130";
$password = "123456";
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
else if ($jsonInput["function"] == "sort")
    SortData($jsonInput["sortData"]);
else if($jsonInput["function"] == "populateTA")
    PopulateTA();
else if($jsonInput["function"] == "sortTA")
    SortDataTA($jsonInput["sortData"]);

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
    $query = "SELECT * FROM Games WHERE gameMode <> 'Time Attack'";

    $result = $GLOBALS["conn"]->query($query);

    ReturnData($result);
}

function SortData($sortData)
{
    // echo $sortData["gameDuration"] . "    " . $sortData["score"];
    $query = "SELECT * FROM Games WHERE gameMode <> 'Time Attack' ORDER BY ";
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

function PopulateTA()
{
    $query = "SELECT * FROM Games WHERE gameMode = 'Time Attack'";

    $result = $GLOBALS["conn"]->query($query);

    ReturnData($result);
}

function SortDataTA($sortData)
{
    // echo $sortData["gameDuration"] . "    " . $sortData["score"];
    $query = "SELECT * FROM Games WHERE gameMode = 'Time Attack' ORDER BY ";
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