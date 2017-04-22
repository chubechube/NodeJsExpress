
const  mongoose 		= require('mongoose');
const  bcrypt			= require('bcrypt-nodejs');

const  SpelllHandler = require('./SpellsHandler')

mongoose.Promise = global.Promise;

class PathfinderUserHandler  {
	constructor(spider){
		mongoose.Promise 		= global.Promise;

		this.connected 			= false;
		this.db		   			= mongoose;
		this.spider 			= spider;
		this.self				= this;
		this.Schema 			= mongoose.Schema;
		this.spellHandler		= new SpelllHandler(mongoose);	
	
		
		this.initializeUser();
	}

	

	isConnected() {
		return this.connected;
	}

	connectDB() {
			var self 	= this;
			var uri		= 'mongodb://devchube:dev2017!@ds147789.mlab.com:47789/mongo460';
			var options = {promiseLibrary : global.Promise };
			//this.db.connect('mongodb://localhost/test')
			this.db.connect(uri,options);
			this.db.connection.once('connected', function() {
				self.connected = true
				self.spider.emit(self.spider.availableMessages.DBHANDLER_CONNECTION_OK);
			});
			
			this.db.connection.once('error', function(){
			this.connected = false;
			self.spider.emit(self.spider.availableMessages.DBHANDLER_CONNECTION_FAILED);
			});
			
		}
	
	disconnectDB(){
		var self = this;
		this.db.disconnect();
		this.db.connection.once('disconnected', function() {
				
			self.connected = false
			self.spider.emit(self.spider.availableMessages.DBHANDLER_DB_DISCONNECTED,"","");
			});
	}

	
	//User utilities

	initializeUser(){


        //MemorizedSpellSchema	
		this.memorizedSpellSchema = new this.Schema({
			spellLevel		: Number,
			spellItem		: [this.spellHandler.spellSchema]
		}, { id: true });

		//User Schema	
		this.userSchema = new this.Schema({
			userName 		         : String,
			userEmail		         : String,
			userPassword	         : String,
            playerClass              : String,
            playerLevel              : Number,
            playerName               : String,
            userMemorizedSpells      : [this.memorizedSpellSchema]
		}, { id: true });


        

		// methods ======================
			// generating a hash
			this.userSchema.methods.generateHash = function(password) {
				return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
			};

			// checking if password is valid
			this.userSchema.methods.validPassword = function(password) {
				return bcrypt.compareSync(password, this.userPassword);
			};

			this.userModel = mongoose.model("users",this.userSchema);


	};

	createUser(userName,userEmail,userPassword,playerClass,playerLevel,playerName,success,err){
		
		var newUser = new this.userModel();
		
		newUser.userName  		= userName;
		newUser.userEmail		= userEmail;
        newUser.playerClass     = playerClass;
        newUser.playerLevel     = playerLevel;
        newUser.playerName      = playerName;
		newUser.userPassword	= newUser.generateHash(userPassword);

		return newUser.save();
		};
	
	findUserByName(userName,success,err){
		return this.userModel.find({userName : userName}).exec();
	};
	
	findUserById(userID,success,err){
		return this.userModel.find({_id : userID}).exec();
		};
	
	findUserByEmail(userEmail,success,err){
		return this.userModel.find({userEmail : userEmail}).exec();
	};

	removeuserEmail(userEmail,success,err){
		return this.userModel.findOneAndRemove({userEmail : userEmail}).exec();
	};
	
	getAllUser(success,err){
		return this.userModel.find(function(err,users){
			if(err) return console.log(err);
			return users;
		}).exec();
	};
	





	
  findSpellByName(name,success,err){
	
  };
}



module.exports = PathfinderUserHandler;
