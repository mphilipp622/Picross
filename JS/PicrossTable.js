/*
This file largely handles creation and management of HTML elements using JS.
This file makes many references to the Grid and Tile class as well as global variables found in MainPage.js
*/

// This function creates a new picross table in HTML based on Grid and Tile data.
function CreateTable()
{
    var newSection = document.createElement("section");
    newSection.id = "PicrossTableSection";

    var newDiv = document.createElement("div")
    newDiv.className = "PicrossGrid";

    // Check if table already exists. If so, kill it.
    if(document.body.getElementsByClassName("PicrossTable")[0] != null)
        document.body.getElementsByClassName("PicrossTable")[0].remove();

    var newTable = document.createElement("table");
    newTable.className = "PicrossTable";

    let newTBody = document.createElement("tbody");

    let rowHeader = document.createElement("tr");

    rowHeader.innerHTML += '<td class="emptyCell"></td>'; // create blank square

    // Initialize first table row, which contains the numbers across the top of the board
    for(let i = 0; i < grid.GetWidth(); i++)
    {
        let newData = document.createElement("td");
        newData.className = "NumRowTop";
        newData.style = "border-color: black;";

        let columnInfo = grid.GetColumnGroups(i);

        if(columnInfo.length == 0)
        {
            // put a 0 on the column header if we have no consecutive values
            let newText = document.createTextNode("0");
            newData.appendChild(newText);
        }
        else
        {
            for(value in columnInfo)
                newData.innerHTML += columnInfo[value] + "<br>";
        }
        
        rowHeader.appendChild(newData);

    }

    newTBody.appendChild(rowHeader);

    // initialize rest of the table. Initialize from top to bottom.
    for(let i = 0; i < grid.GetHeight(); i++) 
    {
        let newRow = document.createElement("tr");
        let newRowHeader = document.createElement("td");
        newRowHeader.className = "NumRowLeft";

        let rowInfo = grid.GetRowGroups(i); 

        if(rowInfo.length == 0)
        {
            // put a 0 on the column header if we have no consecutive values
            let newText = document.createTextNode("0");
            newRowHeader.appendChild(newText);
        }
        else
        {
            for(value in rowInfo)
                newRowHeader.innerHTML += rowInfo[value] + "\t";
        }
        
        newRow.appendChild(newRowHeader);

        // Initialize rest of the grid with squares. This will populate left to right in each row.
        for(let j = 0; j < grid.GetWidth(); j++)
        {
            let newCell = document.createElement("td");
            newCell.className = "notRevealed";

            // let cellButton = document.createElement("button");
            // cellButton.className = "tileButton";
            // // cellButton.onclick = grid.GetTile(j, i).ExecuteOnClick();

            // newCell.appendChild(cellButton);
            newRow.appendChild(newCell);
        }

        newTBody.appendChild(newRow);
    }

    newTable.appendChild(newTBody);
    newDiv.appendChild(newTable);
    newSection.appendChild(newDiv);
    document.body.appendChild(newSection);
}

// This function establishes the onclick behavior for each tile on the grid that is selectable.
function CreateTableOnClickFunctionality()
{
    let table = document.getElementsByClassName("PicrossTable")[0];

    if (table != null) 
    {
        // start indices at 1 because we don't need the user clicking on the table headers
        for (let i = 1; i < table.rows.length; i++) 
        {
            for (let j = 1; j < table.rows[i].cells.length; j++)
            {
                table.rows[i].cells[j].onclick = function() 
                {
                    UserClickedTile(i, j);
                }
            }
        }
    }
}

// Executes behavior for when user clicks on a tile.
function UserClickedTile(row, column)
{
    if(grid.GetTile(row - 1, column - 1).GetIsRevealed())
        return; // don't do anything if the tile is already revealed.

    let table = document.getElementsByClassName("PicrossTable")[0];
    let targetCell = table.childNodes[0].childNodes[row].childNodes[column]; // grab the specific td element we are looking for.

    // change class name of the td element so we can update the look of the cell after it's revealed
    // Have to subtract both variables by 1 since the tiles don't account for the header cells but the table element does.
    if(grid.GetTile(row - 1, column - 1).GetIsMistake())
    {
        targetCell.style = ""; // reset style to nothing so CSS takes over coloring
        targetCell.className = "mistakeTile";
    }
    else
    {
        targetCell.style = "";
        targetCell.className = "notMistakeTile";
    }

    turns++; // Turns are determined by how many clicks a user has performed on non-revealed tiles.

    // set the tile's status to revealed and update remaining number of non-mistake tiles if applicable.
    grid.GetTile(row - 1, column - 1).SetTileRevealed(); 

    score = (Math.max(grid.GetTotalNumberOfMistakeTiles() - mistakes, 0) / grid.GetTotalNumberOfMistakeTiles()) * 100;

    let hasWon = grid.HasPlayerWon(); // check to see if player's won

    UpdateGameStats();

    if(hasWon && (isArcadeMode || isTimeAttackMode))
        LoadNextLevel();
    else if(hasWon)
    {
        ChangeToVictoryColors();
        StopTimer();
        PrintVictoryMessage();
        SaveGame();
    }
}

function RemoveGridOptions()
{
    let gridOptionForm = document.getElementsByClassName("GridForm")[0];
    let gridDimensionForm = document.getElementsByClassName("GridDimensions")[0];
    let gridImageForm = document.getElementsByClassName("GridImageForm")[0];

    gridOptionForm.removeChild(gridDimensionForm);
    gridOptionForm.removeChild(gridImageForm);

}

function PrintVictoryMessage()
{
    alert("You Win!\nFinal Time: " + GetConvertedTime() + "\nScore: " + score.toString());
}

function ChangeToVictoryColors()
{
    // Update all the non-mistake nodes to be black
    // Update all non-revealed nodes to be mistake nodes
    
    let victoryTiles = document.getElementsByClassName("notMistakeTile");

    while(victoryTiles.length > 0)
        // Updating the class names has to be done this way because getElementsByClassName
        // returns a live list. So updating a value in the list will remove it within the loop.
        // This loop ensures we're always updating the next element in the list as it shrinks.
        victoryTiles[0].className = "victoryTile";

    let remainingMistakeTiles = document.getElementsByClassName("notRevealed");

    while(remainingMistakeTiles.length > 0)
    {
        remainingMistakeTiles[0].style = "";
        remainingMistakeTiles[0].className = "mistakeTile";
    }
}

// Modifies <td> border and background color properties based on user selection of tile and border color
function UpdateGridColor()
{
    // Note that we make use of inline styles for the TD cells so that they override the CSS styles temporarily.
    let tableDatas = document.getElementsByTagName("td");
    
    for(let i = 0; i < tableDatas.length; i++)
        tableDatas[i].style = "border-color: " + document.getElementById("BorderColor").value + ";";
    
    let hiddenCells = document.getElementsByClassName("notRevealed");

    for(let i = 0; i < hiddenCells.length; i++)
    {
        hiddenCells[i].style = "border-color: " + document.getElementById("BorderColor").value + ";" + "background-color: " + document.getElementById("TileColor").value + ";";
    }
}

function ShowHintTile()
{
    let table = document.getElementsByClassName("PicrossTable")[0];
    let hintTile = grid.GetHintTile();

    // Use + 1 so we ignore row and column headers
    table.rows[hintTile.GetXPosition() + 1].cells[hintTile.GetYPosition() + 1].style = "background-color: red;";
}