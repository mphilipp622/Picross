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

function CreateGridFromImage() 
{
    let img = new Image();
    img.crossOrigin = "Anonymous";

    let dimension;
    let ctx;
    let canvas;

    let imgFile = document.getElementById("imageInput").files[0];

    let formData = new FormData();

    formData.append("type", "level");
    formData.append("image", imgFile);

    $.ajax({
        url: "../PHP/UploadLevelImage.php",
        type: "POST",
        data: formData, 
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
        //   console.log(data);
        },
        error: function(data) {
          console.log("Error");
        },
        complete: function(data) {
            populateImage();
          // After file uploads, update the active user and go to main page.
        //   window.location.reload();
          // window.location.href = "../HTML/Main.html";
        }
      });

    function populateImage()
    {
        let selection = document.getElementById("gridDimensionImage")
        dimension = parseInt(selection.options[selection.selectedIndex].value);
    
        canvas = document.createElement("canvas");
        ctx = canvas.getContext("2d");
        // canvas.width = dimension
        // canvas.height = dimension
    
        
        //img.src = "/assets/Mario.png";
        //img.src = "https://vignette.wikia.nocookie.net/mario/images/3/32/8_Bit_Mario.png/revision/latest?cb=20120602231304";
        //img.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Emacs_Tetris_vector_based_detail.svg/200px-Emacs_Tetris_vector_based_detail.svg.png";
        img.src = "../LevelImages/" + "temp.jpg";
    }

	function getPixel(x, y) {
		// returns RGB and Alpha
		return ctx.getImageData(x, y, 1, 1).data;
    }

	function getImageAverage() {
		let count = 0;
		let total = 0;
		for (let i = 0; i < dimension; i++) {
			for (let j = 0; j < dimension; j++) {
				let p = getPixel(i, j);
				total += p[0] + p[1] + p[2] + p[3];
				count++;
			}
		}
		let avg = total / count;
		return avg;
	}

	function processImage() {
		let avg = getImageAverage();
        newTiles = [];

        // Initialize 2D array
        for(let i = 0; i < dimension; i++)
            newTiles[i] = new Array(dimension);

		for (let i = 0; i < dimension; i++) {
			for (let j = 0; j < dimension; j++) {
                newTiles[i][j] = new Tile(i, j);

				let p = getPixel(j, i);
				let total = p[0] + p[1] + p[2] + p[3];
				if (total >= avg) {
					newTiles[i][j].SetIsMistake(true);
				}
			}
        }
        grid = new Grid(dimension, dimension);
        grid.SetTilesFromImage(newTiles, dimension);
	}

	// will trigger automatically when the imageworks is called and the image has loaded
	img.onload = function() {

		var oc = document.createElement("canvas"),
			octx = oc.getContext("2d");

		oc.width = dimension; // needed for the canvas
		oc.height = dimension; // needed for the canvas

		octx.drawImage(img, 0, 0, dimension, dimension);
		ctx.drawImage(oc, 0, 0, dimension, dimension);
		oc.style.display = "none";
        processImage();
        CreateTable();
        CreateTableOnClickFunctionality();
        UpdateGameStats();
        StartTimer();
        // createGameBoardHTML();
        // activateSection("editor");
	};
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