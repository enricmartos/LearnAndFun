//This scripts aims to manage all the CRUD (Create, Remove, Update, Delete)
//procedures and also performs the routing part of the application
//Importing dependencies
var express = require("express");
var Lesson = require("./models/lesson");
var User = require("./models/user");
var router = express.Router();
var fs = require("fs");
var ObjectID = require('mongodb').ObjectID;

//Objects and functions definition
function QuestionAnswer (question, answer) {
    this.question = question;
    this.answer = answer;
}

function Score (score, lesson_id) {
    this.score = score;
    this.lesson_id = lesson_id;
}

function Ranking (username, score) {
    this.username = username;
    this.score = score;
}

function getCorrectAnswer(rawCorrectAnswer, ansA, ansB, ansC) {
  var finalCorrectAnswer;
  if (rawCorrectAnswer == "a") {
    finalCorrectAnswer = ansA;
  }
  else if (rawCorrectAnswer == "b") {
    finalCorrectAnswer = ansB;
  }
  else {
    finalCorrectAnswer = ansC;
  }
  return finalCorrectAnswer;
}

var lesson_finder_middleware = require("./middlewares/find_lesson");

//User Profile Page (Get and Put Methods)
router.route("/profile")
    .get(function(req, res) {
      res.render("app/profile", {user: res.locals.user});
    })
    .put(function(req, res){
      var objectId_user = new ObjectID();
      var extension = req.body.archivo.name.split(".").pop();

      User.updateOne({_id: res.locals.user._id}, {$set: {username: req.body.username, email:
        req.body.email, title_id: objectId_user, extension: extension}}, function(err) {
          if(!err) {
            fs.rename(req.body.archivo.path, "public/imagenes/"+ objectId_user+"."+ extension);
            Lesson.find({})
                  .populate("creator")
                  .exec(function(err, lessons){
                    if (err) console.log(err);
                    res.render("app/home", {lessons: lessons});
                  })
          }
          else {
            console.log(err);
            res.render("app/profile");
          }
      })
    })

/// related to /app
router.get("/", function(req, res){
  Lesson.find({})
        .populate("creator")
        .exec(function(err, lessons){
          if (err) console.log(err);
          res.render("app/home", {lessons: lessons});
        })
});

//Show forms to upload and edit lessons
router.get("/lessons/new", function(req, res) {
  res.render("app/lessons/new");
});

//All the routes that begin with lessons/:id and * will implement
//the find_lesson.js middleware to find the lesson in the DB
router.all("/lessons/:id*", lesson_finder_middleware);

//Edit Page
router.get("/lessons/:id/edit", function(req, res) {
  res.render("app/lessons/edit");
});

