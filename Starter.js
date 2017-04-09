const Spider                = require('./Spider');
const RedisHandler          = require('./db/RedisHandler');
const ExpressCustomServer   = require('./ExpressCustomServer') ;
const DataBaseHandler       = require("./db/DataBaseHandler");
const session               = require('express-session');



//Spider Creation 
    
    var spider              = new Spider();
    spider.addFunction('session',session);

    spider.on(spider.availableMessages.DBHANDLER_CONNECTION_FAILED,function (err){
        console.log("CONNECTION WITH DB FAILED",err);
         spider.allGreen = false;
    });

//Redis Store Creation and MongoDB
    spider.on(spider.availableMessages.REDIS_CLIENT_OK,function(){
        console.log("Redis Client and Store OK");
        redisHandler.createStore();
        if(!spider.getModule('dbHandler') || !spider.getModule('dbHandler') .isConnected()){
            var mongoDbHandler = new DataBaseHandler(spider);
            spider.addModule('dbHandler',mongoDbHandler);
            mongoDbHandler.connectDB();
        }
    });


    spider.on(spider.availableMessages.DBHANDLER_CONNECTION_OK,function(){
        console.log("Mongo DB OK")
        if(!spider.getModule('expressCustomServer')){ 
        var expressCustomServer = new ExpressCustomServer(spider);
        spider.addModule('expressCustomServer',expressCustomServer);
        expressCustomServer.createServer();
        spider.allGreen = true;
        }
    });




//Redis Server Creation 
    var redisHandler = new RedisHandler(spider,"192.168.178.22","chube2017");
    //var redisHandler = new RedisHandler(spider,"192.168.1.7","chube2017");
    spider.addModule('redisHandler',redisHandler);

//Redis Client Connection
    redisHandler.createClient();




