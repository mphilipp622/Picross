var grid; // using var for global scope. Instantiated in CreateGrid()

// Time variables
var totalTime;
var id;

// Game Stats
var turns = 0;
var mistakes = 0;
var score = 0;

var levels = []; // stores grids for a level
var currentLevel = 0;
var dbLevels;
var loadedLevel = -1;

var isArcadeMode = false;
var isTimeAttackMode = false;

function CreateGrid()
{
    let selection = document.getElementById("gridDimension");
    let newDimension = parseInt(selection.options[selection.selectedIndex].value);
    grid = new Grid(newDimension, newDimension);

    CreateTable();
    CreateTableOnClickFunctionality();
    UpdateGameStats();
    StartTimer();
}

function StartArcadeMode()
{
    let numberOfLevels = document.getElementById("numberOfLevels").value;
    let selection = document.getElementById("arcadeDimension");
    let newDimension = parseInt(selection.options[selection.selectedIndex].value);
    let newWidth = newDimension;
    let newHeight = newDimension;
    levels = [];

    // create as many levels as user specified. Max dimensions of 15x15. Min dimensions of 2x2
    for(let i = 0; i < numberOfLevels; i++)
    {
        tempGrid = new Grid(newWidth, newHeight);

        levels.push(tempGrid);
    }

    grid = levels[0];
    isArcadeMode = true;

    CreateTable();
    CreateTableOnClickFunctionality();
    UpdateGameStats();
    StartTimer();
}

function LoadNextLevel()
{
    currentLevel++;

    if(currentLevel >= levels.length)
    {
        ChangeToVictoryColors();
        StopTimer();
        PrintVictoryMessage();
        return;
    }

    grid = levels[currentLevel];

    CreateTable();
    CreateTableOnClickFunctionality();
    UpdateGameStats();
}

function StartTimer()
{
    clearInterval(id);

    let timerText = document.getElementsByClassName("TimerText")[0];
    totalTime = 0;

    id = setInterval(function()
    { 
        totalTime++;

        timerText.innerHTML = GetConvertedTime();

    }, 1000);
}

function StopTimer()
{
    clearInterval(id);
}

// returns a string in the format of mm:ss
function GetConvertedTime()
{
    seconds = totalTime % 60;

    secondsOnesDigit = seconds % 10;

    secondsTensDigit = parseInt(seconds / 10);

    minute = parseInt(totalTime / 60);

    minutesTensDigit = parseInt(minute / 10);

    return minutesTensDigit.toString() + minute.toString() + ":" + secondsTensDigit.toString() + secondsOnesDigit.toString();
}

// Updates the HTML to show turns, time remaining, and mistakes made
function UpdateGameStats()
{
    document.getElementById("TurnData").innerHTML = turns
    document.getElementById("TilesRemainingData").innerHTML = grid.GetRemainingTiles();
    document.getElementById("MistakeData").innerHTML = mistakes;
}

function SaveGame()
{
    let newGUID = GetGUID();

    let data = {
        "gameID" : newGUID,
        "gridSize": grid.GetWidth(),
        "gameDuration": totalTime,
        "mistakes": mistakes,
        "score": score
    }

    let jsonData = JSON.stringify(data);
    
    request= new XMLHttpRequest();
    request.onreadystatechange = GameCallback;
    request.open("POST", "../PHP/SaveGameToDB.php", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(jsonData);
}

function GameCallback ()
{
    if(request.readyState == 4)
    {
        if(request.responseText == "Login")
            alert("You must be signed into an account to save a game");
        else
            console.log("Game Saved");
    }
}

function SaveLevelData()
{
    if(grid == undefined)
    {
        alert("Error: you must create a grid first");
        return;
    }

    let newGUID = GetGUID();

    let data = {
        "levelID" : newGUID,
        "width" : grid.GetWidth(),
        "height": grid.GetHeight(),
        "tiles": [],
        "borderColor": hexToRGB(document.getElementById("BorderColor").value, 1.0),
        "tileColor": hexToRGB(document.getElementById("TileColor").value, 1.0)
    }

    for(i = 0; i < grid.GetWidth(); i++)
    {
        for( j = 0; j < grid.GetHeight(); j++)
        {
            let newObj = {row : j.toString(), column : i.toString(), isMistake : grid.GetTile(j, i).GetIsMistake().toString()};
            // let newString = '{ row : ' + j.toString() + ', column : ' + i.toString() + ', isMistake : ' + grid.GetTile(j, i).GetIsMistake() + ' }';
            data.tiles.push(JSON.stringify(newObj));
        }
    }

    // tiles = JSON.stringify(tiles);
    let jsonData = JSON.stringify(data);
    
    request= new XMLHttpRequest();
    request.onreadystatechange = LevelCallback;
    request.open("POST", "../PHP/SaveLevelToDatabase.php", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(jsonData);
}

function LevelCallback ()
{
    if(request.readyState == 4)
    {
        if(request.responseText == "Login")
            alert("You must be signed into an account to save a level");
        else
            alert("Level Saved");
    }
}

function LoadLevelData()
{
    $.ajax({
        url : '../PHP/GetLevelData.php', // your php file
        type : 'GET', // type of the HTTP request
        success : function(data){
            if(data == "NoData")
                return;
            dbLevels = JSON.parse(data);
        //    PopulateLevelData(data);
        //    console.log(obj);
        }
     });


}

function PopulateLevelData(nextIndex)
{
    // Get the next index of the levels from the database. Bounds check
    
    if(loadedLevel + nextIndex < 0)
        return;
    else if(loadedLevel + nextIndex >= dbLevels.length)
        return;

    loadedLevel = loadedLevel + nextIndex;
    let nextLevel = dbLevels[loadedLevel];

    let newTable = CreateTableFromDB(nextLevel["width"], nextLevel["tiles"], nextLevel["tableColor"], nextLevel["tileColor"]);

    let newDiv = document.getElementById("PicrossGrid");

    // Check if table already exists. If so, kill it.
    if(document.getElementById("levelSection") != null)
        document.getElementById("levelSection").remove();

    document.getElementById("username").innerHTML = nextLevel["username"];
    newDiv.append(newTable);

    UpdateGameStats();
    StopTimer();
    // CreateGridFromDB();
}

function StartLevel()
{
    if(grid == null)
        return;
        
    CreateTableOnClickFunctionality();
    StartTimer();
}

function hexToRGB(hex, alpha) 
{
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) 
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    else 
        return "rgb(" + r + ", " + g + ", " + b + ")";
}

// GUID creates a unique value that will be used for levelID's. Based on implementations found online.
function GetGUID() 
{
    function s4() 
    {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}