const crypto = require('crypto');
const config = require('./config');

var helpers = {};

helpers.hash = function (str) {
    if (typeof(str) === 'string' && str.trim().length > 0) {
        return crypto.createHmac('sha512', config.hashSecret).update(str).digest('hex');
    }
    else {
        return  false;
    }
};

helpers.parseJsonStringToObject = function(str) {
    try {
        var obj = JSON.parse(str);
        return obj;
    }
    catch (err) {
        console.log('error while parsing : ', str);
        return false;
    }
};

helpers.createRandomString = function(strLength){
    strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false;
    if(strLength){
        // Define all the possible characters that could go into a string
        var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
        // Start the final string
        var str = '';
        for(i = 1; i <= strLength; i++) {
            // Get a random charactert from the possibleCharacters string
            var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));
            // Append this character to the string
            str+=randomCharacter;
        }
        // Return the final string
        return str;
    } else {
        return false;
    }
};

module.exports = helpers;
