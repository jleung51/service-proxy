#!/bin/sh

cd $(dirname $0)

heroku login

source ./local.sh
heroku config:set MAPPING=$MAPPING
heroku config:set REPO_OWNER=$REPO_OWNER
heroku config:set REPO_NAME=$REPO_NAME
heroku config:set TOKEN=$TOKEN
