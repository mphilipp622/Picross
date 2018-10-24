var uploadImageRequest;
var saveToDBRequest;

function CreateNewUser()
{
    let firstName = document.getElementById("FirstName").value;
    let lastName = document.getElementById("LastName").value;
    let age = parseInt(document.getElementById("Age").value);

    let genderSelector = document.getElementById("Gender");
    let gender = genderSelector.options[genderSelector.selectedIndex].text;

    let location = document.getElementById("Location");

    var formData = new FormData();

    formData.append("userID", GetGUID());
    formData.append("firstName", firstName);
    formData.append("lastName", lastName); // number 123456 is immediately converted to a string "123456"
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("location", location);

    // HTML file input, chosen by user
    formData.append("avatar", document.getElementById("Avatar").files[0]);

    SaveToDB(formData);
    UploadAvatarToServer(formData);

}

function SaveToDB(formData)
{
    return;
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
        complete: function(data) {}
      });
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