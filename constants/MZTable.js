/**
 * Created:				  11 Aug 2017
 * Last updated:		14 Sept 2017
 * Developer(s):		CodedLotus
 * Description:			Returns details of the TB1 Metal Zone. Initial Function code came from crape.org/tools/terra-battle/mz.html
 * Version #:			  1.3.1
 * Version Details:
		0.0.0: File created from cloning token.js file
		1.0.0: Basic on-the-hour MZ schedule available
		1.1.0: Full Schedule search available from class
		1.1.1: Added auto-correcting DateString function to make the array material more readable and usable
		1.2.0: Added single-zone schedule access function for data retrieval
		1.2.1: Corrected semi-scheduled infinite loop.
    1.3.0: Added flags for zone schedule getters to return Date arrays instead of String arrays
    1.3.1: Created separate time-remaining function to allow easier calculations of "Time Remaining"
    1.3.2: Replaced some manual time calculations with class constants.
 * Functional sourcecode:	https://crape.org/tools/terra-battle/mz.html
 */

/**
 * Data store of the TB1 Metal Zone schedule.
 */
 
class MZTable {
	
	constructor() {
		
		/**
		 * Class constants that are repeated in the 2-D Array.
		 */
		this._STAT_CLOSE = 0;
		this._STAT_OPEN  = 1;
		this._STAT_OPEN1 = 2;
		this._STAT_KING  = 3;
		this._MAX_ZONE = 7;
		
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
		 * Class constant that signifies the starting time for calculations.
		 */
		this._BASE_TIME = Date.parse("2014-10-08T00:00:00.000+09:00");
		
		/**
		 * 2-D Array to source all recurring MZ scheduled times from.
		 */
		this.gTimetable = [];
		
		this._createTimetable();
		//createTimeTable() function from crape.org
		/*for (var i = 0; i < 10; ++i) {
			var ary = [];
			for (var j = 0; j < 24; ++j) {
			  var remainder = (j - (i % 5)) % 6;
			  var state = this._STAT_CLOSE;
			  if (remainder == 0) { state = this._STAT_OPEN; }
			  if (remainder == 1) { state = this._STAT_OPEN1; }

			  ary.push(state);
			}
			this.gTimetable.push(ary);
		  }

		  // KINGは個別設定
		  this.gTimetable[0][ 9] = this._STAT_KING;
		  this.gTimetable[1][17] = this._STAT_KING;
		  this.gTimetable[2][12] = this._STAT_KING;
		  this.gTimetable[3][ 7] = this._STAT_KING;
		  this.gTimetable[4][19] = this._STAT_KING;
		  this.gTimetable[5][ 8] = this._STAT_KING;
		  this.gTimetable[6][10] = this._STAT_KING;
		  this.gTimetable[7][22] = this._STAT_KING;
		  this.gTimetable[8][11] = this._STAT_KING;
		  this.gTimetable[9][17] = this._STAT_KING;*/
	}

	/**
	 * Initializing function that creates the 2-D array with timings for the class.
	 */
	_createTimetable() {
	  // 通常OPEN
	  for (var i = 0; i < 10; ++i) {
		var ary = [];
		for (var j = 0; j < this._24; ++j) {
		  var remainder = (j - (i % 5)) % 6;
		  var state = this._STAT_CLOSE;
		  if (remainder == 0) { state = this._STAT_OPEN; }
		  if (remainder == 1) { state = this._STAT_OPEN1; }

		  ary.push(state);
		}
		this.gTimetable.push(ary);
	  }

	  // Guaranteed MZ "All Hail The King" (AHTK) timings
	  this.gTimetable[0][ 9] = this._STAT_KING;
	  this.gTimetable[1][17] = this._STAT_KING;
	  this.gTimetable[2][12] = this._STAT_KING;
	  this.gTimetable[3][ 7] = this._STAT_KING;
	  this.gTimetable[4][19] = this._STAT_KING;
	  this.gTimetable[5][ 8] = this._STAT_KING;
	  this.gTimetable[6][10] = this._STAT_KING;
	  this.gTimetable[7][22] = this._STAT_KING;
	  this.gTimetable[8][11] = this._STAT_KING;
	  this.gTimetable[9][17] = this._STAT_KING;
	}

