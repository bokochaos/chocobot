/*
 * Created:				26 June 2017
 * Last updated:		27 July 2017
 * Developer(s):		CodedLotus
 * Description:			Return function that obscures Discord bot token from GitHub repository
 * Version #:			1.0.3
 * Version Details:
		1.0.0: variable held the token string
		1.0.1: variable changed to constant
		1.0.2: constant changed to object, and then exportable with function getToken() to return token string.
		1.0.3: added a more direct method to accessing the bot token
 */

exports.token = '***INSERT DISCORD BOT TOKEN HERE***';

exports.options = {
	owner: '**INSERT USER ID HERE***',
	commandPrefix: '!'
};