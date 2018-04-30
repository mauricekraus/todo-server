// server.js

const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const nconf = require('nconf');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;

nconf.argv().env().file('keys.json');
const user = nconf.get('mongoUser');
const pass = nconf.get('mongoPass');
const host = nconf.get('mongoHost');
const mongoPort = nconf.get('mongoPort');
const database = nconf.get('mongoDatabase');

let uri = `mongodb://${user}:${pass}@${host}:${mongoPort}/${database}`;

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", request.headers.origin);
    response.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    response.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS");
    response.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(bodyParser.urlencoded({ extended: true}));
MongoClient.connect(uri, (err, database) => {
    if (err) {
        return console.log(err);
    } 
    const db = database.db("todo-db");
    require('./app/routes')(app,db);
    app.listen(port, () => {
        console.log('We are live on ' + port);
    });
})

