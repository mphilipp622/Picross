class Tile
{
    constructor(newXPosition, newYPosition)
    {
        this.xPos = newXPosition;
        this.yPos = newYPosition;
        
        this.isMistake = false;
        this.isFound = false;
    } 

    GetXPosition()
    {
        return this.xPos;
    }

    GetYPosition()
    {
        return this.yPos;
    }

    // Specifies if this tile is a mistake tile or not
    SetIsMistake(setMistake)
    {
        this.isMistake = setMistake;
    }

    // Returns if this tile is a mistake tile or not.
    GetIsMistake()
    {
        return this.isMistake;
    }

    // Specifies that this tile has been revealed by player
    SetTileRevealed()
    {
        this.isRevealed = true;

        if(!this.isMistake)
            grid.FoundTile(this);
        else
            mistakes++;
    }

    // Returns true if player has revealed this tile.
    GetIsRevealed()
    {
        return this.isRevealed;
    }

    ExecuteOnClick()
    {
        console.log("clicked");
    }
}

class GridDB
{
    constructor(newSize, newTiles)
    {
        // width and height are private.
        this.width = newSize;
        this.height = newSize;
        this.tiles = [];
        this.hintTiles = [];
        this.totalMistakeTiles = 0;

        // will track how many non-mistake tiles are left to find
        this.tilesLeft = newSize * newSize; 
    
        // Initialize 2D array
        for(let i = 0; i < newSize; i++)
            this.tiles[i] = new Array(newSize);

        // console.log(newTiles);
        for(let i = 0; i < newTiles.length; i++)
        {
            // let newTile = JSON.parse(newTiles[i]);
            console.log(newTiles[i]);
            let newRow = newTile["row"];
            let newColumn = newTile["column"];
            // console.log(newRow);

            this.tiles[newRow][newColumn] = new Tile(newRow, newColumn);

            if(newTile["isMistake"])
            {
                this.tiles[newRow][newColumn],SetIsMistake(true);
                this.totalMistakeTiles++;
                this.tilesLeft--; // subtract from the pool of non-mistake tiles.
            }
            else
                this.hintTiles.push(this.tiles[newRow][newColumn]);
        }
    }

    GetHeight()
    {
        return this.height;
    }

    GetWidth()
    {
        return this.width;
    }

    // Returns a specific tile at coordinates (row, column)
    GetTile(row, column)
    {
        return this.tiles[row][column];
    }

    // Returns a randomly selected non-mistake tile.
    GetHintTile()
    {
        let index = parseInt(Math.random() * (this.hintTiles.length - 1)); // random range of 0 to length of hint tiles
        return this.hintTiles[index];
    }

    // Returns an array of the clustered groups of non-mistake nodes in a row
    GetRowGroups(rowNumber)
    {
        let returnArray = new Array();

        let consecutiveCount = 0;

        for(let i = 0; i < this.width; i++)
        {
            if(this.tiles[rowNumber][i].GetIsMistake() && consecutiveCount > 0)
            {
                returnArray.push(consecutiveCount); // put the consecutive count of tiles into the array.
                consecutiveCount = 0; // reset consecutive count
            }
            else if(!this.tiles[rowNumber][i].GetIsMistake())
                consecutiveCount++; // if the tile is NOT a mistake, increase the consecutive count.
        }

        if(consecutiveCount > 0)
            returnArray.push(consecutiveCount); // handle case where the whole row is consecutive.

        return returnArray;
    }

    // Returns an array of clustered groups of non-mistake nodes in a column
    GetColumnGroups(columnNumber)
    {
        let returnArray = new Array();

        let consecutiveCount = 0;

        for(let i = 0; i < this.height; i++)
        {
            if(this.tiles[i][columnNumber].GetIsMistake() && consecutiveCount > 0)
            {
                returnArray.push(consecutiveCount); // put the consecutive count of tiles into the array.
                consecutiveCount = 0; // reset consecutive count
            }
            else if(!this.tiles[i][columnNumber].GetIsMistake())
                consecutiveCount++; // if the tile is NOT a mistake, increase the consecutive count.
        }

        if(consecutiveCount > 0)
            returnArray.push(consecutiveCount); // handle case where the whole column is consecutive.

        return returnArray;
    }

