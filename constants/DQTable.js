/**
 * Created:				  06 Sep 2017
 * Last updated:		15 Sep 2017
 * Developer(s):		CodedLotus
 * Description:			Returns the current TB1 Daily Quest. Initial Schedule came from https://terrabattleforum.com/threads/medieval-battle-4-4-0-update.11929/
 * Version #:			  1.0.1
 * Version Details:
		0.0.0: File created from cloning MZTable.js file
		1.0.0: Created base Daily Quest Map, daily quest access functions, and time remaining access functions
    1.0.1: Added class variables to help organize time calculations easier
 */

/**
 * Data store of the TB1 Daily Quest schedule.
 */
 
class DQTable {
	
	constructor() {
		/**
		 * Class constant that signifies the starting time for calculations.
		 */
		this._BASE_TIME = Date.parse("2016-12-01T00:00:00.000+00:00");
		
    /**
		 * Class constants pertaining to time calculations.
		 */
    this._60 = 60;
    this._24 = 24;
    this._1000 = 1000;
    this._SEC_IN_MS  = this._1000;
    this._MIN_IN_MS  = this._1000 * this._60;
    this._HOUR_IN_MS = this._1000 * this._60 * this._60;
    this._DAY_IN_MS  = this._1000 * this._60 * this._60 * this._24;
    
		/**
		 *  A collection of cycle days and that day's daily quest for Terra Battle 1
		 * @type {Collection<string,string>}
		 */
		this._QUEST_MAP = new Map();
		
		this._createDailyQuestMap();
	}
	
	/**
	 * Initializing function that creates the map associations for the cycle of daily quests in TB1.
	 */
	_createDailyQuestMap(){
		this._QUEST_MAP.set(1, "Lucky Orbling");
		this._QUEST_MAP.set(2, "Hidden Stars");
		this._QUEST_MAP.set(3, "Particle Hoarder Horde?");
		this._QUEST_MAP.set(4, "Crystal Roundelay");
		this._QUEST_MAP.set(5, "Puppet Pandemonium");
		this._QUEST_MAP.set(6, "Tearjerker Time");
		this._QUEST_MAP.set(7, "Lucky Orbling");
		this._QUEST_MAP.set(8, "Metal Runner Rampage");
		this._QUEST_MAP.set(9, "Rarity Rumble");
		this._QUEST_MAP.set(10, "Hidden Stars");
		this._QUEST_MAP.set(11, "Tropical Haze");
		this._QUEST_MAP.set(12, "Particle Hoarder Horde?");
		this._QUEST_MAP.set(13, "Lucky Orbling");
		this._QUEST_MAP.set(14, "Sweet Temptation");
		this._QUEST_MAP.set(15, "Puppet Pandemonium");
		this._QUEST_MAP.set(16, "Tearjerker Time");
		this._QUEST_MAP.set(17, "Crystal Roundelay");
		this._QUEST_MAP.set(18, "Metal Runner Rampage");
		this._QUEST_MAP.set(19, "Rarity Rumble");
		this._QUEST_MAP.set(20, "Hidden Stars");
		this._QUEST_MAP.set(21, "Hedgehog Hullabaloo");
		this._QUEST_MAP.set(22, "Particle Hoarder Horde?");
		this._QUEST_MAP.set(23, "Lucky Orbling");
		this._QUEST_MAP.set(24, "Puppet Pandemonium");
		this._QUEST_MAP.set(25, "Tearjerker Time");
		this._QUEST_MAP.set(26, "Sweet Temptation");
		this._QUEST_MAP.set(27, "Metal Runner Rampage");
		this._QUEST_MAP.set(28, "Rarity Rumble");
	}
	
	/**
	 * Function that gets the name of the Daily Quest
	 */
	getDailyQuest(date){
		var day = Math.floor((date - this._BASE_TIME)/(this._DAY_IN_MS))%28;
		return this._QUEST_MAP.get(day+1);
	}
	
	/**
	 * Function that returns the number of hours and minutes remaining before the next server rollover
	 */
	timeRemaining(timeObject = false) {
		var dTod = new Date(), dTom = new Date(dTod.toUTCString());
		dTom.setDate(dTom.getDate() + 1); dTom.setUTCHours(0); dTom.setUTCMinutes(0); dTom.setUTCSeconds(0); dTom.setUTCMilliseconds(0);
		var baseDeltaH = Math.floor( (dTom - dTod) / (this._HOUR_IN_MS) );
		var baseDeltaM = Math.round( (dTom - dTod - baseDeltaH * this._HOUR_IN_MS) / (this._MIN_IN_MS) );
		return ( !timeObject ? 
			baseDeltaH + ":" + (baseDeltaM < 10 ? "0" : "" ) + baseDeltaM :
			{quest: this.getDailyQuest(dTod), hours: baseDeltaH, minutes: baseDeltaM } ) ;
	}
  
  timeRemaining(dTod, timeObject = false) {
		var dTom = new Date(new Date().toUTCString());
		dTom.setDate(dTom.getDate() + 1); dTom.setUTCHours(0); dTom.setUTCMinutes(0); dTom.setUTCSeconds(0); dTom.setUTCMilliseconds(0);
		var baseDeltaH = Math.floor( (dTom - dTod) / (this._HOUR_IN_MS) );
		var baseDeltaM = Math.round( (dTom - dTod - baseDeltaH * this._HOUR_IN_MS) / (this._MIN_IN_MS) );
		return ( !timeObject ? 
			baseDeltaH + ":" + (baseDeltaM < 10 ? "0" : "" ) + baseDeltaM :
			{quest: this.getDailyQuest(dTod), hours: baseDeltaH, minutes: baseDeltaM } ) ;
	}

}

//Export DQTable class for other parts to use
module.exports = new DQTable();

/*
Day	Name
1	Lucky Orbling
2	Hidden Stars
3	Particle Hoarder Horde?
4	Crystal Roundelay
5	Puppet Pandemonium
6	Tearjerker Time
7	Lucky Orbling
8	Metal Runner Rampage
9	Rarity Rumble
10	Hidden Stars
11	Tropical Haze
12	Particle Hoarder Horde?
13	Lucky Orbling
14	Sweet Temptation
15	Puppet Pandemonium
16	Tearjerker Time
17	Crystal Roundelay
18	Metal Runner Rampage
19	Rarity Rumble
20	Hidden Stars
21	Hedgehog Hullabaloo
22	Particle Hoarder Horde?
23	Lucky Orbling
24	Puppet Pandemonium
25	Tearjerker Time
26	Sweet Temptation
27	Metal Runner Rampage
28	Rarity Rumble
*/