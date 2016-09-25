/*
 * This NodeJS server proxies an HTTP post-deploy webhook from Heroku to
 * a Travis CI endpoint, in order to automatically trigger API tests.
 *
 */

var http = require('http');
var dispatcher = require('httpdispatcher');

const PORT = 8080;

function clone(object) {
    return JSON.parse(JSON.stringify(object))
}

var travisHttpTarget = {
    host: 'api.travis-ci.org',
    path: '/repo/' + process.env.REPO_OWNER + '%2F' + process.env.REPO_NAME + '/requests',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Travis-API-Version': 3,
        'Authorization': process.env.TOKEN
    },
    followAllRedirects: true
};

var travisHttpCallback = function(response) {
    var responseString = '';
    console.log('Response: ');
    console.log('  HTTP ' + response.statusCode);
    console.log('  Headers: ' + JSON.stringify(response.headers));
    response.on('data', function(data) {
        responseString += data;
    });
    response.on('error', function(error) {
        console.log(error.status);
    });
    response.on('end', function() {
        console.log('  Body: ' + responseString);
        console.log();
    });
}

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

    dispatcher.onPost("/pacmacro/apitests", function(request, response) {
        console.log('Sending HTTP request:');
        console.log('  ' + travisHttpTarget.method + " " + travisHttpTarget.host + travisHttpTarget.path);
        console.log('  Headers: ' + JSON.stringify(travisHttpTarget.headers));
        console.log();

        http.request(travisHttpTarget, travisHttpCallback).end();

        response.writeHead(201);
        console.log('Returning request with HTTP status code ' + response.statusCode);
        console.log();
        response.end();
    });

}

var server = http.createServer(handleReq);
setMappings(dispatcher);

server.listen(PORT, function() {
    console.log('Service Proxy is currently running on http://localhost:%s.', PORT);
    console.log();
});
