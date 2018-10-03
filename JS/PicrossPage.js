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