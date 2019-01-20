# LearnAndFun

## Description

LearnAndFun is a web application where teachers can upload their lessons and students are able to learn from them. Lessons are structured in several subjects and students can solve the tests that teachers have previously designed. All the scores of a given lesson belong to a common ranking, so students can check their particular progress.
The video demo below shows its basic funcionality. 

<a href="http://www.youtube.com/watch?feature=player_embedded&v=YWv26BDM3UM
" target="_blank"><img src="https://github.com/enricmartos/LearnAndFun/blob/master/app/public/imagenes/admin_img/Thumbnail.png" 
width="600" height="350" border="10"/></a>

The project uses **MVC** as design pattern and its arquitecture is **API Rest** based. NodeJS and MongoDB configure the backend side, while Bootstrap is the main framework used on frontend side. So, the programming languages involved here are Javascript, CSS and HTML. 

## Stack

*Front-end*
- Jade
- Bootstrap

*Back-end*
- NodeJS
- Express (as a routing framework)

*Database*
- MongoDB

*Dependency management tool*
- NPM

*Containerization*
- Docker-compose

## Build setup

### With Docker

- Clone this repo to your local machine.
```
# Start docker-compose

$ docker-compose up
```

This command creates the two docker containers detailed below:

- _learn_and_fun_app_1_: Main container of the NodeJS application

- _learn_and_fun_mongo_1_: DB container

- Open your browser and test the application on *localhost:3000*


### Without Docker

- NodeJS and MongoDB must be already installed in your machine.
```
# run MongoDB
mongod

# install dependencies
npm install

# start server 
node app
```

- Open your browser and test the application on *localhost:3000*
