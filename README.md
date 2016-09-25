# Service Proxy

NodeJS server to route requests from Heroku to Travis CI.

## Setup

First, make sure you have a Heroku app deployed and a repository setup and ready to build with Travis CI.

### Repository and Environment

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

### Server

Install the necessary NPM packages:
```
npm install
```

### Heroku Application

Install the Heroku command line interface with [these instructions](https://devcenter.heroku.com/articles/heroku-command-line).

Login to Heroku:
```
heroku login
```

Find the name of the application you want to send a post-deploy webhook from:
```
heroku list
```

### Travis CI Access Token

Install the Travis CI command line interface with [these instructions](https://github.com/travis-ci/travis.rb#installation).

Retrieve your Travis CI access token by running the following commands:
```
travis login --org
travis token --org
```

(If you are using a private Travis CI repository, use `--pro` rather than `--org`.)

Place the access token in `env-setup/local.sh`.

### Environment (Local)

Export the environment variables you set in `local.sh`:
```
source ./local.sh
```

Check that the environment variables were set correctly:
```
./printvars.sh
```

You should see the values you just set in `local.sh`.
