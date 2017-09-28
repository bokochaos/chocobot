/*
 * Created:				  26 June 2017
 * Last updated:		27 Sept 2017
 * Developer(s):		CodedLotus
 * Description:			Core details and functions of Chocobot
 * Version #:			  1.0.2
 * Version Details:
		0.0.0: Core code came from Nazuna Bot
		0.0.1: variable string storing bot token changed to constant
		0.0.2: constant string storing bot token changed to object, and then exportable with function getToken() to return token string.
		0.0.3: Able to pull JSON data and use data to put out information as messages.
		0.0.4: Changed String-based command resolution from if-else to Switch statement-based
		0.0.5: Created commandJSO function to manage command decomposition easier
		0.0.8: Role functionality ~90% done. Bot token turned to external exported string.
		0.0.9: Early Wikia search in development.
		0.1.0: Full-Schedule Metal Zone look-ahead functionality added to the bot.
		1.0.0: Multi-functional bot "fork" (Hisobot) released for Discord use via GCE (21 Aug 2017)
		1.0.2: Partial-Schedule Metal Zone look-ahead functionality extended Full-Schedule look-ahead; Chocobot updated with Hisobot functionality
 * fork sourcecode:		https://github.com/danielmilian90/Nazuna
 */

//console.log("Hello world!");

//import "external" botData to allow access to bot token and other data
const botData = require('./constants/token').botData;
//const token = require('./constants/token').token;
const customErrors = require('./constants/errors');

//TB data imports
const SKILLS = require('./constants/skills_data').Skills;

//r/TB Discord role names anmd alterations
var roleNames = require('./constants/role_maps');
//TODO: make this into a DB system that allows for better name association management

/* Metal Zone Tracker */
const MZSchedule = require("./constants/MZTable");

/* Daily Quest Tracker */
const DQSchedule = require("./constants/DQTable");


const Discord = require('discord.js');
//const commando = require('discord.js-commando');
const client = new Discord.Client();
//const client = new commando.Client();

/* 
 * https://www.sitepoint.com/making-http-requests-in-node-js/
 * Used for HTTP requests for JSON data
 */
var request = require("request");



/*
 * Helper Functions that I will use frequently
 *
 */

//Check if string has substring
function hasSubstr(str, searchStr){
	return str.search(searchStr) > 0;
}

//Check what role the user has that elevates their permissions
function checkHoistRole(cmd){
	return cmd.message.member.hoistRole;
	
}

/*bot.registry.registerGroup('random','Random');
bot.registry.registerDefaults(); //registers bot defaults for the bot
bot.registry.registerCommandsIn(__dirname + "/commands")*/

function commandIs(str, msg){
    //return msg.content.toLowerCase().startsWith("!" + str);
}

