// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      for (var i = data.note.length; i >= 0; i--) {
        // An input to enter a new title
        $("#notes").append("<input class='titleinput' id='title" + i + "' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea class='bodyinput' id='body" + i + "'name='body'></textarea>");
        if(i<data.note.length){
          $("#notes").append("<button data-id='" + data.note[i]._id + "' data-index='" + i + "' class='deletenote'>Delete Note</button><br><br>");
        }else{
          // A button to submit a new note, with the id of the article saved to it
          $("#notes").append("<button data-id='" + data._id + "' data-index='" + i + "'id='savenote'>Save Note</button><br><br>");
        }
        
        console.log(data.note[i]);
        // If there's a note in the article
        if (data.note[i]) {
          
          // Place the title of the note in the title input
          $("#title" + i).val(data.note[i].title);
          // Place the body of the note in the body textarea
          $("#body" + i).val(data.note[i].body);
        }
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");
  var thisIndex = $(this).attr("data-index");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#title" + thisIndex).val(),
      // Value taken from note textarea
      body: $("#body" + thisIndex).val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

// When you click the deletenote button
$(document).on("click", ".deletenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

$(document).on("click", "#scrape", function(){
  $.ajax({
    method: "GET",
    url: "/scrape"
  }).then(function(){
    location.reload();
  });
});
