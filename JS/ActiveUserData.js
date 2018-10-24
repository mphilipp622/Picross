var currentUsername;
var currentFirstName;
var currentLastName;
var currentGender;
var currentAge;
var currentLocation;
var lastPageVisited;

function SetActiveData(username, firstName, lastName, gender, age, location)
{
    currentUsername = username;
    currentFirstName = firstName;
    currentLastName = lastName;
    currentAge = age;
    currentGender = gender;
    currentLocation = location;
}

function SetCurrentPage(newPage)
{
    lastPageVisited = newPage;
    console.log(lastPageVisited);
}