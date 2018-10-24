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
    var formData = new FormData();

    formData.append("userID", GetGUID());
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

    // Send form to server to upload image
    UploadAvatarToServer(formData);

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
        complete: function(data) {}
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
          // After file uploads, update the active user and go to main page.
          UpdateActiveUser(formData);
          window.location.href = lastPageVisited;
        }
      });
}

function UpdateActiveUser(formData)
{
  currentUserName = formData.get("username");
  currentFirstName = formData.get("firstName");
  currentLastName = formData.get("lastName");
  currentGender = formData.get("gender");
  currentLocation = formData.get("location");
  currentAge = formData.get("age");
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