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
    return;
}

// Get the function name that's passed from HighScores.js
$function = $_POST["function"];

// Execute functionality accordingly.
if($function == "populate")
    Populate();
else
    SortData();

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
    $query = "SELECT * FROM game";

    $result = $GLOBALS["conn"]->query($query);

    ReturnData($result);
}

function SortData()
{
    $query = "SELECT * FROM game ORDER BY ";
    // $sortingOrder = $_POST["order"];

    // $sortingOrder = json_encode($_POST["order"]);

    echo $_POST["order"];

    // foreach($sortingOrder as $item)
    // {
    //     echo $item;
    // }
    // $column1 = $sortingOrder["gameDuration"]
    // $column2; // column2 might not be set depending on what user wants to sort.

    // if(isset($_POST["column2"]))
    // {
    //     $column2 = $_POST["column2"];

    //     $query = "SELECT * FROM game ORDER BY " . $column1 . ", " . $column2 . " " . $sortingORDER . ";";
    // }
    // else
    //     $query = "SELECT * FROM game ORDER BY " . $column1 . " " . $sortingOrder . ";";

    $result = $GLOBALS["conn"]->query($query);

    ReturnData($result);
}



?>