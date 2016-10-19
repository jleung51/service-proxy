# Service Proxy

NodeJS proxy server to route HTTP webhooks from Heroku to Travis CI.

When a specific endpoint on this service proxy receives a request (in our use case, from a Heroku post-deployment hook), another HTTP request will be sent with a hidden authentication token (known only to the user(s) deploying this proxy server) to trigger a Travis CI build. Essentially, this creates a post-deployment hook from a Heroku app to a Travis CI build with a secret authentication token.

## Setup

First, make sure you have a Heroku app deployed and a repository set up and ready to build with Travis CI.

Install both NodeJS and NPM.

### Travis CI Access Token

Install the Travis CI command line interface with [these instructions](https://github.com/travis-ci/travis.rb#installation).

Retrieve your Travis CI access token by running the following commands:
```
travis login --org
travis token --org
```

(If you are using a private Travis CI repository, use `--pro` rather than `--org`.)

Keep this token; you will need it for setup.

### Repository

Clone the repository and navigate into the directory:
```
git clone https://github.com/jleung51/service-proxy
cd service-proxy/
```

Run the environment setup script:
```
./setup.sh
```

Navigate into the new directory `env-setup/`. This directory is ignored by Git, so you can modify its files however you like and add sensitive access tokens.

### Deploying the Server Locally

Several environment variables will need to be set before the server can be run.

In the directory `env-setup/`, there will be a file named `vars.sh`. Edit this file and set the following values:

* `PROXY_MAPPING`: The URL mapping at which the proxy's HTTP endpoint is located (e.g. `/server/trigger`); this should begin with a slash (`/`)
* `REPO_OWNER`: The user/organization of the GitHub repository which will be built by Travis CI
* `REPO_NAME`: The name of the GitHub repository which will be built by Travis CI
* `TOKEN`: The Travis CI access token obtained from a previous step (see **Travis CI Access Token**)

Export the environment variables you just set in `vars.sh`:
```
source ./vars.sh
```

Check that the environment variables were modified correctly:
```
./printvars.sh
```

Install the necessary NPM packages:
```
npm install
```

Start the server locally:
```
npm start
```

If setup was successful, you should see the message `Service Proxy is currently running on http://localhost:8080.`

### Deploying the Server on Heroku

Install the Heroku command line interface with [these instructions](https://devcenter.heroku.com/articles/heroku-command-line).

Login to Heroku:
```
heroku login
```

#### Service Proxy Configuration

Create a Heroku application for the service proxy with whatever name you like:
```
heroku apps:create YOUR_APP_NAME_HERE
```

Use that app name as the value `PROXY_HEROKU_APP` in `vars.sh` and refresh the environment variables:
```
source ./vars.sh
./printvars.sh
```

Deploy the service proxy:
```
git push heroku master
```

Set the local environment variables as the Heroku application's environment variables:
```
./heroku-deployment.sh
```

#### Post-Deploy Hook

Find the name of the application you want to send a post-deploy webhook from:
```
heroku list
```

# TODO

#### Heroku Management

There are scripts in the `heroku-management/` directory for general Heroku application management.

Before using them, you must have the environment variables `PROXY_HEROKU_APP` and `PROXY_MAPPING` set in `env-setup/vars.sh`, and have run `source ./env-setup/vars.sh`.

| Script | Description |
| --- | --- |
| `heroku-endpoint.sh` | Triggers the proxy to send the request to Travis CI |
| `heroku-logs.sh` | Views the application logs on Heroku |