    // Decrements the number of non-mistake tiles left to find in the game.
    FoundTile(tileThatWasFound)
    {
        this.tilesLeft--;

        // Remove the found tile from the hint tiles array.
        let index = this.hintTiles.indexOf(tileThatWasFound);

        if (index > -1) 
            this.hintTiles.splice(index, 1);
    }

    GetRemainingTiles()
    {
        return this.tilesLeft;
    }

    GetTotalNumberOfMistakeTiles()
    {
        return this.totalMistakeTiles;
    }

    HasPlayerWon()
    {
        if(this.tilesLeft <= 0)
            return true;
        
        return false;
    }
}

class Grid
{
    constructor(newWidth, newHeight)
    {
        // width and height are private.
        this.width = newWidth;
        this.height = newHeight;
        this.tiles = [];
        this.hintTiles = [];
        this.totalMistakeTiles = 0;

        // will track how many non-mistake tiles are left to find
        this.tilesLeft = newWidth * newHeight; 
    
        // Initialize 2D array
        for(let i = 0; i < newHeight; i++)
            this.tiles[i] = new Array(newWidth);

        for(let row = 0; row < this.height; row++)
        {
            for(let column = 0; column < this.width; column++)
            {
                this.tiles[row][column] = new Tile(row, column);

                if(Math.round(Math.random()) == 0)
                {
                    // basically a coin flip. If we get 0 from coin flip, we specify this tile as a mistake tile.
                    this.tiles[row][column].SetIsMistake(true); 
                    this.totalMistakeTiles++;
                    this.tilesLeft--; // subtract from the pool of non-mistake tiles.
                }
                else
                    this.hintTiles.push(this.tiles[row][column]); // add this tile as a hint
            }
        }
    }

    GetHeight()
    {
        return this.height;
    }

    GetWidth()
    {
        return this.width;
    }

    // Returns a specific tile at coordinates (row, column)
    GetTile(row, column)
    {
        return this.tiles[row][column];
    }

    // Returns a randomly selected non-mistake tile.
    GetHintTile()
    {
        let index = parseInt(Math.random() * (this.hintTiles.length - 1)); // random range of 0 to length of hint tiles
        return this.hintTiles[index];
    }

    // Returns an array of the clustered groups of non-mistake nodes in a row
    GetRowGroups(rowNumber)
    {
        let returnArray = new Array();

        let consecutiveCount = 0;

        for(let i = 0; i < this.width; i++)
        {
            if(this.tiles[rowNumber][i].GetIsMistake() && consecutiveCount > 0)
            {
                returnArray.push(consecutiveCount); // put the consecutive count of tiles into the array.
                consecutiveCount = 0; // reset consecutive count
            }
            else if(!this.tiles[rowNumber][i].GetIsMistake())
                consecutiveCount++; // if the tile is NOT a mistake, increase the consecutive count.
        }

        if(consecutiveCount > 0)
            returnArray.push(consecutiveCount); // handle case where the whole row is consecutive.

        return returnArray;
    }

    // Returns an array of clustered groups of non-mistake nodes in a column
    GetColumnGroups(columnNumber)
    {
        let returnArray = new Array();

        let consecutiveCount = 0;

        for(let i = 0; i < this.height; i++)
        {
            if(this.tiles[i][columnNumber].GetIsMistake() && consecutiveCount > 0)
            {
                returnArray.push(consecutiveCount); // put the consecutive count of tiles into the array.
                consecutiveCount = 0; // reset consecutive count
            }
            else if(!this.tiles[i][columnNumber].GetIsMistake())
                consecutiveCount++; // if the tile is NOT a mistake, increase the consecutive count.
        }

        if(consecutiveCount > 0)
            returnArray.push(consecutiveCount); // handle case where the whole column is consecutive.

        return returnArray;
    }

    // Decrements the number of non-mistake tiles left to find in the game.
    FoundTile(tileThatWasFound)
    {
        this.tilesLeft--;

        // Remove the found tile from the hint tiles array.
        let index = this.hintTiles.indexOf(tileThatWasFound);

        if (index > -1) 
            this.hintTiles.splice(index, 1);
    }

    GetRemainingTiles()
    {
        return this.tilesLeft;
    }

    GetTotalNumberOfMistakeTiles()
    {
        return this.totalMistakeTiles;
    }

    HasPlayerWon()
    {
        if(this.tilesLeft <= 0)
            return true;
        
        return false;
    }
}