//Return JSO that contains the command, and relevant details following
//Return JSO that contains the command, and relevant details following
function commandJSO(msg){
	//check if message actually is a command. If not, return a "no_task" JSO.
  //In the case of not having anything but a trigger, return an "annoyed" JSO
	var msgContent = msg.content, msgContentLower = msg.content.toLowerCase();
  
  const msgPrefixes  = botData.commandPrefixes,
        thankYou     = [ "thank you", "thanks"],
        sorry        = [ "sorry", "im sorry", "i'm sorry"],
        praiseYamcha = [ "praiseyamcha", "praise yamcha"],
        hisoNames    = [ "hisobot", "hisoguchi"];
	
	/*Checking for cases
	 * A: Command messages with no further details or tasks
	 * B: Messages that aren't commands
	 * C: Commands that start with the bot's nickname
	 * D: Commands that start with the bot's trigger character
	 */
	
  
  //Manage case A with an object with task "annoyed" to trigger bot's annoyed message
	//TODO: Manage case A part b (bot_nickname resolution) for all cases
	if( msgPrefixes.some( x => x === msgContentLower) ) { return {task: "annoyed"}; }
  //if( msgContentLower === "!" || msgContentLower === "hisobot," || msgContentLower === "hisoguchi," ) { return {task: "annoyed"}; }
	//Manage case B with an object with no task to trigger bot's ignore response (or prevent a botception)
	//TODO: Manage case B part b (bot_nickname resolution) for all cases
	//Earlier existing bug: || over && prevented all commands from being read...
  else if ( msg.author.bot || !(msgPrefixes.some(x => msgContentLower.startsWith(x))) ) { return new Object(); }
  //else if ( message.author.bot || (!msgContentLower.startsWith('!') && !msgContentLower.startsWith("hisobot,") && !msgContentLower.startsWith("hisoguchi,") ) ) { return new Object(); }
	
	
	//Manage case C or D with a JSObject to trigger and fulfil the requirements of said task
	//Remove the command notification trigger, and clean unnecessary whiteSpace
	//sets msgContent to be the substring without header "!"
	else if ( msgContent.startsWith(msgPrefixes[0]) ) { msgContent = msgContent.slice(1).trim(); }
	
	//sets msgContent to be the substring without header "Hisobot"
	else if ( msgContentLower.startsWith(msgPrefixes[1]) ) { msgContent = msgContent.slice(msgPrefixes[1].length).trim(); }
	
	//sets msgContent to be the substring without header "[bot nickname]" ATM managed as Hisoguchi
	//TODO: Manage case D part b (bot_nickname resolution) for all cases
	//else { msgContent = msgContent.slice(msgPrefixes[2].length).trim(); }
	
	delete msgContentLower;
	
	console.log("current command content: " + msgContent + " by: " + msg.author.username + " in: " + msg.channel );
  //if(msg.guild !== null){console.log("Guild is: " + msg.guild);}
	
	//set pmFlag on command if (-)pm command flag has been set in command details
	var pmFlag = (hasSubstr(msgContent, "-pm") || hasSubstr(msgContent, "pm"));
	if (pmFlag) {msgContent = msgContent.replace(/-?pm/gi, "").trim();}
  
  //Get the index of the first space. -1 means that it is a no-detail command
	//26 July 2017: Issue where -1 -> 0, causing a (0,0)-exclusive substring fails is resolved
	var indexOfSpace = msgContent.indexOf(' ');
	indexOfSpace = ( ( indexOfSpace == -1 ) ? msgContent.length : indexOfSpace );
	
	//create command to return JSObject to resolve in response to command messages
	var command = new Object();
	command.task = msgContent.substring(0, indexOfSpace).trim().toLowerCase();
	command.details = msgContent.substring(indexOfSpace).trim();
	command.message = msg; //Necessary to manage some content management
	command.pmUser = pmFlag;
	//console.log(command.pmUser + " : " + command.task);
	return command;
}

function pluck(array){
    return array.map(function(item) {return item["name"];});
}

function hasRole(mem, role){
    if(pluck(mem.roles).includes(role)){
        return true;
    } else {
        return false;
    }
}/**/

function onStart(){
	console.log("Kweh! (chocobot online!)");
	//message.channel.send("Kweh! (chocobot online!)");
}

/*function onRest(){
	console.log("Kweh~ (nap time~)");
	message.channel.send("Kweh~ (nap time~)");
}*/

//Shut down server (on emergency or for updates)
const onShutDown = require("./events/onShutDown");

/*function onShutDown(message){
  const guild = client.guilds.find("name", "Terra Battle");
  const guildMember = guild.members.get(message.author.id);
  const guildMemberHighestRole = guildMember.highestRole.name.toLowerCase();
  console.log(guildMemberHighestRole);
	//const permissions = message.member.permissions;
	if ( message.author.id == botData.owner 
    || roleNames.adminRoles.some(x => guildMemberHighestRole.includes(x))) {
	
		//console.log("Kweh! (chocobot out!)");
		message.channel.send("Kweh! (chocobot out!)");
		
		const author = message.author, channel = message.channel;
		const server = message.guild;
		
		console.log(customErrors.getShutDownError().message);
		console.log("user: " + author.username + " id: " + author.id);
    console.log("channel id: " + channel.id);
		( channel instanceof Discord.GuildChannel ?
      console.log("server: " + server.name + " id: " + server.id) : "");
		
		delete author, server;
		
		//Discord Client Logout
		client.destroy();
		//Node.js process exit
		process.exit();
	}
	else { message.channel.send("Kweh (lol nope)"); }
}*/

