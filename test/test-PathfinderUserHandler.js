var chai 					= require('chai');
var should					= chai.should()
var expect					= chai.expect;
var PathfinderUserHandler 	= require("../db/PahtfinderUserHandler");
var MessageDispatcher	    = require('../messageDispatcher');
const Spider                = require('../Spider');

var spider              = new Spider();
var messageDispatcher   = new MessageDispatcher();
var dbconnection 		= new PathfinderUserHandler(spider);


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
			
			var userNew = dbconnection.createUser("chube","test@gmail.com","test","cleric",1,"Bahantar");
			userNew.catch(function(err){console.log("%s",err)}).then(function(promisedUser){
				should.exist(promisedUser);
				done();
			})
			
		 })

		 it("Find an User using name as key",function(done){
			
			var promisedUser = dbconnection.findUserByName("chube");
			promisedUser.catch(function(err){console.log(err)}).then(function(promisedUser){
				expect(promisedUser).to.be.an('array');
				expect(promisedUser[0]).to.have.a.property('userName').that.is.a('string');
				expect(promisedUser[0].userName).equal('chube');
				done();
			});

		 });

		  it("Find an User using mail as key",function(done){
			
			var promisedUser = dbconnection.findUserByEmail("test@gmail.com");
			promisedUser.catch(function(err){console.log(err)}).then(function(promisedUser){
				expect(promisedUser).to.be.an('array');
				expect(promisedUser[0]).to.have.a.property('userName').that.is.a('string');
				expect(promisedUser[0].userName).equal('chube');
				done();
			});

		 });


		
		 it("retrieve all users",function(done){

			
			var allUsers = dbconnection.getAllUser();

			allUsers.catch(function(err){console.log(err)}).then(function(allUsers){
				//console.log("Oggetto cancellato "+deletedItem);
				expect(allUsers).to.be.an('array');
				should.exist(allUsers);
				done();
			})
		 
		 
		 });
	});
});