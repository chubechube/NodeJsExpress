var chai 					= require('chai');
var should					= chai.should()
var expect					= chai.expect;
var DataBaseHandler 	    = require("../db/DataBaseHandler");
var MessageDispatcher	    = require('../messageDispatcher');

var messageDispatcher   = new MessageDispatcher();
var dbconnection 		= new DataBaseHandler(messageDispatcher);


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
	


describe("Test Suite : Item", function () {
		
		it("Create an Item",function(done){
			var newItem = dbconnection.createItem("1");
			newItem.catch(function(err){console.log(err)}).then(function(newItem){
				should.exist(newItem);
				done();
			});

		});
		
		
		 it("Find  an item ",function(done){

			 var itemToSearch = dbconnection.findItem("1");
			 itemToSearch.catch(function(err){console.log(err)}).then(function(promisedItem){
				 should.exist(promisedItem);
				 promisedItem.should.be.an('array');
				 promisedItem[0].should.be.an('object');
				 promisedItem.should.to.have.lengthOf(1);
				 expect(promisedItem[0]).to.have.property('name').that.is.a('string');
				 done();
				
			});
			
			
		 })

		 it("delete the item that has been created",function(done){

			var deletedItem = dbconnection.removeItem("1");

			deletedItem.catch(function(err){console.log(err)}).then(function(deletedItem){
				should.exist(deletedItem);
				done();
			})
			
		})
		 
		 
	 });

	 describe("Test Suite : User", function () {
		
		

		it("creata an User ",function(done){
			
			var userNew = dbconnection.createUser("chube","test@gmail.com");
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
				expect(promisedUser[0]).to.have.a.property('userEmail').that.is.a('string')
				expect(promisedUser[0].userEmail).equal('test@gmail.com');
				done();
			});

		 });

		  it("Find an User using mail as key",function(done){
			
			var promisedUser = dbconnection.findUserByEmail("test@gmail.com");
			promisedUser.catch(function(err){console.log(err)}).then(function(promisedUser){
				expect(promisedUser).to.be.an('array');
				expect(promisedUser[0]).to.have.a.property('userName').that.is.a('string');
				expect(promisedUser[0].userName).equal('chube');
				expect(promisedUser[0]).to.have.a.property('userEmail').that.is.a('string')
				expect(promisedUser[0].userEmail).equal('test@gmail.com');
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