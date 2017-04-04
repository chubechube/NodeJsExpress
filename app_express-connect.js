var express 	= require('express');
var parseurl 	= require('parseurl');
var session 	= require('express-session');
var redis   	= require("redis");
var redisStore 	= require('connect-redis')(session);
var app 		= express()
var client  	= redis.createClient({host : "192.168.1.3" , password : "chube2017"});

app.use(session({
    secret: 'secret cat in the hat',
    // create new redis store.
    store: new redisStore({ host: '192.168.1.3', port: 6379, client: client,ttl :  260}),
    saveUninitialized: false,
    resave: false,
    cookie : { expires : new Date(Date.now() + 3600000) }
}));


app.use(function (req, res, next) {
  var views = req.session.views

  if (!views) {
    views = req.session.views = {}
    console.log("First Time view "+req.session)
  }

  // get the url pathname
  var pathname = parseurl(req).pathname

  // count the views
  views[pathname] = (views[pathname] || 0) + 1
  console.log("View number "+pathname+" "+views.toString()+" "+views[pathname]);
  next()
})

app.get('/foo', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/foo'] + ' times')
})

app.get('/bar', function (req, res, next) {
  res.send('you viewed this page ' + req.session.views['/bar'] + ' times')
})

app.listen(3030);  
module.exports = app;