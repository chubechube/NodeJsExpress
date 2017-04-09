const redis             = require('redis');

var assert              = require('assert');
var net                 = require('net');

class RedisHandler {

    constructor(spider,ip4addr,password){
        assert.equal(typeof(spider),"object","Session handler is not valid");
        assert.equal(typeof (ip4addr), 'string',"argument 'ip4addr' must be a string");
        assert.ok(net.isIPv4(ip4addr),"argument 'ip4addr' must be a valid IPv4 address");

        this.spider     = spider;
        this.session    = this.spider.getFunction('session');
        this.ip4addr    = ip4addr;
        this.password   = password;
        this.redisStore = undefined;

    };

createClient(){

//var client = redis.createClient({ host: "192.168.1.7", password: "chube2017" });
        var self = this;
       
         this.client = redis.createClient({ host: this.ip4addr, password: this.password });

        this.client.on('error', function (err) {
            console.log('error event - ' + this.client.host + ':' + this.client.port + ' - ' + err);
            self.spider.emit(self.spider.availableMessages.REDIS_CILENT_FAILED);
        });
       
       
        this.client.on('ready',function(){
            console.log("Redis Connected");
            self.spider.emit(self.spider.availableMessages.REDIS_CLIENT_OK);
        
    });

    

    return this.client;


};


createStore(){
    var redisStore  = require('connect-redis')(this.session);
    this.redisStore =  new redisStore({ host: this.ip4addr, port: 6379, client: this.client, ttl: 260 });
    return this.redisStore;
}

};

module.exports = RedisHandler;