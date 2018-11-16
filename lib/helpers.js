const crypto = require('crypto');
const config = require('./config');
const https = require('https');
var queryString = require('querystring');

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

//integrating with stripe
helpers.processPayment = (amountInCents, sourceToken) => {
    amountInCents = typeof(amountInCents) === 'number' && amountInCents > 0 ? amountInCents: false;
    sourceToken = typeof(sourceToken) === 'string' && sourceToken.trim().length > 0? sourceToken: false;
    if (amountInCents && sourceToken) {
        return new Promise((resolve, reject) => {
            var payload = {
                'amount' : amountInCents,
                'currency': config.stripe.currency,
                'description': config.stripe.description,
                'source': sourceToken
            };

            var stringPayload = queryString.stringify(payload);

            var requestDetails = {
                'protocol': 'https:',
                'hostname': 'api.stripe.com',
                'method': 'POST',
                'path': '/v1/charges',
                'auth': config.stripe.apiKey + ':',
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(stringPayload)
                }
            };

            //instantiate the request object
            var req = https.request(requestDetails, function(res) {
                var status = res.statusCode;

                if (status === 200 || status === 201) {
                    resolve(status);
                } 
                else {
                    console.log('got error: ', status);
                    reject(status, {'Error': 'some error'})
                }
            });

            req.on('error', function(e) {
                console.log('got error1', e);
                reject(500, {'Error': 'some errora'})
            });

            req.write(stringPayload);

            req.end();
        });
    }
    else {
        return Promise.reject({'status': 400, 'Error': 'Invalid/missing parameters'});
    }
}

module.exports = helpers;
