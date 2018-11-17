/**
 * Define the confiuration for the project
 *
 */

var environments = {};

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashSecret': 'IamASecret',
    'stripe' : {
        'apiKey': 'sk_test_4eC39HqLyjWDarjtT1zdp7dc',
        'description': 'Mrinal\'s market',
        'currency': 'usd'
    },
    'mailgun': {
        'authuser': '<use your own>',
        'authpassword': '<use your own>',
        'from': '<use your own>',
        'subject': 'Receipt from Mrinal\'s pizza place',
        'msg': 'Hello first_name,\n Here are the item(s) you ordered.\n shopping_cart',
        'server': '<use your own>'
    }
}

environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashSecret': 'IamAlsoASecret',
    'stripe' : {
        'apiKey': '',
        'description': '',
        'currency': ''
    },
    'mailgun': {
        'authuser': '',
        'authpassword': '',
        'from': '',
        'subject': '',
        'msg': '',
        'server':''
    }
}

var currentEnv = typeof(process.env.NODE_ENV) === 'string'? process.env.NODE_ENV: '';
var envToExport = typeof(environments[currentEnv]) === 'object'? environments[currentEnv]: environments.staging;

module.exports = envToExport;