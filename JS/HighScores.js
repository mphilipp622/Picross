
var sortOptions = ["none", "ASC", "DESC"];

// Current sort works like a hashtable. The value is the index this column is at in the sortOptions array.
var currentSort = {gameDuration : 0,
                   score : 0 };

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
        if(currentSort[key] != 0)
            sortSet = true;
    }

    if(sortSet)
    {
        formData.append("function", "sort");
        formData.append("sortData", currentSort);
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
    let sortingMode = (++currentSort[columnName]) % sortOptions.length; 
    
    GetTableData();

}

function SortTable(n) {
    
    let table = document.getElementById("mainTable");
    let switching = true;
    // Set the sorting direction to ascending:
    let dir = "asc";

    /* Make a loop that will continue until
    no switching has been done: */
    while (switching) {
      // Start by saying: no switching is done:
      switching = false;

      let rows = table.rows;

      /* Loop through all table rows (except the
      first, which contains table headers): */
      for (let i = 1; i < (rows.length - 1); i++) {
        // Start by saying there should be no switching:
        let shouldSwitch = false;

        /* Get the two elements you want to compare,
        one from current row and one from the next: */
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /* Check if the two rows should switch place,
        based on the direction, asc or desc: */
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /* If a switch has been marked, make the switch
        and mark that a switch has been done: */
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        // Each time a switch is done, increase this count by 1:
        switchcount ++; 
      } else {
        /* If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again. */
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  }