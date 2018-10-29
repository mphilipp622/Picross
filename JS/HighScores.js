
var sortOptions = ["none", "ASC", "DESC"];

// Current sort works like a hashtable. The value is the index this column is at in the sortOptions array.
var currentSort = {gameDuration : "none",
                   score : "none" };

var sortIndex = {gameDuration : 0,
                 score : 0};

function PopulateTable(tableData)
{
    if(tableData == undefined)
        return;

    // first, clear out any previous data
    ClearTable();

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
    let formData = new FormData();

    let sortSet = false;

    // Check current sorting to see if any sorting is set
    for(key in currentSort)
    {
        if(currentSort[key] != "none")
            sortSet = true;
    }

    if(sortSet)
    {
        formData.append("function", "sort");
        formData.append("order", JSON.stringify(currentSort));
    }
    else
        formData.append("function", "populate");

    $.ajax({
        url : '../PHP/GetScores.php', // your php file
        type : 'POST', // type of the HTTP request
        data : formData,
        contentType: false,
        cache: false,
        processData: false,
        success : function(data)
        {
            console.log(data);
            if(data == "NoData")
            {
                alert("No data to show");
                return;
            }
            // console.log(data);
            PopulateTable(data);
        }
     });
}

function GetSortedData(columnName)
{
    // set the next sorting mode. Circles the array in this order: none, ASC, DESC    
    
    sortIndex[columnName] = (++sortIndex[columnName]) % sortOptions.length;
    currentSort[columnName] = sortOptions[sortIndex[columnName]];

    GetTableData();

}