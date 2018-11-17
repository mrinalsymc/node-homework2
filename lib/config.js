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
        'authuser': 'api',
        'authpassword': 'e1770e588102383a0838d593733561e4-9525e19d-e46ef26e',
        'from': 'postmaster@sandboxe04e5c59e224421fa4e60d8611b49f08.mailgun.org',
        'subject': 'Receipt from Mrinal\'s pizza place',
        'msg': 'Hello first_name,\n Here are the item(s) you ordered.\n shopping_cart',
        'server': 'sandboxe04e5c59e224421fa4e60d8611b49f08.mailgun.org'
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