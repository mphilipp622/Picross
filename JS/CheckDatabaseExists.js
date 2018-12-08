function CheckDB()
{
    $.ajax({
        url: "../PHP/CreateDatabase.php",
        type: "POST", 
        success: function(data) {
          console.log(data);
        },
        error: function(data) {
          console.log(data);
        }
      });
}