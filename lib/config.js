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
    }
}

var currentEnv = typeof(process.env.NODE_ENV) === 'string'? process.env.NODE_ENV: '';
var envToExport = typeof(environments[currentEnv]) === 'object'? environments[currentEnv]: environments.staging;

module.exports = envToExport;