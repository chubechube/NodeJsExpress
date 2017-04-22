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
            oracle              : Number,
            cleric       	    : Number,
            druid       	    : Number,
            ranger       	    : Number,
            magus       	    : Number,
            antipaladin       	: Number,
            inquisitor     	    : Number,
            summoner       	    : Number,
            paladin      	    : Number,
            alchemist       	: Number,
            bloodrager      	: Number,
            shaman      	    : Number,
            psychic      	    : Number,
            medium      	    : Number,
            mesmerist      	    : Number,
            occultist      	    : Number,
            spiritualist        : Number,
            skald      	        : Number,
            investigator        : Number,
            hunter              : Number,
            bard      	        : Number,
            description         : String,
            full_text           : String
			
		}, { id: true });

	this.spellModel = this.mongoose.model("spells",this.spellSchema);


};

findSpellByName(spellName){
		return this.spellModel.find({name : spellName}).exec();
	}

findSpellByClassAndLevel(userClass ,spellLevel){
        switch(userClass){
        case "cleric":
		    return this.spellModel.find({ cleric : spellLevel}).exec();
        break;

        case "wiz":
		    return this.spellModel.find({wiz : spellLevel}).exec();
        break;

        case "sor":
		    return this.spellModel.find({sor : spellLevel}).exec();
        break;

         case "druid":
		    return this.spellModel.find({druid : spellLevel}).exec();
        break;

         case "ranger":
		    return this.spellModel.find({ranger : spellLevel}).exec();
        break;

         case "bard":
		    return this.spellModel.find({bard : spellLevel}).exec();
        break;

         case "paladin":
		    return this.spellModel.find({paladin : spellLevel}).exec();
        break;

         case "alchemist":
		    return this.spellModel.find({alchemist : spellLevel}).exec();
        break;

         case "summoner":
		    return this.spellModel.find({summoner : spellLevel}).exec();
        break;

         case "witch":
		    return this.spellModel.find({witch : spellLevel}).exec();
        break;
        
        case "inquisitor":
		    return this.spellModel.find({inquisitor : spellLevel}).exec();
        break;

         case "oracle":
		    return this.spellModel.find({oracle : spellLevel}).exec();
        break;

         case "antipaladin":
		    return this.spellModel.find({antipaladin : spellLevel}).exec();
        break;

         case "magus":
		    return this.spellModel.find({magus : spellLevel}).exec();
        break;

        case "shaman":
		    return this.spellModel.find({shaman : spellLevel}).exec();
        break;

        case "psychic":
		    return this.spellModel.find({psychic : spellLevel}).exec();
        break;

        case "medium":
		    return this.spellModel.find({medium : spellLevel}).exec();
        break;

        case "mesmerist":
		    return this.spellModel.find({mesmerist : spellLevel}).exec();
        break;

        case "occultist":
		    return this.spellModel.find({occultist : spellLevel}).exec();
        break;

        case "spiritualist":
		    return this.spellModel.find({spiritualist : spellLevel}).exec();
        break;

        case "skald":
		    return this.spellModel.find({skald : spellLevel}).exec();
        break;

        case "investigato":
		    return this.spellModel.find({investigator : spellLevel}).exec();
        break;

        case "hunter":
		    return this.spellModel.find({hunter : spellLevel}).exec();
        break;
           
        
        default:
            return null;

        }
	}

};

module.exports = SpellsHandler;