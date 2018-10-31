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

function CreateGridFromDB(newDimension)
{
    grid = new Grid(newDimension, newDimension);

    CreateTable();
    CreateTableOnClickFunctionality();
    UpdateGameStats();
    StartTimer();
}

function StartArcadeMode()
{
    let numberOfLevels = document.getElementById("numberOfLevels").value;
    let maxWidth = Math.floor(document.getElementById("maxWidth").value);
    let maxHeight = Math.floor(document.getElementById("maxHeight").value);
    let minWidth = Math.ceil(document.getElementById("minWidth").value);
    let minHeight = Math.ceil(document.getElementById("minHeight").value);

    // create as many levels as user specified. Max dimensions of 15x15. Min dimensions of 2x2
    for(let i = 0; i < numberOfLevels; i++)
    {
        let newWidth = Math.floor(Math.random() * (maxWidth - minWidth)) + minWidth;
        let newHeight = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight;

        tempGrid = new Grid(newWidth, newHeight);

        levels.push(tempGrid);
    }

    grid = levels[0];
    isArcadeMode = true;

    console.log(grid);

    CreateTable();
    CreateTableOnClickFunctionality();
    UpdateGameStats();
    RemoveGridOptions();
    StartTimer();
    // document.location.href = "ArcadeMode.html";
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

// WORK IN PROGRESS
function CreateGridFromImage()
{
    let newWidth = document.getElementById("gridWidth").value;
    let newHeight = document.getElementById("gridHeight").value;
    grid = new Grid(newWidth, newHeight);

    let img = document.getElementById("imageInput").value;
    console.log(img);

    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    console.log(canvas);

    let context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height);

    // canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

    let imageData = context.getImageData(0,0,canvas.width,canvas.height);
    let data = imageData.data;
    let r,g,b,avg;
    let colorSum = 0;

    console.log(data.length);

    // for(let x = 0; x < data.length; x += 4) {
    //     // Each pixel stores 4 values. RGBA. Skip by 4 each iteration.
    //     r = data[x];
    //     g = data[x+1];
    //     b = data[x+2];

    //     avg = Math.floor((r+g+b)/3);
    //     colorSum += avg;
    // }

    // let brightness = Math.floor(colorSum / (this.width*this.height));

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
        console.log(request.responseText);
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
           PopulateLevelData(data);
        //    console.log(obj);
        }
     });


}

function PopulateLevelData(levelData)
{
    
    levelData = JSON.parse(levelData);
    let levelSection = document.createElement("section");
    levelSection.id = "levelDataSection";

    for(let i = 0; i < levelData.length; i++)
    {
        let newTable = CreateTableFromDB(levelData[i]["width"], levelData[i]["tiles"], levelData[i]["tableColor"], levelData[i]["tileColor"]);

        levelSection.append(newTable);
    }

    document.body.insertBefore(levelSection, document.body.firstChild);

    // CreateGridFromDB();
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