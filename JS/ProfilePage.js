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
    document.getElementById("avatar").src = "../Avatars/" + data["username"] + ".jpg";
}

function UpdateImage()
{
    // Put the elements onto the form
    let formData = new FormData();

    // Get username from profile page <span> tag
    formData.append("username", document.getElementById("username").innerHTML);

    // Get the image file that was uploaded
    console.log(document.getElementById("Avatar").files[0]);
    formData.append("avatar", document.getElementById("Avatar").files[0]);

    $.ajax({
        url: "../PHP/UploadImage.php",
        type: "POST",
        data: formData, 
        contentType: false,
        cache: false,
        processData: false,
        success: function(data) {
          console.log(data);
        },
        error: function(data) {
          console.log("Error");
        },
        complete: function(data) {
          // After file uploads, update the active user and go to main page.
          window.location.reload();
          // window.location.href = "../HTML/Main.html";
        }
      });
}