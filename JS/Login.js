function Login(form)
{
    let obj;
    let formData;

    // This allows other scripts to call the login function and pass a form if desired
    if(form == null)
    {
        formData = new FormData();
        formData.append("username", document.getElementById("username").value);
        formData.append("password", document.getElementById("password").value);
    }
    else
        formData = form;

    $.ajax({
        url : '../PHP/Login.php', // your php file
        type : 'POST', // type of the HTTP request
        data : formData,
        contentType: false,
        cache: false,
        processData: false,
        success : function(data)
        {
        //    console.log(data);
           
        //    console.log(obj);
        },
        complete: function(data)
        {
            if(data.responseText == "LoginFailed")
                alert("Username or Password is Incorrect");
            else
                window.location.href = "../HTML/Main.html";
        }
     });
}