# LearnAndFun

LearnAndFun is a web application where teachers can upload their lessons and students are able to learn from them. Lessons are structured in several subjects and students can solve the tests that teachers have previously designed. All the scores of a given lesson belong to a common ranking, so students can check their particular progress.
This video demo shows its basic funcionality. 

<a href="http://www.youtube.com/watch?feature=player_embedded&v=YWv26BDM3UM
" target="_blank"><img src="https://github.com/enricmartos/LearnAndFun/blob/master/public/imagenes/admin_img/learn_main.PNG" 
width="1080" height="720" border="10"/></a>

The project uses MVC as design pattern and its arquitecture is API Rest based. NodeJS and MongoDB configure the backend side, while Bootstrap is the main framework used on frontend side. So, the programming languages involved here are Javascript, CSS and HTML. 

**How to run the application**

- NodeJS and MongoDB must be already installed in your machine.
- Open a terminal and run the following command to install all node modules specified in "package.js" file:
```
npm install
```
- Run MongoDB from the terminal:
```
mongod
```
- Start the server from another terminal located in the directory of the current project:
```
node app
```
- Open your browser and test the application on *localhost:9001*
