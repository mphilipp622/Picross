var grid; // using var for global scope. Instantiated in CreateGrid()

// Time variables
var totalTime;
var id;

// Game Stats
var turns = 0;
var mistakes = 0;

var levels = []; // stores grids for a level
var currentLevel = 0;

var isArcadeMode = false;
var isTimeAttackMode = false;

var request;

function SaveLevelData()
{
    let newGUID = GetGUID();
    // console.log(newGUID);

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
            let newString = '{ "row" : ' + j.toString() + ', "column" : ' + i.toString() + ', "isMistake" : ' + grid.GetTile(j, i).GetIsMistake() + ' }'
            data.tiles.push(newString);
        }
    }

    let jsonData = JSON.stringify(data);
    console.log(jsonData);

    request= new XMLHttpRequest();
    request.onreadystatechange = callback;
    request.open("GET", "../PHP/SaveLevelToDatabase.php?json=" + jsonData, true);
    // request.setRequestHeader("Content-type", "application/json");
    request.send(null);

    // JSON.stringify(data);
    // console.log(data);
}

// GUID creates a unique value that will be used for levelID's. Based on implementations found online.
function GetGUID() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
  }

function hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}

function callback (){
    if(request.readyState == 4)
    {
        console.log(request.responseText);
        // let jsobj = JSON.parse(request.responseText);
        // console.log(JSON.stringify(jsobj));
    }
}

function CreateGrid()
{
    let newWidth = document.getElementById("gridWidth").value;
    let newHeight = document.getElementById("gridHeight").value;
    grid = new Grid(newWidth, newHeight);

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