var assert              = require('assert');

class SpellsHandler{

constructor (mongoose){
    assert.equal(typeof(mongoose),"object","moongose is not valid");
    
    this.mongoose           = mongoose;
    this.Schema 			= this.mongoose.Schema; 
    this.spellSchema        = null; 
    this.spellModel         = null;

    this.initializeSpell();
};

initializeSpell(){

		//Spell Schema	
		this.spellSchema = new this.Schema({
			name 		        : String,
            sor      	        : Number,
            wiz      	        : Number,
            cleric       	    : Number,
            description         : String
			
		}, { id: true });

	this.spellModel = this.mongoose.model("spells",this.spellSchema);


};

findSpellByName(spellName){
		return this.spellModel.find({name : spellName}).exec();
	}

findSpellByClassAndLevel(userClass ,spellLevel){
        switch(userClass){
        case "cleric":
		    return this.spellModel.find({cleric : spellLevel}).exec();
        break;

        case "wiz":
		    return this.spellModel.find({wiz : spellLevel}).exec();
        break;

        case "sor":
		    return this.spellModel.find({sor : spellLevel}).exec();
        break;

        
        default:
            return null;

        }
	}

};

module.exports = SpellsHandler;