//Methods for single lesson
//All the chars before : are dynamic
router.route("/lessons/:id")
  .get(function(req, res){
    //Find image in DB
    console.log("res locals lesson id: " + res.locals.lesson._id);
    User.find({"scores.lesson_id": res.locals.lesson._id}, function(err, users) {
      if (!err) {
          console.log("users lesson: " + typeof(users));
          var usersLesson = [];
          for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < users[i].scores.length; j++) {
              if (users[i].scores[j].lesson_id.equals(res.locals.lesson._id)) {
                var newUser = new Ranking(users[i].username, users[i].scores[j].score);
                usersLesson.push(newUser);
              }
            }
          }
          //Sort ranking array descendently
          usersLesson.sort(function(x, y){
            return y.score - x.score});
          res.render("app/lessons/show", {users: usersLesson});
      }
      else {
        console.log(err);
      }
    });
  })
  .post(function(req, res){
      //Test part
      //res.json(req.body);
      var num_answers = res.locals.lesson.test.length;
      var positivePoint = 10/num_answers;
      console.log("positivePoint: " + positivePoint);
      var penalty = 0.33;
      var sum = 0;
      var answer1 = req.body.answer1;
      console.log("answer1:" + answer1);
      if (res.locals.lesson.test[0].answer == answer1) {
        console.log("Correct answer!");
        sum += positivePoint;
      } else if (answer1 != "" &&
          res.locals.lesson.test[0].answer != answer1) {
            //Wrong and not empty asnwer.
            sum -= penalty;
            console.log("Wrong answer!: " + typeof(answer1));
      }

      console.log("req body answer 2a:" + req.body.answer2a);
      console.log("req body answer 2b:" + req.body.answer2b);
      console.log("req body answer 2c:" + req.body.answer2c);
      //Parse and interpret the input from the radio buttons
      var userAnswer2;
      if (req.body.answer2a == "on") {
        userAnswer2 = res.locals.lesson.test[1].answer.answer2a;
      }
      else if (req.body.answer2b == "on") {
        userAnswer2 = res.locals.lesson.test[1].answer.answer2b;
      }
      else if (req.body.answer2c == "on") {
        userAnswer2 = res.locals.lesson.test[1].answer.answer2c;
      }

      console.log("userAnswer2: " + userAnswer2);
      var correctAnswer2 = getCorrectAnswer(res.locals.lesson.test[1].answer.correctAnswer2,
      res.locals.lesson.test[1].answer.answer2a, res.locals.lesson.test[1].answer.answer2b,
      res.locals.lesson.test[1].answer.answer2c);
      if (correctAnswer2 == userAnswer2) {
        console.log("Correct answer!");
        sum += positivePoint;
      } else if (userAnswer2 != undefined &&
          res.locals.lesson.test[1].answer != userAnswer2) {
            //Wrong and not empty asnwer.
            sum -= penalty;
            console.log("Wrong answer!");
      }

      var answer3 = req.body.answer3;
      console.log("answer3:" + answer3);
      if (res.locals.lesson.test[2].answer == answer3) {
        console.log("Correct answer!");
        sum += positivePoint;
      } else if (answer3 != "" &&
          res.locals.lesson.test[2].answer != answer3) {
            //Wrong and not empty asnwer.
            sum -= penalty;
            console.log("Wrong answer!");
      }
      //Parse and interpret the input from the radio buttons
      var userAnswer4;
      if (req.body.answer4a == "on") {
        userAnswer4 = res.locals.lesson.test[3].answer.answer4a;
      }
      else if (req.body.answer4b == "on") {
        userAnswer4 = res.locals.lesson.test[3].answer.answer4b;
      }
      else if (req.body.answer4c == "on") {
        userAnswer4 = res.locals.lesson.test[3].answer.answer4c;
      }

      console.log("user answer4:" + userAnswer4);
      var correctAnswer4 = getCorrectAnswer(res.locals.lesson.test[3].answer.correctAnswer4,
      res.locals.lesson.test[3].answer.answer4a, res.locals.lesson.test[3].answer.answer4b,
      res.locals.lesson.test[3].answer.answer4c);
      if (correctAnswer4 == userAnswer4) {
        console.log("Correct answer!");
        sum += positivePoint;
      } else if (userAnswer4 != undefined &&
          res.locals.lesson.test[3].answer != userAnswer4) {
            //Wrong and not empty asnwer.
            sum -= penalty;
            console.log("Wrong answer!");
      }

      //var mark = (sum / num_answers) * 10;
      var mark = sum;
      var score = new Score(mark.toFixed(2), res.locals.lesson._id);

      var lessonScoreExists = 0;
      var scores = res.locals.user.scores;
      var resLocalsLessonId = res.locals.lesson._id;
      for (var i = 0; i < scores.length; i++) {
        var scoresLessonId = scores[i].lesson_id;
        console.log("scores[i].lesson_id: " + parseInt(scoresLessonId));
        console.log("res locals lesson_id: " + parseInt(resLocalsLessonId));
        if ( scoresLessonId.equals(resLocalsLessonId)) {
          console.log("Lesson score exists!");
          lessonScoreExists = 1;
          scores[i].score = mark;
        }
      }
      if (!lessonScoreExists) {
        console.log("Lesson score doesn't exist!");
        scores.push(score);
      }
      //console.log("res locals scores: " + scores);
        res.locals.user.update({$set: {scores: scores}}, function(err) {
          if (!err){
            //console.log("score field updated: " + res.locals.user.scores[0].score);
            res.redirect("/app/lessons/" + res.locals.lesson._id)
          }
          else {
            console.log(err);
          }
        })
  })
  //Update image
  .put(function(req, res){

    var question1 = req.body.question1;
    var answer1 = req.body.answer1;

    var question2 = req.body.question2;
    var answer2a = req.body.answer2a;
    var answer2b = req.body.answer2b;
    var answer2c = req.body.answer2c;

    var correctAnswer2 = req.body.correctAnswer2;

    var answer2 = {
      answer2a: answer2a,
      answer2b:answer2b,
      answer2c: answer2c,
      correctAnswer2: correctAnswer2
    }

    var question3 = req.body.question3;
    var answer3 = req.body.answer3;

    var question4 = req.body.question4;
    var answer4a = req.body.answer4a;
    var answer4b = req.body.answer4b;
    var answer4c = req.body.answer4c;

    var correctAnswer4 = req.body.correctAnswer4;

    var answer4 = {
      answer4a: answer4a,
      answer4b:answer4b,
      answer4c: answer4c,
      correctAnswer4: correctAnswer4
    }

    var test = [];
    var questionAnswer = new QuestionAnswer(question1, answer1);
    test.push(questionAnswer);
    var questionAnswer = new QuestionAnswer(question2, answer2);
    test.push(questionAnswer);
    var questionAnswer = new QuestionAnswer(question3, answer3);
    test.push(questionAnswer);
    var questionAnswer = new QuestionAnswer(question4, answer4);
    test.push(questionAnswer);

      var objectId_lesson;
      var extension;
      console.log("req body archivo: " + typeof(req.body.archivo.name));
      if (req.body.archivo.name == "") {
        objectId_lesson = res.locals.lesson.title_id;
        extension = res.locals.lesson.extension;
        //console.log("title_id: " + objectId_lesson);
        //console.log("extension: " + extension);
      } else {
        objectId_lesson = new ObjectID();
        extension = req.body.archivo.name.split(".").pop();
      }

      var lesson_data = {
        title: req.body.title,
        title_id: objectId_lesson,
        text: req.body.text,
        img_title: req.body.img_title,
        extension: extension,
        //Sabemos el user gracias al session middleware
        creator: res.locals.user._id,
        test: test,
        topic: req.body.topic
      }

      var lesson = new Lesson(lesson_data);

      console.log("title_id: " + lesson.title_id);
      console.log("extension: " + lesson.extension);

      Lesson.updateOne({_id: res.locals.lesson._id}, {$set: lesson_data}, function(err) {
          if(!err) {
            fs.rename(req.body.archivo.path, "public/imagenes/"+lesson.title_id+"."+ extension);
            res.redirect("/app/lessons/" + res.locals.lesson._id);
            //res.render("app/lessons");
          }
          else {
            console.log(lesson);
            //res.render(err);
            res.render("app/lessons/" + req.params.id + "/edit");
          }
      })

  })
  //Delete lessons
  .delete(function(req, res) {
    Lesson.findOneAndRemove({_id: req.params.id}, function(err) {
      if(!err) {
        res.redirect("/app/lessons");
      }
      else {
        console.log(err);
        res.redirect("app/lessons" + req.params.id);
      }
    })
  });


