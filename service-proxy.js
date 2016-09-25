/*
 * This NodeJS server proxies an HTTP post-deploy webhook from Heroku to
 * a Travis CI endpoint, in order to automatically trigger API tests.
 *
 */

var http = require('http');
var request = require('request');
var dispatcher = require('httpdispatcher');

const PORT = process.env.PORT || 8080;

const MAPPING = process.env.MAPPING;
const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const TOKEN = process.env.TOKEN;

function checkEnvVars() {
    if(MAPPING == null) {
        exitForMissingVariable('MAPPING');
    }
    else if(REPO_OWNER == null) {
        exitForMissingVariable('REPO_OWNER');
    }
    else if(REPO_NAME == null) {
        exitForMissingVariable('REPO_NAME');
    }
    else if(TOKEN == null) {
        exitForMissingVariable('TOKEN');
    }

    function exitForMissingVariable(varName) {
        console.log('Error: Environment variable ' + varName + ' cannot be null.');
        console.log('Exiting process.')
        process.exit(1);
    }
}

var travisHttpTarget = {
    uri: 'https://api.travis-ci.org',
    path: '/repo/' + REPO_OWNER + '%2F' + REPO_NAME + '/requests',
    method: 'POST',
    headers: {
        'Travis-API-Version': 3,
        'Authorization': TOKEN
    }
};

// This function declaration sends a POST request and logs both the request
// and response.
function sendHttpPost(httpTarget) {
    console.log('Sending HTTP request:');
    console.log('  ' + httpTarget.method + " " + httpTarget.host + httpTarget.path);
    console.log('  Headers: ' + JSON.stringify(httpTarget.headers));
    console.log();

    request.post(httpTarget, function(error, response, body) {
        console.log('Received HTTP response:');
        console.log('  HTTP ' + response.statusCode);
        console.log('  Headers: ' + JSON.stringify(response.headers));
        console.log('  Body: ' + JSON.stringify(body));
        console.log();
    })
}

function setMappings(dispatcher) {

    dispatcher.onPost(MAPPING, function(req, response) {
        sendHttpPost(travisHttpTarget);
        response.writeHead(201);
        console.log('Replying to request with HTTP ' + response.statusCode);
        console.log();
        response.end();
    });

}

checkEnvVars();
setMappings(dispatcher);

var server = http.createServer(function(request, response) {
    console.log('Mapped ' + request.url);
    console.log();
    try {
        dispatcher.dispatch(request, response);
    }
    catch(except) {
        console.log("Error: " + except);
    }
});
server.listen(PORT, function() {
    console.log('Service Proxy is currently running on http://localhost:%s.', PORT);
    console.log();
});
