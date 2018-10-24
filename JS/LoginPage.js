function Login()
{
    $.ajax({
        url : '../PHP/GetUserInfo.php', // your php file
        type : 'GET', // type of the HTTP request
        data : {username : document.getElementById("username").value},
        success : function(data){
           var obj = data;
           console.log(obj);
        }
     });
}