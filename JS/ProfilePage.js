console.log(currentUser);

function GetProfileInfo()
{
    $.ajax({
        url : '../PHP/GetUserInfo.php', // your php file
        type : 'GET', // type of the HTTP request
        data : {username : currentUser},
        success : function(data){
           var obj = data;
           console.log(obj);
        }
     });
}

GetProfileInfo();