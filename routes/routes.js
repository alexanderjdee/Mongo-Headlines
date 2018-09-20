//Require all models
var db = require("../models");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app){
 // A GET route for scraping the ESPN website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.espn.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Grab top headlines
    $(".headlineStack__list li").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result, function(dbArticle) {
        // View the added result in the console
        console.log(dbArticle);
      });
    });

    //If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  // TODO: Finish the route so it grabs all of the articles
  db.Article.find({}).sort({dateAdded: -1}).then(function(result){
    res.json(result);
  }).catch(function(error){
    res.json(error);
  });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  db.Article.findOne({_id: req.params.id}).populate("note").then(function(result){
    res.json(result);
  }).catch(function(error){
    res.json(error);
  });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body).then(function(result){
    return db.Article.findByIdAndUpdate({_id: req.params.id}, {note: result._id}, {new: true});
  }).then(function(result){
    res.json(result);
  }).catch(function(error){
    res.json(error);
  });
});
};