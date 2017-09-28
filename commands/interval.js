/*
 * Created:				  13 Sept 2017
 * Last updated:		15 Sept 2017
 * Developer(s):		CodedLotus
 * Description:			Returns the inverval function for the bot
 * Version #:			  1.1.0
 * Version Details:
		1.0.0: document created with frequently experimented functions
		1.1.0: Changed function parameters, function trigger conditions, and moved down essential const variables to base level functions
 */

//var MZSchedule = require("./MZTable");
//var DQSchedule = require("./DQTable"); 


function TBmidHourAlerts(time, DQSchedule, MZSchedule){  
  //Calculated functionals
  const openLeft = '{}{} has {} {} left', openNowIn = '{} is live{}', 
        ZERO = 0, MIN_LEFT = 60-time.getMinutes();
  
  //Open Metal Zone and Daily Quest calculations
  const openZones = MZSchedule.getOpenZones(time);
  const mz6       = MZSchedule.getSpecificZoneSchedule(6, false),
        mz7       = MZSchedule.getSpecificZoneSchedule(7, false);
  const tUntilM6  = MZSchedule.timeRemaining(mz6.openZoneSchedule, time),
        tUntilM6A = MZSchedule.timeRemaining(mz6.openAHTKSchedule, time),
        tUntilM7  = MZSchedule.timeRemaining(mz7.openZoneSchedule, time),
        tUntilM7A = MZSchedule.timeRemaining(mz7.openAHTKSchedule, time),
        tLeftInDQ = DQSchedule.timeRemaining(time, true);
  
  var output = "";
  
  //Daily Quest Alert
  output += (tLeftInDQ.hours == ZERO ? openLeft.format( "Daily Quest ", tLeftInDQ.quest, MIN_LEFT, "min" ) + "\n" : "" );
  
  //MZ 6/7 (AHTK) Closing Alert
  output += (openZones[6] > MZSchedule._STAT_CLOSE 
    ? openLeft.format( "MZ7", (openZones[6]==MZSchedule._STAT_KING?" AHTK":""), MIN_LEFT, "min" ) + "\n" : "" );
  output += (openZones[5] > MZSchedule._STAT_CLOSE 
    ? openLeft.format( "MZ6", (openZones[5]==MZSchedule._STAT_KING?" AHTK":""), MIN_LEFT, "min" ) + "\n" : "" );
  
  //MZ 6/7 Opening Alert
  //It is vital to check if the days == 0 since it would leave players thinking it will open soon.
  output += ( (tUntilM7A.hours == ZERO && tUntilM7A.days == ZERO ) 
    ? openNowIn.format( "MZ7 AHTK", " in " + MIN_LEFT + " min" ) + "\n" : "" );
  output += ( (tUntilM6A.hours == ZERO && tUntilM6A.days == ZERO ) 
    ? openNowIn.format( "MZ6 AHTK", " in " + MIN_LEFT + " min" ) + "\n" : "" );
  output += (tUntilM7.hours  == ZERO ? openNowIn.format( "MZ7",      " in " + MIN_LEFT + " min" ) + "\n" : "" );
  output += (tUntilM6.hours  == ZERO ? openNowIn.format( "MZ6",      " in " + MIN_LEFT + " min" ) + "\n" : "" );
  
  //console.log("test print: " + output);
  
  return output;
} //End of TBmidHourAlerts

