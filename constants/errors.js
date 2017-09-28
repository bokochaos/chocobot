/*
 * Created:				  28 June 2017
 * Last updated:		28 June 2017
 * Developer(s):		CodedLotus
 * Description:			Returns errors used to help figure what kind of issues are arising in the bot
 * Version #:			1.0.0
 * Version Details:
		1.0.0: document created with ShutDownError
		1.0.1: 
		1.0.2: 
 */
module.exports = {
	getShutDownError: function (){
		return {name: "ShutDownError", message: "Bot shutdown on user request"};
	}
}