//Feed the chocobot Gysahl Greens (for fun)
function manageFeeding(details) {
	var response;
	switch(details.toLowerCase()){
		case "greens":
			response = "Kweh? (food?)\n*eats greens*";
			break;
		default:
			response = "KWEH! KWEH! (HEY! THAT'S NOT FOOD!)";
	}
	return response;
}

//Add server roles to user based on command details
function manageRoles(command){
  try{
    const channel = command.message.channel, guild = client.guilds.find("name", "Terra Battle");

    if( channel instanceof Discord.GuildChannel && channel.name !== "bot-use" ){
      //console.log("Wrong channel reception");
      sendMessage(command, "Sorry, " + command.message.author.username + " let's take this to #bot-use");
      return;
    }
    const openRoles = roleNames.openRoles, voidRoles = roleNames.voidRoles;
    const guildRoles = guild.roles; //command.message.guild.roles;
    var roles = command.details.split(","),  guildMember = guild.members.get(command.message.author.id);
    
    var feedback = "";
    
    //Check to make sure the requested role isn't forbidden
    //Find role in guild's role collection
    //Assign role (or remove role if already in ownership of)
    //Append response of what was done to "feedback"
    roles.forEach(function(entry){
      entry = entry.trim();
      lowCaseEntry = entry.toLowerCase();
      
      //Ignore any attempts to try to get a moderator, admin, companion, bot, or specialty role.
      //Ignore: metal minion, wiki editor, content creator, pvp extraordinare
      /*voidRoles.forEach(
        function(currentValue){
          
        }
       );*/ //TODO: Manage Void Role rejection more elegantly
      if (!(voidRoles.some( x => lowCaseEntry.includes(x) )) ){
        
        //run requested role name through the roleName DB
        var roleCheck = openRoles.get(lowCaseEntry); //TODO: Make a DB that allows for server-specific role name checks
        var role;
        
        try{ role = guildRoles.find("name", roleCheck); }
        catch (err) { 
          //Role didn't exist
          console.log(err.message);
          console.log("User: " + command.message.author.name);
        }
        
        if( typeof role === 'undefined' || role == null ){ feedback += "So... role '" + entry + "' does not exist\n"; }
        else if( guildMember.roles.has(role.id) ) {
          guildMember.removeRole(role);
          feedback += "I removed the role: " + role.name + "\n"; }
        else {
          guildMember.addRole(role);
          feedback += "I assigned the role: " + role.name + "\n"; }
      } else { feedback += "FYI, I cannot assign '" + entry + "' roles"; }
      //guildMember = command.message.member;
    });
    //return feedback responses
    ( feedback.length > 0 ? command.message.channel.send(feedback) : "" );
  } catch (err) {
    console.log(err.message);
    console.log("User: " + command.message.author.username);
  }
}



function hasLambda(str){
	return str.search("lambda") || str.search("^") || str.search("Λ") ;
}

function wikiSearch(cmd){
	var bForCharacter = hasSubstr(cmd.details, "character");
	var bForLambda = hasLambda(cmd.details);
	
	var x = "";
	request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
		//console.log(body);
		message.channel.send("Kweh (Lemme check)");
		x = JSON.parse(body); //x becomes an array of JSOs
		var count = 0, response = "";
		do{
			var link_x = x[count];
			response = response.concat("\t" + link_x.title + ": " + link_x.url + "\n");
			++count;
		} while (count < 1);
		//console.log(x[0]); // print out the 0th JSO
		message.channel.send(response);
		
		//message.channel.send(body); //Voids 2k character limit of Discord messsages
		//x = body;
	});
}

function wikitest(message){
	var x = "";
	request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
		//console.log(body);
		message.channel.send("Kweh (Lemme check)");
		x = JSON.parse(body); //x becomes an array of JSOs
		var count = 0, response = "";
		do{
			var link_x = x[count];
			response = response.concat("\t" + link_x.title + ": " + link_x.url + "\n");
			++count;
			delete link_x;
		} while (count < 1);
		//console.log(x[0]); // print out the 0th JSO
		message.channel.send(response);
		
		//message.channel.send(body); //Voids 2k character limit of Discord messages
		//x = body;
	});
}

