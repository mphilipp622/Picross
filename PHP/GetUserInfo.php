<?php

if(isset($_SESSION['username']))
{ // OR isset($_SESSION['user']), if array
// Logged In
    // $data = array($_SESSION['username'], 
    //               $_SESSION['firstName'], 
    //               $_SESSION['lastName'],
    //               $_SESSION['age'],
    //               $_SESSION['gender'],
    //               $_SESSION['location'] );

    echo json_encode($_SESSION['username']);
}
else
{
    echo "Please Login";
}