/*
 * Created:				  13 Sept 2017
 * Last updated:		15 Sept 2017
 * Developer(s):		CodedLotus
 * Description:			Returns the shutdown function for the bot
 * Version #:			  1.1.0
 * Version Details:
		1.0.0: document created with frequently experimented functions
		1.1.0: Changed function parameters, function trigger conditions
 */

//var MZSchedule = require("./MZTable");
//var DQSchedule = require("./DQTable"); 

const Discord = require('discord.js');
const customErrors = require('./../constants/errors');
const roleNames = require('./../constants/role_maps');
const botData = require('./../constants/token');

//Shut down server (on emergency or for updates)
function onShutDown(client, command){
  
  try{
    const guild = client.guilds.find("name", "Terra Battle"), message = command.message;
    const guildMember = guild.members.get(message.author.id);
    const guildMemberHighestRole = guildMember.highestRole.name.toLowerCase();
    
    if ( message.author.id == botData.owner 
      || roleNames.adminRoles.some(x => guildMemberHighestRole.includes(x))) {
    
      //console.log("Kweh! (chocobot out!)");
      message.channel.send("Kweh! (chocobot out!)");
      
      const author = message.author, channel = message.channel;
      const server = message.guild;
      /*client.destroy((err) => {
        console.log(err);
      });*/
      console.log(customErrors.getShutDownError().message);
      console.log("user: " + author.username + " id: " + author.id);
      console.log("channel id: " + channel.id);
      ( channel instanceof Discord.GuildChannel ?
        console.log("server: " + server.name + " id: " + server.id) : "");
      
      delete author, server;
      
      //Discord Client Logout
      client.destroy();
      //Node.js process exit
      setTimeout(process.exit, 1*1000);
    }
    else { message.channel.send("Kweh (lol nope)"); }
  } catch (err) { 
    //Could not get user role
    console.log(err.message);
  }
}



module.exports = onShutDown;
