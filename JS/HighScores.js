// These are all used like a circular array for setting sorting preferences that are passed to php.
// PHP will add each key to the ORDER BY clause with its value. We can add more columns here if we want.
var sortOptions = ["none", "ASC", "DESC"];
var sortIndex = {
    username : 0, gridSize : 0, gameDuration : 0, mistakes : 0, score : 0
};

var sortIndexTA = {
    username : 0, gridSize : 0, gameDuration : 0, mistakes : 0, score : 0,
    numberOfLevels : 0 
};

var currentSort = { 
    username : "none", gridSize : "none", gameDuration : "none", 
    mistakes : "none", score : "none"
};

var currentSortTA = {
    username : "none", gridSize : "none", gameDuration : "none",
    mistakes : "none", score : "none", numberOfLevels : "none"
};

function LoadPage()
{
    // Runs when page is loaded
    GetTableData();
    GetTableDataTA();
}

function PopulateTable(tableData)
{
    if(tableData == undefined)
        return;

    // first, clear out any previous data
    ClearTable();

    // console.log(tableData);
    data = JSON.parse(tableData); // parse the json that was sent from PHP

    for(let i = 0; i < data.length; i++)
    {
        let newRow = document.createElement("tr");
        newRow.setAttribute("role", "row");
        for(let key in data[i])
        {
            if(key == "gameID" || key == "gameMode" || key == "numberOfLevels")
                continue;

            let newTD = document.createElement("td");
            newTD.setAttribute("role", "cell");
            newTD.innerHTML = data[i][key];
            newRow.append(newTD);
        }
        document.getElementById("dynamicData").append(newRow);
        // console.log(data[i]["username"]);
    }

}

function PopulateTableTA(tableData)
{
    if(tableData == undefined)
        return;

    // first, clear out any previous data
    ClearTableTA();

    // console.log(tableData);
    data = JSON.parse(tableData); // parse the json that was sent from PHP

    for(let i = 0; i < data.length; i++)
    {
        let newRow = document.createElement("tr");
        newRow.setAttribute("role", "row");
        for(let key in data[i])
        {
            if(key == "gameID" || key == "gameMode")
                continue;

            let newTD = document.createElement("td");
            newTD.setAttribute("role", "cell");
            newTD.innerHTML = data[i][key];
            newRow.append(newTD);
        }
        document.getElementById("dynamicDataTA").append(newRow);
        // console.log(data[i]["username"]);
    }
}

function ClearTableTA()
{
    let dynamicData = document.getElementById("dynamicDataTA");
    while (dynamicData.firstChild) 
        dynamicData.removeChild(dynamicData.firstChild);
}

function ClearTable()
{
    let dynamicData = document.getElementById("dynamicData");
    while (dynamicData.firstChild) 
        dynamicData.removeChild(dynamicData.firstChild);
}

function GetTableData()
{
    // let formData = new FormData();
    CheckDB();

    let sortSet = false;

    let json;

    // Check current sorting to see if any sorting is set
    for(key in sortIndex)
    {
        if(currentSort[key] != "none")
            sortSet = true;
    }

    if(sortSet)
        json = {function : "sort", sortData : currentSort};
    else
        json = {function : "populate"};

    $.ajax({
        url : '../PHP/GetScores.php', // your php file
        type : 'POST', // type of the HTTP request
        data : JSON.stringify(json),
        contentType: "application/json",
        cache: false,
        processData: false,
        success : function(data)
        {
            if(data == "NoData")
            {
                alert("No data to show");
                return;
            }

            PopulateTable(data);
        }
     });

     
}


function GetTableDataTA()
{
    // let formData = new FormData();
    CheckDB();

    let sortSetTA = false;

    let jsonTA;

    for(key in sortIndexTA)
    {
        if(currentSortTA[key] != "none")
            sortSetTA = true;
    }

    if(sortSetTA)
        jsonTA = {function : "sortTA", sortData : currentSortTA};
    else
        jsonTA = {function : "populateTA"};

    $.ajax({
        url : '../PHP/GetScores.php', // your php file
        type : 'POST', // type of the HTTP request
        data : JSON.stringify(jsonTA),
        contentType: "application/json",
        cache: false,
        processData: false,
        success : function(data)
        {
            if(data == "NoData")
            {
                alert("No data to show");
                return;
            }

            PopulateTableTA(data);
        }
        });
}


function GetSortedData(columnName)
{
    // set the next sorting mode. Circles the array in this order: none, ASC, DESC
    currentSort[columnName] = sortOptions[(++sortIndex[columnName]) % sortOptions.length];
    
    if(currentSort[columnName] == "ASC")
        document.getElementById(columnName).className = "headerSortDown";
    else if(currentSort[columnName] == "DESC")
        document.getElementById(columnName).className = "headerSortUp";
    else
        document.getElementById(columnName).classList.remove("headerSortUp");

    GetTableData();
}

function GetSortedDataTA(columnName)
{
    // set the next sorting mode. Circles the array in this order: none, ASC, DESC
    currentSortTA[columnName] = sortOptions[(++sortIndexTA[columnName]) % sortOptions.length];
    
    if(currentSortTA[columnName] == "ASC")
        document.getElementById(columnName + "TA").className = "headerSortDown";
    else if(currentSortTA[columnName] == "DESC")
        document.getElementById(columnName + "TA").className = "headerSortUp";
    else
        document.getElementById(columnName + "TA").classList.remove("headerSortUp");

    GetTableDataTA();
}