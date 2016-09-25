#!/bin/bash

cd $(dirname $0)

source ./vars.sh
heroku config:set MAPPING=$MAPPING --app $HEROKU_APP
heroku config:set REPO_OWNER=$REPO_OWNER --app $HEROKU_APP
heroku config:set REPO_NAME=$REPO_NAME --app $HEROKU_APP
heroku config:set TOKEN=$TOKEN --app $HEROKU_APP
