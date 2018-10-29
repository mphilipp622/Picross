var uploadImageRequest;
var saveToDBRequest;

function CreateNewUser()
{
    // Get all the elements from the html form
    let username = document.getElementById("Username").value;
    let password = document.getElementById("Password").value;
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;
    let age = parseInt(document.getElementById("Age").value);

    let genderSelector = document.getElementById("Gender");
    let gender = genderSelector.options[genderSelector.selectedIndex].text;

    let location = document.getElementById("Location").value;

    // Put the elements onto the form
    let formData = new FormData();

    formData.append("username", username);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName); // number 123456 is immediately converted to a string "123456"
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("location", location);

    // Get the image file that was uploaded
    formData.append("avatar", document.getElementById("Avatar").files[0]);

    // Send the form to DB
    SaveToDB(formData);

}

function SaveToDB(formData)
{
    $.ajax({
        url: "../PHP/SaveUserToDB.php",
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
            if(data.responseText == "UsernameExists")
              alert("Username already exists");
            else
              // Send form to server to upload image
                UploadAvatarToServer(formData);
        }
      });
}

function UploadAvatarToServer(formData)
{
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
          
          Login(formData);
          // window.location.href = "../HTML/Main.html";
        }
      });
}

function UpdateActiveUser(formData)
{
  $.ajax({
    url: "../PHP/Login.php",
    type: "POST",
    data: {username : formData.get("username"),
          password : formData.get("password")}, 
    contentType: false,
    cache: false,
    processData: false,
    complete: function(data) {
      window.location.href = "../HTML/Main.html";
    }
  });
}