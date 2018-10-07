var request;

function SaveLevelData()
{
    // Create 100 random levels
    for(let counter = 0; counter < 100; counter++)
    {
        let newGrid = new Grid(GetRandomNumber(2, 20), GetRandomNumber(2, 20));

        let newGUID = GetGUID();

        let data = {
            "levelID" : newGUID,
            "width" : newGrid.GetWidth(),
            "height": newGrid.GetHeight(),
            "tiles": [],
            "borderColor": hexToRGB(document.getElementById("BorderColor").value, 1.0),
            "tileColor": hexToRGB(document.getElementById("TileColor").value, 1.0)
        }

        for(i = 0; i < newGrid.GetWidth(); i++)
        {
            for( j = 0; j < newGrid.GetHeight(); j++)
            {
                let newString = '{ "row" : ' + j.toString() + ', "column" : ' + i.toString() + ', "isMistake" : ' + newGrid.GetTile(j, i).GetIsMistake() + ' }'
                data.tiles.push(newString);
            }
        }

        let jsonData = JSON.stringify(data);
        
        request= new XMLHttpRequest();
        request.onreadystatechange = callback;
        request.open("POST", "../PHP/SaveLevelToDatabase.php", true);
        request.setRequestHeader("Content-Type", "application/json");
        request.send(jsonData);
    }
}

function GetRandomNumber(min, max) 
{
    return Math.floor(Math.random() * (max - min + 1)) + min;
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

function callback ()
{
    if(request.readyState == 4)
        console.log(request.responseText);
}