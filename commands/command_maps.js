/*
 * Created:				  05 Sep 2017
 * Last updated:		05 Sep 2017
 * Developer(s):		CodedLotus
 * Description:			Return a Discord.JS Collection object with pairs for command names
 * Version #:			1.0.0
 * Version Details:
		1.0.0: "Constant" list of names used until live database is built
		
 */

//const Collection = require('../discord.js/util/Collection');

/**
 *  A collection of command names and their alternate names that pertain to commands within the /r/TerraBattle subreddit
 * @type {Collection<string,string>}
 */
var cmdNames = new Map();
const cmdStrings = ["metal.js", "role.js", "wikitest.js", "hungry.js", "help.js", "annoyed.js", "arachnobot.js", "vh.js", "repo.js", "name.js", "shutdown.js"];

roleNames.set("metal", "metal.js");
roleNames.set("mz", "metal.js");

roleNames.set("role", "role.js");
roleNames.set("roles", "role.js");

roleNames.set("wikitest", "wikitest.js");

roleNames.set("hungry?", "hungry.js");

roleNames.set("help", "help.js");
roleNames.set("h", "help.js");
roleNames.set("-h", "help.js");
roleNames.set("command", "help.js");
roleNames.set("commands", "help.js");

roleNames.set("annoyed", "annoyed.js");

roleNames.set("arachnobot", "arachnobot.js");

roleNames.set("vh", "vh.js");
roleNames.set("vengeful", "vh.js");

roleNames.set("repo", "repo.js");

roleNames.set("name", "name.js");

roleNames.set("shutdown", "shutdown.js");

roleNames.set("reload", "reload.js");


exports.roleNames = roleNames;