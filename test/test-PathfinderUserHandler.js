var chai 					= require('chai');
var should					= chai.should()
var expect					= chai.expect;
var DataBaseHandler 	    = require("../db/DataBaseHandler");
var PathfinderUserHandler 	= require("../db/PahtfinderUserHandler");
var MessageDispatcher	    = require('../messageDispatcher');
var Spider                	= require('../Spider');

var spider              		= new Spider();
var messageDispatcher  		 	= new MessageDispatcher();
var dbconnection 				= new DataBaseHandler(spider);
spider.addModule("dbHandler",dbconnection);


var pathfinderUserHandler	= new PathfinderUserHandler(spider);
        spider.addModule('pathfinderUserHandler',pathfinderUserHandler);




var isConnected = false;

describe("DataBase runtime", function(){
	 before(function(done) {
		    this.timeout(3000); 
		    setTimeout(done, 2500);
		    dbconnection.connectDB();
		  });
	 
	


describe("Connection to the Database", function(){
					
	it("Check connectiton to the database ",function(done){
			expect(dbconnection.isConnected()).to.equal(true);
			done();
	});
					

});
	




	 describe("Test Suite : User", function () {
		
		

		it("creata an User ",function(done){
			
			var userNew = pathfinderUserHandler.createUser("chube","test@gmail.com","test","cleric",1,"Bahantar");
			userNew.catch(function(err){console.log("%s",err)}).then(function(promisedUser){
				should.exist(promisedUser);
				done();
			})
			
		 })

		 it("Find an User using name as key",function(done){
			
			var promisedUser = pathfinderUserHandler.findUserByName("chube");
			promisedUser.catch(function(err){console.log(err)}).then(function(promisedUser){
				expect(promisedUser).to.be.an('array');
				expect(promisedUser[0]).to.have.a.property('userName').that.is.a('string');
				expect(promisedUser[0].userName).equal('chube');
				done();
			});

		 });

		  it("Find an User using mail as key",function(done){
			
			var promisedUser = pathfinderUserHandler.findUserByEmail("test@gmail.com");
			promisedUser.catch(function(err){console.log(err)}).then(function(promisedUser){
				expect(promisedUser).to.be.an('array');
				expect(promisedUser[0]).to.have.a.property('userName').that.is.a('string');
				expect(promisedUser[0].userName).equal('chube');
				done();
			});

		 });


		
		 it("retrieve all users",function(done){

			
			var allUsers = pathfinderUserHandler.getAllUser();

			allUsers.catch(function(err){console.log(err)}).then(function(allUsers){
				//console.log("Oggetto cancellato "+deletedItem);
				expect(allUsers).to.be.an('array');
				should.exist(allUsers);
				done();
			})
		 
		 
		 });
	});
});