/*
 * Created:				26 June 2017
 * Last updated:		27 July 2017
 * Developer(s):		CodedLotus
 * Description:			Core details and functions of Chocobot
 * Version #:			0.0.5
 * Version Details:
		0.0.0: Core code came from Nazuna Bot
		0.0.1: variable changed to constant
		0.0.2: constant changed to object, and then exportable with function getToken() to return token string.
		0.0.3: Able to pull JSON data and use data to put out information as messages.
		0.0.4: Changed String-based command resolution from if-else to Switch statement-based
		0.0.5: Created commandJSO function to manage command decomposition easier
 * fork sourcecode:		https://github.com/danielmilian90/Nazuna
 */

//console.log("Hello world!");

//import the function getToken() as a part of botCodes to allow access to bot token
const token = require('./constants/token').token;
//const token = require('./constants/token').token;
const customErrors = require('./constants/errors');

//console.log(botCodes.getToken());


const Discord = require('discord.js');
//const commando = require('discord.js-commando');
const client = new Discord.Client();
//const client = new commando.Client();

/* 
 * https://www.sitepoint.com/making-http-requests-in-node-js/
 * Used for HTTP requests for JSON data
 */
var request = require("request");



/*bot.registry.registerGroup('random','Random');
bot.registry.registerDefaults(); //registers bot defaults for the bot
bot.registry.registerCommandsIn(__dirname + "/commands")*/

function commandIs(str, msg){
    //return msg.content.toLowerCase().startsWith("!" + str);
}

//Return JSO that contains the command, and relevant details following
function commandJSO(msg){
	//check if message actually is a command. If not, return a "no_task" JSO.
	//In the case of not having anything but a trigger, return an "annoyed" JSO
	var msgContent = msg.content, msgContentLower = msg.content.toLowerCase();
	//console.log(msg.content);
	
	/*Checking for cases
	 * A: Command messages with no further details or tasks
	 * B: Messages that aren't commands
	 * C: Commands that start with the bot's nickname
	 * D: Commands that start with the bot's trigger character
	 */
	
	//Manage case A with an object with task "annoyed" to trigger bot's annoyed message
	//TODO: Manage case A part b (bot_nickname resolution) for all cases
	//console.log( (msgContent === "!") + " " + (msgContent === "Chocobot,") );
	//console.log( (!msgContent.startsWith('!')) + " " + ( !msgContent.startsWith("Chocobot,") ) );
	if( msgContentLower === "!" || msgContentLower === "chocobot," ) { return {task: "annoyed"}; }
	//Manage case B with an object with no task to trigger bot's ignore response
	//TODO: Manage case B part b (bot_nickname resolution) for all cases
	//Earlier existing bug: || over && prevented all commands from being read...
	else if ( !msgContentLower.startsWith('!') && !msgContentLower.startsWith("chocobot,") ) { return new Object(); }
	
	
	//Manage case C or D with a JSObject to trigger and fulfil the requirements of said task
	//Remove the command notification trigger, and clean unnecessary whiteSpace
	//sets msgContent to be the substring without header "!"
	else if ( msgContent.startsWith('!') ) { msgContent = msgContent.substr(1).trim(); }
	
	//sets msgContent to be the substring without header "[bot nickname]"
	//TODO: Manage case D part b (bot_nickname resolution) for all cases
	else { msgContent = msgContent.substr("Chocobot,".length).trim(); }
	
	delete msgContentLower;
	
	console.log("current command content: " + msgContent);
	
	//Get the index of the first space. -1 means that it is a no-detail command
	//26 July 2017: Issue where -1 -> 0, causing a (0,0)-exclusive substring fails is resolved
	var indexOfSpace = msgContent.indexOf(' ');
	indexOfSpace = ( ( indexOfSpace == -1 ) ? msgContent.length : indexOfSpace );
	
	//create command to return JSObject to resolve in response to command messages
	var command = new Object();
	command.task = msgContent.substring(0, indexOfSpace).trim().toLowerCase();
	command.details = msgContent.substring(indexOfSpace).trim();
	command.message = msg; //Necessary to manage some content management
	//console.log(command);
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
function onShutDown(message){
	const permissions = message.member.permissions;
	if ( permissions.has("KICK_MEMBERS") ){
	
		//console.log("Kweh! (chocobot out!)");
		message.channel.send("Kweh! (chocobot out!)");
		
		const author = message.author;
		const server = message.guild;
		/*client.destroy((err) => {
			console.log(err);
		});*/
		console.log(customErrors.getShutDownError().message);
		console.log("user: " + author.username + " id: " + author.id);
		console.log("server: " + server.name + " id: " + server.id);
		
		//Discord Client Logout
		client.destroy();
		//Node.js process exit
		process.exit();
	}
	else { message.channel.send("Kweh (lol nope)"); }
}

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

function manageRoles(cmd){
	if (cmd.message.member === null) { return {response: "failure"}; }
	var roles = cmd.details.split(",");
	var guildMember = cmd.message.member;
	const guildRoles = cmd.message.guild.roles;
	var feedback = {response: ""};
	//console.log(guildMember);
	
	//Check to make sure the requested role isn't forbidden
	//Find role in guild's role collection
	//Assign role (or remove role if already in ownership of)
	//Append response of what was done
	roles.forEach(function(entry){
		entry = entry.trim();
		if ( entry.trim().toLowerCase().search("com") == -1 &&
			entry.trim().toLowerCase().search("mod") == -1 &&
			entry.trim().toLowerCase().search("adm") == -1 &&
			entry.trim().toLowerCase().search("ryd") == -1 &&
			entry.trim().toLowerCase().search("bot") == -1 &&
			entry.trim().toLowerCase().search("dyno") == -1 ){
			var role = guildRoles.find("name", entry.trim());
			if(role == null){ feedback.response = feedback.response.concat("Kweh kweh (role " + entry.trim() + " does not exist)\n"); }
			else if( guildMember.roles.has(role.id) ) {
				guildMember.removeRole(role);
				feedback.response = feedback. response.concat("Kweh kweh (role removed: " + entry.trim() + ")\n"); }
			else {
				guildMember.addRole(role);
				feedback.response = feedback.response.concat("Kweh kweh (role assigned: " + entry.trim() + ")\n"); }
		} else { feedback.response = feedback.response.concat("Kweh kweh (I cannot assign " + entry.trim() + " roles)"); }
		guildMember = cmd.message.member;
	});
	//return feedback responses
	return feedback;
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
		} while (count < 5);
		//console.log(x[0]); // print out the 0th JSO
		message.channel.send(response);
		
		//message.channel.send(body); //Voids 2k character limit of Discord messages
		//x = body;
	});
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
			onShutDown(message);
			
			//20 July 2017: Not sure if this message is reached.
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
			message.channel.send("Kweh! ( goo.gl/TeBpEb )");
			break;
			
		case "wiki":
		case "wikia":
			message.channel.send("Kweh! (Coming soon!)");
			break;
		
		case "mz":
		case "metal":
			message.channel.send("Kweh! (Coming soon!)");
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


client.login( token );