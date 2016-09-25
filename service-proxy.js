/*
 * This NodeJS server proxies an HTTP post-deploy webhook from Heroku to
 * a Travis CI endpoint, in order to automatically trigger API tests.
 *
 */

var http = require('http');
var request = require('request');
var dispatcher = require('httpdispatcher');

const PORT = 8080;

const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;
const TOKEN = process.env.TOKEN;

function checkEnvVars() {
    if(REPO_OWNER == null) {
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

function handleReq(request, response) {
    try {
        console.log('Mapped ' + request.url);
        console.log();
        dispatcher.dispatch(request, response);
    }
    catch(except) {
        console.log(except);
    }
}

function setMappings(dispatcher) {

    dispatcher.setStatic('resources');

    dispatcher.onPost("/pacmacro/pm-server/apitests", function(req, response) {
        console.log('Sending HTTP request:');
        console.log('  ' + travisHttpTarget.method + " " + travisHttpTarget.host + travisHttpTarget.path);
        console.log('  Headers: ' + JSON.stringify(travisHttpTarget.headers));
        console.log();

        request.post(travisHttpTarget, function(error, response, body) {
            console.log('Response: ');
            console.log('  HTTP ' + response.statusCode);
            console.log('  Headers: ' + JSON.stringify(response.headers));
            console.log('  Body: ' + JSON.stringify(body));
            console.log();
        })

        response.writeHead(201);
        console.log('Returning request with HTTP status code ' + response.statusCode);
        console.log();
        response.end();
    });

}

checkEnvVars();

var server = http.createServer(handleReq);
setMappings(dispatcher);

server.listen(PORT, function() {
    console.log('Service Proxy is currently running on http://localhost:%s.', PORT);
    console.log();
});
