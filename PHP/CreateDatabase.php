<?php
$servername = "localhost";
$username = "csci130";
$password = "123456";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if (mysqli_connect_errno())
{
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

if(mysqli_query($conn, "SHOW DATABASES LIKE 'DBMarkPhilipp'")->num_rows == 0)
{
    // Create database if it doesn't exist
    $queryString = "CREATE DATABASE DBMarkPhilipp";
    $conn->query($queryString);

    // Create connection
    $conn = new mysqli($servername, $username, $password, "DBMarkPhilipp");
    // Create all the tables
    $queryString = "CREATE TABLE IF NOT EXISTS Games (gameID VARCHAR(32), username VARCHAR(45), gridSize INT, gameDuration INT, mistakes INT, score INT, gameMode VARCHAR(45), numberOfLevels INT) ENGINE=INNODB;";
    $conn->query($queryString);

    // $sql = "INSERT INTO Games (gameID, username, gridSize, gameDuration, mistakes, score) 
    // VALUES " . $valueString;

    $queryString = "CREATE TABLE IF NOT EXISTS Levels (levelID VARCHAR(32), username VARCHAR(45), width INT, height INT, tiles VARCHAR(10000), tableColor VARCHAR(45), tileColor VARCHAR(45)) ENGINE=INNODB;";
    $conn->query($queryString);

    // $sql = "INSERT INTO Levels (levelID, username, width, height, tiles, tableColor, tileColor) 
    // VALUES " . $valueString;

    $queryString = "CREATE TABLE IF NOT EXISTS Players (username VARCHAR(45), password VARCHAR(45), firstName VARCHAR(45), lastName VARCHAR(45), age INT, gender VARCHAR(45), location VARCHAR(45)) ENGINE=INNODB;";
    $conn->query($queryString);

    // $sql = "INSERT INTO Players (username, password, firstName, lastName, age, gender, location) 
    // VALUES " . $valueString;
}

?>