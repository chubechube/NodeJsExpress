const express           = require('express');
const RouteRepository   = require('./routes/RouteRepository');
const path              = require('path');
const session           = require('express-session');
const redis             = require('redis');
const redisStore        = require('connect-redis')(session);
const bodyParser		= require('body-parser');
const DataBaseHandler   = require("./db/DataBaseHandler");
const MessageDispatcher = require("./messageDispatcher");
const app               = express();

//Redis Client Creation

    var client = redis.createClient({ host: "192.168.1.7", password: "chube2017" });
    client.on('error', function (err) {
    console.log('error event - ' + client.host + ':' + client.port + ' - ' + err);});
    client.on('connect',function(){console.log("Redis Server Connected")})
/*var client = redis.createClient({ host: "192.168.0.115", password: "chube2017" });*/




//connection to the MongoDB database and initizialition of the the messageDispatcher
var messageDispatcher = new MessageDispatcher();
var dbconnection = new DataBaseHandler(messageDispatcher);

messageDispatcher.on("Connected", function () { console.log("CONNESSIONE EVENTO") 

//setting of the express options 
    //views and render
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

//setup redis dbconnection
var myRedisStore = new redisStore({ host: '192.168.1.2', port: 6379, client: client, ttl: 260 });
    //sessions and redis connection
app.use(session({
    secret: 'secret cat in the hot hat',
    // create new redis store.
    store: myRedisStore ,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 6000000 , secure: false }
}));
    //body parsing 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

  
    //Router handler cration
var routeRepository = new RouteRepository(express, app, dbconnection);
var router          = routeRepository.router;

    //routing
app.use(router);



//starting the server
app.listen(3030);
console.log("Server is running");
module.exports = app; 

});

dbconnection.connectDB();