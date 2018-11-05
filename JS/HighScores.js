// These are all used like a circular array for setting sorting preferences that are passed to php.
// PHP will add each key to the ORDER BY clause with its value. We can add more columns here if we want.
var sortOptions = ["none", "ASC", "DESC"];
var sortIndex = {username : 0, gridSize : 0, gameDuration : 0, mistakes : 0, score : 0 };
var currentSort = {username : "none", gridSize : "none", gameDuration : "none", mistakes : "none", score : "none"};

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
        for(let key in data[i])
        {
            if(key == "gameID")
                continue;

            let newTD = document.createElement("td");
            newTD.innerHTML = data[i][key];
            newRow.append(newTD);
        }
        document.getElementById("dynamicData").append(newRow);
        // console.log(data[i]["username"]);
    }

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

    let sortSet = false;

    let json;

    // Check current sorting to see if any sorting is set
    for(key in sortIndex)
    {
        if(currentSort[key] != "none")
            sortSet = true;
    }

    if(sortSet)
    {
        // formData.append("function", "sort");
        json = {function : "sort", sortData : currentSort};
        // for(let key in currentSort)
            // Iterate over our sorting options and add them to the form.
            // formData.append(key, sortOptions[currentSort[key]]);
    }
    else
        json = {function : "populate"};
        // formData.append("function", "populate");

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