function Login()
{
    let obj;

    $.ajax({
        url : '../PHP/GetUserInfo.php', // your php file
        type : 'GET', // type of the HTTP request
        data : {username : document.getElementById("username").value,
                password : document.getElementById("password").value},
        success : function(data){
           obj = data;
           console.log(obj);
        //    console.log(obj);
        },
        complete: function(data) {
            obj = JSON.parse(obj);
            // After file uploads, update the active user and go to main page.
            SetActiveData(obj[0]["username"], 
                          obj[0]["firstName"], 
                          obj[0]["lastName"], 
                          obj[0]["gender"], 
                          obj[0]["age"], 
                          obj[0]["location"]);
            window.location.href = "../HTML/Main.html";
        }
     });
}

console.log(lastPageVisited);