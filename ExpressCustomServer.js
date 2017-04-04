const express           = require('express');
const app               = express();
const path              = require('path');
const bodyParser		= require('body-parser');
const RouteRepository   = require('./routes/RouteRepository');


var assert              = require('assert');

class ExpressCustomServer {
    
    
    constructor(spider) {

            assert.equal(typeof(spider),"object","spider is not an object");
            
            this.spider         = spider;
            this.session        = this.spider.getFunction('session');
            this.redisHandler   = this.spider.getModule('redisHandler');    
            this.dbconnection   = this.spider.getModule('dbHandler');
            this.redisStore     = this.redisHandler.redisStore;
               
            
            
};

    createServer(){
           
                //setting of the express options 
                    //views and render
                var self = this;
                app.set('views', path.join(__dirname, 'views'));
                app.use(express.static(path.join(__dirname, 'public')));
                app.set('view engine', 'pug');
                    
                app.use(this.session({
                    secret: 'secret cat in the hot hat',
                    // create new redis store.
                    store: this.redisStore,
                    saveUninitialized: true,
                    resave: false,
                    cookie: { maxAge: 6000000 , secure: false }
                }));
                    //body parsing 
                app.use(bodyParser.urlencoded({ extended: false }))
                app.use(bodyParser.json())

                
                    //Router handler cration
                self.spider.addFunction('app',app);
                self.spider.addFunction('express',express);

                var routeRepository = new RouteRepository(self.spider);
                var router          = routeRepository.router;

                    //routing
                app.use(router);



                //starting the server
                app.listen(3030);
                console.log("Server is running");
                
}



    getSpider(){
        return this.spider;

    };
};

module.exports = ExpressCustomServer;