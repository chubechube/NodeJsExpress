//Site Route repository
const	parseurl 		= require('parseurl');
const	PassportHandler = require('./PassportHandler');		
const 	flash         	= require('express-flash');
const 	allGreen		= false;

function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}


function setRoutes(self){
var self  = self;
//Middleware for all Routes
// Add headers
self.router.use(function (req, res, next) {

    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
	res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

self.router.all("*", function (req, res, next) {
		console.log('Someone made a request!');
		console.log('%s %s %s', req.method, req.url, req.path);
		
		if(!self.spider.allGreen)
		{
			res.status(404);
			res.send('Not found');
		}else{
			// to redirect at original url after successful login
			if(!req.user && req.session.returnHere == null){
				req.session.returnHere = req.url;
			}else{

				var views = req.session.views

				if (!views) {
					views = req.session.views = {}
					console.log("First Time view " + req.session)
				}

				// get the url pathname
				var pathname = parseurl(req).pathname

				// count the views
				views[pathname] = (views[pathname] || 0) + 1
				console.log("View number " + pathname + " " + views.toString() + " " + views[pathname]);

			};
			
			next();
		}
	});

	
	//About Page Route GET
	self.router.get('/about', loggedIn,function (req, res) {
		res.send('im the about page!' + 'you viewed this page ' + req.session.views['/about'] + ' times');
	});

	// Insert User Page Route GET
	self.router.get('/insert',loggedIn, function (req, res) {

		res.render('insert',{title: 'Insert User',message: req.session.views['/insert'] });
		
	});

	//Insert User Page Route POST
  	self.router.post('/insert',loggedIn,function(req, res) {
	
	var promisedResults				= new Array();
	var promisedUser 				= self.dbConnection.createUser(req.body.userName,req.body.userEmail,req.body.userPassword);
	var promisedUsersList 	 		= self.dbConnection.getAllUser();
	
	
	function printInsertResult(newUser, allUsers){
		res.render('insertSuccess',{newUser: newUser, users: allUsers});
	};

	

	promisedUser.then(function(promisedUser){
				promisedResults.push(promisedUser);
				promisedUsersList.then(function(allUsers){
					allUsers.push(promisedResults[0]);
					promisedResults.push(allUsers);
					printInsertResult(promisedResults[0],promisedResults[1]);
				});
				}).catch(function(err){
		console.log(err);
	});
    
  })

	//List of Users Page GET
	self.router.get('/users',function(req,res){
		
		var promisedUsersList = self.dbConnection.getAllUser();

		function showUsers(allUsers){
			console.log(allUsers);
			//res.render('userManagement',{users: allUsers});
			res.json(allUsers);
		};


		promisedUsersList.then(function(allUsers){

				showUsers(allUsers);
			
		}).catch(function(err){
		console.log(err)});



	});

//Single User Page GET

  self.router.get('/users/:user_id',loggedIn,function(req,res){
	
	function printFindResult(selectedUser){
		console.log('Utente TROVATO '+selectedUser);
		res.render('getUser',{user: selectedUser});
	};

	var promisedUser = self.dbConnection.findUserById(req.params.user_id);

	promisedUser.then(function(selectedUser){
		printFindResult(selectedUser);
	}).catch(function(err){console.log(err)});

});

	//Main Page Route GET
	self.router.get('/',loggedIn,function (req, res) {
			res.render('index', { title: 'Hey', message: 'Hello there! ' + req.session.views['/'] + ' times' });
		
	});

	//Login  Page Route GET
	self.router.get('/login', function (req, res) {
		if(!req.session || req.session.returnHere == null){
			req.session.returnHere = '/';
		}
		res.render('login', { title: 'Login Page' })
	});


	//Login Page Route POST
	self.router.post('/login',self.passportHandler.passport.authenticate('local', { failureFlash: 'Invalid username or password.' , failureRedirect: '/login' }),
  function(req, res) {
	

	//in case of successuful login the original url must be reset
	var goUrl = req.session.returnHere;
	req.session.returnHere = null;
	
    res.redirect(goUrl);
  });

// List of all Pathdinfer Users GET

	self.router.get('/pahtfinderUsers',function(req,res){
	

		
		
		var promisedPathfinderUserList = self.pathfinderUserHandler.getAllUser();


		
		if(promisedPathfinderUserList != null){
		promisedPathfinderUserList.then(function(allUsers){
			res.json(allUsers);
		}).catch(function(err){
		console.log(err)});

		}else{
			res.send("Pathdinder Users not Found");

		};

	});






//List of Spells Page GET





	self.router.get('/spells',function(req,res){
		var userClass = req.query.class;
		var userLevel = req.query.level;

		
		var promisedSpellsList = self.dbConnection.spellHandler.findSpellByClassAndLevel(userClass,userLevel);


		function showSpells(allSpells){
			console.log(allSpells);
			res.json(allSpells);
		};

		if(promisedSpellsList != null){
		promisedSpellsList.then(function(allSpells){

				showSpells(allSpells);
			
		}).catch(function(err){
		console.log(err)});

		}else{
			res.send("Spell not Found");

		};

	});


};



class RouteRepository{
constructor(spider) {

		this.spider					= spider;
		var app 					= this.spider.getFunction('app');
		this.express				= this.spider.getFunction('express');
		this.parseurl 				= parseurl;
		this.dbConnection			= this.spider.getModule('dbHandler');
		this.pathfinderUserHandler  = this.spider.getModule('pathfinderUserHandler');
		this.passportHandler		= new PassportHandler(this.dbConnection);
		
		//Passport configuration
			//Passoport for authentication
		app.use(this.passportHandler.passport.initialize());
		app.use(this.passportHandler.passport.session());

	
	this.router = this.express.Router();
	setRoutes(this);
	app.use(flash());
};


};


module.exports = RouteRepository;