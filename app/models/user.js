var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//MongoDB connection
//Local database
//mongoose.connect("mongodb://localhost/fotos");
//Server database



var password_validation = {
  validator: function(p) {
    return this.password_confirmation == p;
  },
  message: "Las contraseñas no son iguales"
}

//Define the required fields on the schema through a JSON
var user_schema = new Schema({
  username: {type: String, required: true, maxlength:[50, "Username too long"]},
  password: {type:String, minlength:[4, "Password too short"], validate: password_validation},
  email: {type: String, required: true},
  role: Boolean, //0=False=Student / True=1=Teacher
  scores: {type: Array},
  title_id: {type: Schema.Types.ObjectId}, //image title
  extension: {type: String, required: true} //image extension (avatar)
});

user_schema.virtual("password_confirmation").get(function(){
  return this.p_c;
}).set(function(password) {
  this.p_c = password;
})
//Model creation
var User = mongoose.model("User", user_schema);

module.exports = User;
