var _data = require('./data');
var helpers = require('./helpers');
const util = require('util');
var debug = util.debuglog('handlers');

var handlers = {};

handlers.notFound = data => {
    return Promise.reject({'status': 404, 'Error': 'not found'});
}

handlers.users = data => {
    const acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) !== -1) {
        return handlers._users[data.method](data);
    }
    else {
        return Promise.reject({'status': 405, 'Error': 'unacceptable method used'});
    }
}

handlers._users = {};

/**
 * Sample
 {
	"name":"mrinal",
	"email":"mrinal1@email.com",
	"address":"Some address",
	"password":"qwer1234"
}
 */
handlers._users.post = data => {
    return new Promise((resolve, reject) => {
        //Validating the inputs
                        
        var name = typeof(data.payload.name) === 'string' && data.payload.name.trim().length > 0? data.payload.name.trim(): false;
        var address = typeof(data.payload.address) === 'string' && data.payload.address.trim().length > 0? data.payload.address.trim(): false;
        var email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 0? data.payload.email.trim(): false;
        var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0? data.payload.password.trim(): false;
    
        if (name && address && email && password) {
            //checking if the user with same name already exists.
            _data.read('users', email).then(() =>{ 
                debug('User already exists');
                reject({'status': 400, 'Error': 'User already exists'});
            }).catch((err, data) => {
                //implies user does not exist

                //hash the password
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    var userObject = {
                        'name' : name,
                        'hashedpassword': hashedPassword,
                        'email': email,
                        'address': address
                    };
                    _data.create('users', email, userObject).then(() => {
                        resolve({'status': 200, 'data': {}});
                    }).catch (err => {
                        debug('Unable to create user', err);
                        reject({'status': 500, 'Error': err});
                    });
                }
                else {
                    debug('Unable to generate hashed password');
                    reject({'status': 500, 'Error': 'Internal Error. Unable to generate hashed password'});
                }

            });
        }
        else {
            debug('Invalid Inputs');
            reject({'status': 400, 'Error': 'Invalid Inputs'});
        }
        
    });
}

handlers.login = data => {
    const acceptableMethods = ['post'];
    if (acceptableMethods.indexOf(data.method) !== -1) {
        return handlers._login[data.method](data);
    }
    else {
        return new Promise.reject({'status': 405, 'Error': 'unacceptable method used'});
    }
}

handlers._login= {};

// Required data : phone number and password.
handlers._login.post = data => {
    return handlers.createToken(data);
};

handlers.logout = data => {
    const acceptableMethods = ['get'];
    if (acceptableMethods.indexOf(data.method) !== -1) {
        return handlers._logout[data.method](data);
    }
    else {
        return Promise.reject({'status': 405, 'Error': 'unacceptable method used'});
    }
}

handlers._logout= {};

// Required data : only token id
handlers._logout.get = data => {
    return handlers.deleteToken(data);
};

handlers.createToken = data => {
    return new Promise((resolve, reject) => {
        var email = typeof(data.payload.email) === 'string' && data.payload.email.trim().length > 0? data.payload.email.trim(): false;
        var password = typeof(data.payload.password) === 'string' && data.payload.password.trim().length > 0? data.payload.password.trim(): false;
        
        if (email && password) {
            _data.read('users', email).then(userData => {
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    if (hashedPassword === userData.hashedpassword) {
                        var tokenId = helpers.createRandomString(20);
                        var expires = Date.now() + 1000 * 60 * 60;
                        var tokenObject = {
                            'id': tokenId,
                            'expires': expires,
                            'email': email
                        };
                        _data.create('tokens', tokenId, tokenObject).then(() => {
                            resolve({'status': 200, 'data': tokenObject});
                        }).catch (err => {
                            debug('not able to create a token');
                            reject({'status': 500, 'Error': 'not able to create a token'});
                        });
                    }
                    else {
                        debug('Incorrect password');
                        reject({'status': 400, 'Error': 'Incorrect password'});
                    }
                }
                else {
                    debug('Unable to generate hashed password');
                    reject({'status': 500, 'Error': 'Error creating hashed password'});
                }
                    
            }).catch(err => {
                debug('User does not exist');
                reject({'status': 400, 'Error': 'user does not exist'});
            }); 
        }
        else {
            debug('missing required fields');
            reject({'status': 400, 'Error': 'missing required fields'});
        }
    });
};

handlers.deleteToken = data => {
    return new Promise((resolve, reject) => {
        var id = typeof(data.queryStringObj.id) === 'string' && data.queryStringObj.id.trim().length === 20? data.queryStringObj.id.trim(): false;
        if (id) {
            _data.delete('tokens', id).then(() => {
                resolve({'status': 200});
            }).catch (err => {
                reject({'status': 400, 'Error': 'Unable to delete token'});
            });
        }
        else {
            reject({'status': 400, 'Error': 'incorrect ID passed'});
        }
    });
    
};

module.exports = handlers;