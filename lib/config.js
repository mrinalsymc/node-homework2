/**
 * Define the confiuration for the project
 *
 */

var environments = {};

environments.staging = {
    'httpPort': 3000,
    'httpsPort': 3001,
    'envName': 'staging',
    'hashSecret': 'IamASecret'
}

environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production',
    'hashSecret': 'IamAlsoASecret'
}

var currentEnv = typeof(process.env.NODE_ENV) === 'string'? process.env.NODE_ENV: '';
var envToExport = typeof(environments[currentEnv]) === 'object'? environments[currentEnv]: environments.staging;

module.exports = envToExport;