FROM node:latest

ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY package.json $APP_HOME

RUN npm install
COPY . $APP_HOME

RUN pwd
RUN ls -lah
CMD [ "node", "app" ]
