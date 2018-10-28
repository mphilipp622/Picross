function GetProfileInfo()
{
    $.ajax({
        url : '../PHP/GetUserInfo.php', // your php file
        type : 'GET', // type of the HTTP request
        success : function(data){
           WriteDataToProfile(data);
        //    console.log(obj);
        }
     });
}

function WriteDataToProfile(newData)
{
    data = JSON.parse(newData);
    console.log(data);
    document.getElementById("username").innerHTML += data["username"];
    document.getElementById("firstName").innerHTML += data["firstName"];
    document.getElementById("lastName").innerHTML += data["lastName"];
    document.getElementById("age").innerHTML += data["age"];
    document.getElementById("gender").innerHTML += data["gender"];
    document.getElementById("location").innerHTML += data["location"];
}