	/**
	 * Function that gets the array data given the speficied Metal Zone and the time to check from
	 */
	_getTimetableState(date, zone) {
	  var deltaD = Math.floor(
		(date.getTime() - this._BASE_TIME) / (this._DAY_IN_MS)
	  );
	  var deltaH = Math.floor(
		(date.getTime() - this._BASE_TIME - deltaD * this._DAY_IN_MS) / (this._HOUR_IN_MS)
	  );

	  var idxD = (deltaD + zone - 1) % 10;
	  if (idxD < 0) { idxD += 10; }
	  var idxH = deltaH;
	  
	  return this.gTimetable[idxD][idxH];
	}
	
	/**
	 * Function that converts DateString data into a readable string for (D:)(H)H:MM formatting for Discord messaging purposes
	 */
	datestringMaker(date, isAHTK = false) {
		var dateNow = new Date();
		var baseDeltaD = Math.floor(
			(date - dateNow) / (this._DAY_IN_MS)
		);
		var baseDeltaH = Math.floor(
			(date - dateNow - baseDeltaD * this._DAY_IN_MS) / (this._HOUR_IN_MS)
		);
		var baseDeltaM = Math.floor(
			(date - dateNow - baseDeltaD * this._DAY_IN_MS - baseDeltaH * this._HOUR_IN_MS) / (this._MIN_IN_MS)
		);
    return ( !isAHTK
			?  baseDeltaH + ":" + (baseDeltaM < 10 ? "0" : "" ) + baseDeltaM 
			:  (baseDeltaD > 0 ? baseDeltaD + ":" : "") + (baseDeltaH < 10 ? "0" : "" ) + baseDeltaH + ":" + (baseDeltaM < 10 ? "0" : "" ) + baseDeltaM );
	}
  
  /**
	 * Function that converts Date data into a usable JSO for Discord alert purposes
	 */
	timeRemaining(MZdate, dateNow = new Date()) {
		//var dateNow = new Date();
		var baseDeltaD = Math.floor(
			(MZdate - dateNow) / (this._DAY_IN_MS)
		);
		var baseDeltaH = Math.floor(
			(MZdate - dateNow - baseDeltaD * this._DAY_IN_MS) / (this._HOUR_IN_MS)
		);
		var baseDeltaM = Math.floor(
			(MZdate - dateNow - baseDeltaD * this._DAY_IN_MS - baseDeltaH * this._HOUR_IN_MS) / (this._MIN_IN_MS)
		);
    return { days: baseDeltaD, hours: baseDeltaH, minutes: baseDeltaM };
	}
  
  /**
	 * Function that gets all of the Metal Zones available at this moment (including MZ AHTK)
	 */
	getOpenZones(date){
		var openZones = [];
		for (var zone = 1; zone <= this._MAX_ZONE; ++zone) {
		  var state = this._getTimetableState(date, zone);
		  //openZones.push(state);

		  if (state == this._STAT_OPEN
			  || state == this._STAT_KING
			  || (zone == 1 && state == this._STAT_OPEN1)) {

			openZones[zone-1] = state;
		  } else { openZones.push(this._STAT_CLOSE); }
		}
		//console.log(openZones.toString());
		return openZones;
	}
	