function TBonHourAlerts(time, DQSchedule, MZSchedule){  
  //Calculated functionals
  const openLeft = '{}{} has {} {} left', openNowIn = '{} is live{}';
  const MZ_HOUR_THRESHOLDS = [1,3,5], ZERO = 0, DQ_SPACER = 4;
  
  //Open Metal Zone and Daily Quest calculations
  const openZones = MZSchedule.getOpenZones(time);
  const mz6       = MZSchedule.getSpecificZoneSchedule(6, false),
        mz7       = MZSchedule.getSpecificZoneSchedule(7, false);
  const tUntilM6  = MZSchedule.timeRemaining(mz6.openZoneSchedule, time),
        tUntilM6A = MZSchedule.timeRemaining(mz6.openAHTKSchedule, time),
        tUntilM7  = MZSchedule.timeRemaining(mz7.openZoneSchedule, time),
        tUntilM7A = MZSchedule.timeRemaining(mz7.openAHTKSchedule, time),
        tLeftInDQ = DQSchedule.timeRemaining(time, true);
  
  var output = "";
  
  //Daily Quest Alert
  output += ( (tLeftInDQ.hours%DQ_SPACER == ZERO || tLeftInDQ.hours == MZ_HOUR_THRESHOLDS[ZERO]) 
    ? openLeft.format( "Daily Quest ", tLeftInDQ.quest, tLeftInDQ.hours, "hour(s)" ) + "\n" : "" );
  
  //MZ 6/7 (AHTK) Live Alert
  output += (openZones[6] > MZSchedule._STAT_CLOSE 
    ? openNowIn.format( "MZ7" + (openZones[6]==MZSchedule._STAT_KING?" AHTK":""), "!" ) + "\n" : "" );
  output += (openZones[5] > MZSchedule._STAT_CLOSE 
    ? openNowIn.format( "MZ6" + (openZones[5]==MZSchedule._STAT_KING?" AHTK":""), "!" ) + "\n" : "" );
  
  //MZ 6/7 Opening Alert
  //Makes sure that AHTK MZs don't just look at hours, but also makes sure it will happen the same day.
  output += ( (tUntilM7A.days == ZERO && MZ_HOUR_THRESHOLDS.indexOf(tUntilM7A.hours) > -1) 
    ? openNowIn.format( "MZ7 AHTK", " in " + tUntilM7A.hours + " hour(s)" ) + "\n" : "" );
  output += ( (tUntilM6A.days == ZERO && MZ_HOUR_THRESHOLDS.indexOf(tUntilM6A.hours) > -1) 
    ? openNowIn.format( "MZ6 AHTK", " in " + tUntilM6A.hours + " hour(s)" ) + "\n" : "" );
  output += (MZ_HOUR_THRESHOLDS.indexOf(tUntilM7.hours)  > -1 
    ? openNowIn.format( "MZ7",      " in " + tUntilM7.hours  + " hour(s)" ) + "\n" : "" );
  output += (MZ_HOUR_THRESHOLDS.indexOf(tUntilM6.hours)  > -1 
    ? openNowIn.format( "MZ6",      " in " + tUntilM6.hours  + " hour(s)" ) + "\n" : "" );

  //console.log("test print: " + output);
  
  return output;
} //End of TBonHourAlerts

//Manage when to alert about TB1 Recurring Scheduled Events
function TB1Alerts(time, client, MZSchedule, DQSchedule){
  //Metal Zone updates: 5 hours, 3 hours, 1 hour, 10 minutes, start, 30 left, 10 left
  //Daily Quest: Every 4 hours, last hour, 30 minutes, 10 minutes
  const MIN_THRESHOLDS = [30, 50], ZERO = 0;
	
  if( MIN_THRESHOLDS.indexOf(time.getMinutes()) > -1 || time.getMinutes() == ZERO ){
		var alertString = "";
		
    //Immediacy Alerts
    //(30 and 10) minutes left check
    //Order: Daily Quest -> MZ Closing -> MZ Opening
    if( MIN_THRESHOLDS.indexOf(time.getMinutes()) > -1 ){
      console.log("time is: " + time.toUTCString());
      alertString = TBmidHourAlerts(time, DQSchedule, MZSchedule);
    }//End of Immediacy Alerts
    
    //On-the-hour Alerts
    else if(time.getMinutes() == ZERO){
      console.log("time is: " + time.toUTCString());
      alertString = TBonHourAlerts(time, DQSchedule, MZSchedule);
    }//End of On-the-hour Alerts
    
    if (alertString.length > 0){
      const tb1General = client.channels.find("name", "tb1-bot-alerts");
      tb1General.send(alertString);
    }
  }
}

function intervalAlert(client, MZSchedule, DQSchedule){
	var time = new Date(); time.setSeconds(0); time.setMilliseconds(0);
	//console.log("time is: " + time.toUTCString());
	/*print(time.toString());
	if(time.getMinutes() == 0){
		print("New Hour!");
	}*/
	
	TB1Alerts(time, client, MZSchedule, DQSchedule);
}

 
module.exports = intervalAlert;