//Methods for Lesson collection
  router.route("/lessons")
    .get(function(req, res){
      Lesson.find({creator: res.locals.user._id}, function(err, lessons) {
        if(err) {
          res.redirect("/app");
          return;
        }
        res.render("app/lessons/index", {lessons: lessons});
      });
    })
    .post(function(req, res){

      var question1 = req.body.question1;
      var answer1 = req.body.answer1;

      var question2 = req.body.question2;
      var answer2a = req.body.answer2a;
      var answer2b = req.body.answer2b;
      var answer2c = req.body.answer2c;

      var correctAnswer2 = req.body.correctAnswer2;

      var answer2 = {
        answer2a: answer2a,
        answer2b:answer2b,
        answer2c: answer2c,
        correctAnswer2: correctAnswer2
      }

      var question3 = req.body.question3;
      var answer3 = req.body.answer3;

      var question4 = req.body.question4;
      var answer4a = req.body.answer4a;
      var answer4b = req.body.answer4b;
      var answer4c = req.body.answer4c;


      var correctAnswer4 = req.body.correctAnswer4;

      var answer4 = {
        answer4a: answer4a,
        answer4b:answer4b,
        answer4c: answer4c,
        correctAnswer4: correctAnswer4
      }

      var test = [];
      var questionAnswer = new QuestionAnswer(question1, answer1);
      test.push(questionAnswer);
      var questionAnswer = new QuestionAnswer(question2, answer2);
      test.push(questionAnswer);
      var questionAnswer = new QuestionAnswer(question3, answer3);
      test.push(questionAnswer);
      var questionAnswer = new QuestionAnswer(question4, answer4);
      test.push(questionAnswer);

      var extension = req.body.archivo.name.split(".").pop();

      var objectId_lesson = new ObjectID();

      var lesson_data = {
        title: req.body.title,
        title_id: objectId_lesson,
        text: req.body.text,
        img_title: req.body.img_title,
        extension: extension,
        //We know the user thanks to the middleware
        creator: res.locals.user._id,
        test: test,
        topic: req.body.topic
      }

      var lesson = new Lesson(lesson_data);

      lesson.save(function(err) {
          if(!err) {
            fs.rename(req.body.archivo.path, "public/imagenes/"+lesson.title_id+"."+ extension);
            res.redirect("/app/lessons/" + lesson._id)
          }
          else {
            console.log(lesson);
            res.render(err);
          }
      })
    });

module.exports = router;