	/**
	 * Function that looks ahead for the next openings of the Metal Zones and their AHTKs.
	 * Returns: JSON with 2 attributes (openZoneSchedule, openAHTKSchedule) that are arrays populated with Strings (or Dates if format = false)
	 * 		NOTE: Strings made in this function use internal datestringMaker to manage readability moving up
	 */
	getNextZoneSchedule(format = true){
		//Initialize new DateTime object set to start at the next hour
		var movingDate = new Date();
		movingDate.setHours( movingDate.getHours() + 1 );
		movingDate.setMinutes(0); movingDate.setSeconds(0); movingDate.setMilliseconds(0);
		
		//Initialize new arrays that will hold the new DateTimes for the upcoming MZ instances
		var openZones = [], openAHTK = [], openZoneCounter = this._MAX_ZONE, openAHTKCounter = this._MAX_ZONE;
		//Counters are to help calculate remaining slots to fill.
		
		/**
		 * Loop Checklist:
		 * 1) Get the current open zones
		 * 2) Insert into corresponding scheduling array IF current slot is empty ('undefined')
		 * 3) Decriment corresponding counter
		 */
		do {
			var openNow = this.getOpenZones(movingDate);
			//Iterate all zones fetched
			for( var zone = 0; zone < this._MAX_ZONE; ++zone ){
				//NOTE: Ignore cases where openNow == 2 
				//Skip case where openNow == 2 to ignore "current" MZ1 running
				if( openNow[zone] == this._STAT_OPEN1 ){ continue; }
				//Case for AHTK, but skip if the counter is 0 or current zone has its time filled
				else if( openAHTKCounter > 0 
					&& typeof openAHTK[zone] === 'undefined' 
					&& openNow[zone] == this._STAT_KING ){
						openAHTK[zone] = (format ? this.datestringMaker(movingDate, true) : new Date(movingDate));
						//openAHTK[zone] = this._datestringMaker(movingDate, true);
						--openAHTKCounter;
				}
				//Case for normal MZs, but skip if the counter is 0 or current zone has its time filled
				else if ( openZoneCounter > 0 
					&& typeof openZones[zone] === 'undefined' 
					&& openNow[zone] == this._STAT_OPEN ){
						openZones[zone] = (format ? this.datestringMaker(movingDate) : new Date(movingDate));
						//openZones[zone] = this._datestringMaker(movingDate);
						--openZoneCounter;
				}
			}
			//Increment the hour for MZ analysis
			movingDate.setHours( movingDate.getHours() + 1 );
		} while (openZoneCounter > 0 || openAHTKCounter > 0); //Make sure both counters == 0 before I end the loop.
		
		return {openZoneSchedule : openZones, openAHTKSchedule : openAHTK };
	}
	
	/**
	 * Function that looks ahead for the next openings of a specific Metal Zones and their AHTKs.
	 * Returns: JSON with 2 attributes (openZoneSchedule, openAHTKSchedule) that are arrays populated with Strings (or Dates if format = false)
	 * 		NOTE: Strings made in this function use internal datestringMaker to manage readability moving up
	 */
	getSpecificZoneSchedule(zone, format = true){
		//Initialize new DateTime object set to start at the next hour
		var movingDate = new Date();
		movingDate.setHours( movingDate.getHours() + 1 );
		movingDate.setMinutes(0); movingDate.setSeconds(0); movingDate.setMilliseconds(0);
		
		//Initialize new arrays that will hold the new DateTimes for the upcoming MZ instances
		var openZone = undefined, openAHTK = undefined, openZoneCounter = 1, openAHTKCounter = 1;
		//Counters are to help calculate remaining slots to fill.
		
		/**
		 * Loop Checklist:
		 * 1) Get the current open zones
		 * 2) Insert into corresponding scheduling array IF current slot is empty ('undefined')
		 * 3) Decriment corresponding counter
		 */
		do {
			var openNow = this._getTimetableState(movingDate,zone);
			//Iterate all zones fetched
			//NOTE: Ignore cases where openNow == 2 
			//Skip case where openNow == 2 to ignore "current" MZ1 running
			if( openNow == this._STAT_OPEN1 ){ ; }
			//Case for AHTK, but skip if the counter is 0 or current zone has its time filled
			else if( openAHTKCounter > 0 
				&& typeof openAHTK === 'undefined' 
				&& openNow == this._STAT_KING ){
					//console.log("AHTK moving date: " + movingDate);
					//console.log("format ?: :" + (format ? this._datestringMaker(movingDate, true) : movingDate));
					openAHTK = (format ? this.datestringMaker(movingDate, true) : new Date(movingDate));
					//openAHTK = this._datestringMaker(movingDate, true);
					--openAHTKCounter;
			}
			//Case for normal MZs, but skip if the counter is 0 or current zone has its time filled
			else if ( openZoneCounter > 0 
				&& typeof openZone === 'undefined' 
				&& openNow == this._STAT_OPEN ){
					//console.log("Base moving date: " + movingDate);
					//console.log("format ?: :" + (format ? this._datestringMaker(movingDate, true) : movingDate));
					openZone = ((format) ? this.datestringMaker(movingDate) : new Date(movingDate));
					//openZone = this._datestringMaker(movingDate);
					--openZoneCounter;
			}
			//Increment the hour for MZ analysis
			movingDate.setHours( movingDate.getHours() + 1 );
		} while (openZoneCounter > 0 || openAHTKCounter > 0); //Make sure both counters == 0 before I end the loop.
		
		return {openZoneSchedule : openZone, openAHTKSchedule : openAHTK };
	}
}

//Export MZTable class for other parts to use
module.exports = new MZTable();

