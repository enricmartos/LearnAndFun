//Script to find a given lesson everytime it is required
//Import model
var Lesson = require("../models/lesson");

module.exports = function(req, res, next) {
  //We populate an the user object from the id defined on the creator field on
  //lesson object
  Lesson.findById(req.params.id)
    .populate("creator")
    .exec(function(err, lesson) {
      if(lesson != null) {
        //console.log("Encontre la lesson " + lesson.creator.email);
        res.locals.lesson = lesson;
        next();
      }
      else {
        res.redirect("/app");
      }
    })
}
