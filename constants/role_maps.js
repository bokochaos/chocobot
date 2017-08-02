/*
 * Created:				01 Aug 2017
 * Last updated:		01 Aug 2017
 * Developer(s):		CodedLotus
 * Description:			Return a Discord.JS Collection object with pairs for names
 * Version #:			1.0.0
 * Version Details:
		1.0.0: "Constant" list of names used until live database is built
		
 */

const Collection = require('../discord.js/util/Collection');

/**
 *  A collection of role names and their alternate names that pertain to roles within the /r/TerraBattle subreddit
 * @type {Collection<string,string>}
 */
var roleNames = new Collection();

exports.roleNames = roleNames;