function metalZone(cmd){
	
	if (cmd.details == "" || cmd.details == "all") {
		var futureMZSchedule = MZSchedule.getNextZoneSchedule();
		var schedule = "Time remaining until: (D:HH:MM)\n";
		for (var zone = 0; zone < MZSchedule._MAX_ZONE; ++zone){
			schedule += "MZ" + (zone+1) + ": " + futureMZSchedule.openZoneSchedule[zone];
			schedule += "  AHTK" + ": " + futureMZSchedule.openAHTKSchedule[zone] + "\n";
		}
		cmd.message.channel.send(schedule);
	}
	else{
		var futureMZSchedule = "";
		switch (cmd.details){
			case '1': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(1); break;
			case '2': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(2); break;
			case '3': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(3); break;
			case '4': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(4); break;
			case '5': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(5); break;
			case '6': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(6); break;
			case '7': futureMZSchedule = MZSchedule.getSpecificZoneSchedule(7); break;
			default:
				cmd.message.channel.send( "Kweh kweh? (I don't know that zone. You doing okay?)" );
		}
		var schedule = "Time remaining until: (D:HH:MM)\n";
		schedule += "MZ" + cmd.details + ": " + futureMZSchedule.openZoneSchedule;
		schedule += "  AHTK" + ": " + futureMZSchedule.openAHTKSchedule + "\n";
		cmd.message.channel.send(schedule);
	}
}



client.on('ready', () => {
    onStart();
	//console.log('Nazuna is online!');
	//message.channel.send('I'm back!');
});


// Search on wiki

