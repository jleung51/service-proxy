/*
 * This NodeJS server proxies an HTTP post-deploy webhook from Heroku to
 * a Travis CI endpoint, in order to automatically trigger API tests.
 *
 */

var http = require('http');
var dispatcher = require('httpdispatcher');

const PORT = 8080;

function setHttp201(response) {
    response.writeHead(201);
}

function handleReq(request, response) {
    try {
        console.log('Mapped ' + request.url);
        dispatcher.dispatch(request, response);
    }
    catch(except) {
        console.log(except);
    }
}

function setMappings(dispatcher) {

    dispatcher.setStatic('resources');

    dispatcher.onPost("/pacmacro/apitests", function(request, response) {
       setHttp201(response);
       response.end();
    });

}

var server = http.createServer(handleReq);
setMappings(dispatcher);

server.listen(PORT, function() {
    console.log('Server running on http://localhost:%s', PORT);
});
