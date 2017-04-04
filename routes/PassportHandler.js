const passport 		= require('passport');
const passportLocal = require('passport-local');



class PassportHandler{
constructor(dbConnection){
    this.dbConnection = dbConnection;
//passport strategy
			passport.use(new passportLocal( function(username, password, done) {
			
			var userPromise = dbConnection.findUserByName(username);
			userPromise.catch(function(err){return done(err)}).then(function(userPromise) {
			if(userPromise.length == 0){
				return done(null,false,{message: 'User not found'});
			}
			if(!userPromise[0].userName === username && userPromise[0].validPassword(password)) {
				return done(null, false, { message: 'Incorrect username.' });
			}
			if (userPromise[0].userName === username && !(userPromise[0].validPassword(password))) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, userPromise);

			});
			
		}));

        this.setSerialization();

        this.passport = passport;

};

setSerialization(){
        passport.serializeUser(function(user, done) {
			console.log("User Serializzato "+user[0].id)
        done(null, user[0].id);
        });

        passport.deserializeUser(function(user, done) {
        done(null, user);
        });
    }   
};

module.exports = PassportHandler;