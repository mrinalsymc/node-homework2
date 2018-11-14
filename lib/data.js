const fs = require('fs');
const path = require('path');
const util = require('util');
var helpers = require('./helpers');
var debug = util.debuglog('data');

var lib = {};
lib.baseDir = path.join(__dirname + './../.data/');

lib.create = (dir, file, data) => {
    return new Promise((resolve, reject) => {
        fs.open(lib.baseDir + dir + '/' + file + '.json', 'wx', function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
                var stringData = JSON.stringify(data);
                fs.writeFile(fileDescriptor, stringData, function(err) {
                    if (err) {
                        debug('error writing file : ', err);
                        reject('error writing file');
                    }
                    else {
                        fs.close(fileDescriptor, function(err) {
                            if (err) {
                                debug('error closing file : ', err);
                                reject('error closing file');
                            }
                            else {
                                debug('resolved : ');
                                resolve();
                            }
                        })
                    }
                });
            }
            else {
                debug('create : ','Already existing file');
                reject('Already existing file');
            }
        });
    });
};

lib.read = (dir, file) => {
    return new Promise((resolve, reject) => {
        fs.readFile(lib.baseDir + dir + '/' + file + '.json', 'utf8', function (err, data) {
            if (!err && data) {
                var parsedData = helpers.parseJsonStringToObject(data);
                resolve(parsedData);
            }
            else {
                debug('error reading file : ', err);
                reject(err, data);
            }
        }); 
    });
};

lib.update = (dir, file, data) => {
    return new Promise((resolve, reject) => {
        fs.open(lib.baseDir + dir + '/' + file + '.json', 'r+', function (err, fileDescriptor) {
            if (!err && fileDescriptor) {
                var stringData = JSON.stringify(data);
                fs.truncate(fileDescriptor, function(err){
                    if (err) {
                        debug('error truncating file : ', err);
                        reject('error truncating file');
                    }
                    else {
                        fs.writeFile(fileDescriptor, stringData, function(err) {
                            if (err) {
                                debug('error writing file : ', err);
                                reject('error writing file');
                            }
                            else {
                                fs.close(fileDescriptor, function(err) {
                                    if (err) {
                                        debug('error closing : ', err);
                                        reject('error closing file');
                                    }
                                    else {
                                        resolve();
                                    }
                                })
                            }
                        });
                    }
                });
            }
            else {
                debug('could not open the file for updating. It may not exist yet : ', err);
                reject('could not open the file for updating. It may not exist yet');
            }
        });
    });
};

lib.delete = (dir, file) => {
    return new Promise((resolve, reject) => {
        fs.unlink(lib.baseDir + dir + '/' + file + '.json', function(err) {
            if (err) {
                debug('error deleting the file : ', err);
                reject('error deleting the file');
            }
            else {
                resolve();
            }
        });
    });
};

module.exports = lib;