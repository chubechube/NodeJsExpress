/*jshint esversion: 6 */
var DataBaseHandler 	    = require("../db/DataBaseHandler");
var MessageDispatcher		= require("../messageDispatcher");

function main(){
				var messageDispatcher = new MessageDispatcher();
				var dbconnection = new DataBaseHandler(messageDispatcher);
				var newItem =	null;
				var self = this;



				messageDispatcher.once("Item_Created", function(){
									console.log("Item Creato -> Ispezione e Cancellazione")
										

					var itemToSearch = dbconnection.findItem("1");
					itemToSearch.catch(function(err){console.log("err")}).then(function(stringtoprint){console.log("Oggetto Trovato "+stringtoprint)});


					var itemToDelete = dbconnection.removeItem("1");
					itemToDelete.catch(function(err){console.log("err")}).then(function(stringtoprint){console.log("Oggetto Cancellato "+stringtoprint)});
									//dbconnection.disconnectDB();
							});
							

				messageDispatcher.once("Connected", function(){
					console.log("Connessione avvenuta ->  Creazione Item")
					
					newItem = dbconnection.createItem("1");
					newItem.catch(function(err){console.log("err")}).then(function(stringtoprint){console.log("Oggetto Creato "+stringtoprint)});
					
					allUsers = dbconnection.getAllUser();
					allUsers.catch(function(err){console.log(err)}).then(function(allUsers){console.log("User Trovati "+allUsers)})
					
	});
				messageDispatcher.once("disconnected", function()
				{
					console.log("Disconessione Avvenuta")
				});
				
				
				dbconnection.connectDB();
				
				
}

main();	
				
	
				