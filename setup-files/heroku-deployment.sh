#!/bin/bash

cd $(dirname $0)

source ./vars.sh
heroku config:set MAPPING=$PROXY_MAPPING --app $PROXY_HEROKU_APP
heroku config:set REPO_OWNER=$REPO_OWNER --app $PROXY_HEROKU_APP
heroku config:set REPO_NAME=$REPO_NAME --app $PROXY_HEROKU_APP
heroku config:set TOKEN=$TOKEN --app $PROXY_HEROKU_APP