client.on('message', message => {
	
	/*
	 * Command = {
	 *   task:    [task_name_string],
	 *   details: [task_details_string],
	 *   message: [message object issuing command]
	 * }
	 */
	var command = commandJSO(message);
	
	
	switch(command.task){
		case "shutdown":
			onShutDown(client, command);
			
			//20 July 2017: Not sure if this message is reached.
			//01 Aug 2017: Message is reached if the user does not have authorization. Thanks @Paddington for being the first person to test that.
			console.log("Shutdown test message");
			
			//20 July 2017: Is break ever reached if the process kills itself?
			break;
		
		case "role":
		case "roles":
			var Response = manageRoles(command);
			if (Response.response == "failure"){
				message.channel.send("Kweh kweh (This command only works in guild chats)");
			} else { message.channel.send( Response.response ); }
			break;
		
		case "wikitest":
			wikitest(command.message);
			break;
		
		case "greens?":
			message.channel.send("Kweh (Please)");
			break;
		
		case "feed":
			message.channel.send( manageFeeding(command.details) );
			break;
		
		case "command":
		case "commands":
		case "help":
		case "-h":
		case "h":
			message.channel.send("Kweh! (I hide the manual here <goo.gl/TeBpEb>)");
			break;
			
		case "wiki":
		case "wikia":
			message.channel.send("Kweh! (Coming soon!)");
			break;
		
		case "mz":
		case "metal":
			metalZone(command);
			//message.channel.send("Kweh! (Coming soon!)");
			break;
		
		case "name":
			message.channel.send("Kweh (I'm chocobot.)");
			break;
		
		case "annoyed":
			message.channel.send( "Kweh (I'm ignoring you)" );
			break;
		
		case undefined:
			//Cases where it isn't a command message
			//Ignore as if it wasn't a relevant message
			break;
		default:
			//Cases where it isn't a recognized command
			message.channel.send("Kweh? (What?)\nKweh kweh (Run that by me again)");
	}
	
	//if(message.content == 'greens?'){ message.channel.send('Kweh (Please)'); }
	
	//if(message.content == '!feed greens'){ message.channel.send('Kweh? (food?)\n*eats greens*'); /*message.channel.send('*eats greens*');*/  }
    
	/*if(message.content == '!servers'){ 
		message.channel.send("Kweh (lemme check)");
		var servers = client.guilds; //returns a Collection of <Snowflake, Guild>
		
		//returns the number of guilds the bot is associated with
		//message.channel.send(servers.size);
		console.log("# of servers: " + servers.size);
		
		//log into the console the guild object (name) and its id
		//JS maps return value before key
		var iter = servers.forEach(
			(v,k) => {console.log("name:",v.name,"id:", k);}
		);
		
		
		//for (s in servers.values()) {
			//message.channel.send("Server id: " + s.id + " Server Name: " + s.name);
			//console.log(s.name);
		//}
	}*/
	
	/*if(message.content == "!wikitest"){
		var x = "";
		request("http://terrabattle.wikia.com/wiki/Special:Search?search=Nazuna&fulltext=Search&format=json", function(error, response, body) {
			//console.log(body);
			message.channel.send("Kweh (Lemme check)");
			x = JSON.parse(body); //x becomes an array of JSOs
			var count = 0, response = "";
			do{
				var link_x = x[count];
				response = response.concat("\t" + link_x.title + ": " + link_x.url + "\n");
				++count;
			} while (count < 5);
			//console.log(x[0]); // print out the 0th JSO
			message.channel.send(response);
			
			//message.channel.send(body); //Voids 2k character limit of Discord messages
			//x = body;
		});
		//console.log(x);
	}*/
	
	/*if(message.content == "!shutdown"){
		onShutDown(message);
	}*/
	/*var args = message.content.split(/[ ]+/);
    var i;
    var longName = "";

    if (commandIs("wiki", message)){
        if (args.length === 1){
            message.channel.send('What do you want to look for? ^^. Usage: `!wiki [search term]`');
        } else if (args.length === 2){
                if (args[1] === 'Mizell' || args[1 === 'mizell']){
                    message.channel.send('Oh, it looks like you made a typo. Don\'t worry I got you! ^^ http://terrabattle.wikia.com/wiki/Nazuna');
                } else {
                    if (args[1].charAt(args[1].length-1) === '^') {
                        
                        args[1].slice(0,-1);
                        message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1,-1).toLowerCase()+'_Λ');
                        
                    } else {
                    message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase());
                }    
            }
        } else {
                longName = args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()
            for (i=2; i<args.length; i++){
                longName += "_"+args[i].charAt(0).toUpperCase()+args[i].slice(1).toLowerCase();     
                }
              message.channel.send('http://terrabattle.wikia.com/wiki/'+ longName); 
        }        
    }
    if (commandIs("recode", message)){
        message.channel.send('http://terrabattle.wikia.com/wiki/'+ args[1].charAt(0).toUpperCase()+args[1].slice(1).toLowerCase()+'_Λ');
    }
    if (commandIs("tbcompendium", message)){
        message.channel.send('http://tbc.silverdb.it');
    }
    if (commandIs("tbstats", message)){
        message.channel.send('http://tbs.desile.fr/#/quick-start');
    }
    if (commandIs("chapter", message)){
        var chop ="";
        chop = args[0].substring(1);    
        message.channel.send('http://terrabattle.wikia.com/wiki/'+chop.charAt(0).toUpperCase()+chop.slice(1).toLowerCase()+'_'+args[1]+'#'+args[1]+'.'+args[2]);
    }


    if(commandIs("role", message)){
        let role = message.guild.roles.find("name",'Owner');
        let member = message.guild.member(message.author);
        member.addRole (role).catch(console.error);
    }
        // client.on('guildRole', guild =>{
        // if (args.length === 2){
        //     message.channel.send('You got the role '+args[1]);
        //     guild.member(message.author).addRole(args[1]).catch(Error => console.log(Error));    
        //     } else {
        //         message.channel.send('Error');
        //     }
        // })*/

});

// client.on('guildRole', guild =>{
//     var args = message.content.split(/[ ]+/);
//         if (args.length === 2){
//             message.channel.send('You got the role '+args[1]);
//             guild.member(message.author).addRole(args[1]).catch(Error => console.log(Error));    
              
//         } else {
//             message.channel.send('Error');
//         }
//     });


client.login( botData.token );