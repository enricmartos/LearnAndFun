var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//Define the required fields on the schema through a JSON
var lesson_schema = new Schema({
  title:{type:String, required:true},
  title_id: {type: Schema.Types.ObjectId},
  text: {type: String, required: true},
  img_title: {type: String, required: true},
  extension: {type: String, required: true},
  //Equivalent to a foreign key
  creator: {type: Schema.Types.ObjectId, ref: "User"},
  test: {type: Array},
  topic: String
});

//Create the lesson model
var Lesson = mongoose.model("Lesson", lesson_schema);

//module.exports = Lesson;
module.exports = Lesson;
