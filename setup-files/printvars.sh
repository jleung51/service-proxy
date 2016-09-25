#!/bin/sh

echo "Service Proxy:"
echo "  Heroku app name: " $PROXY_HEROKU_APP
echo "  Mapping:         " $PROXY_MAPPING
echo
echo "Travis CI repository:"
echo "  Repository owner:" $REPO_OWNER
echo "  Repository name: " $REPO_NAME
echo "  Access token:    " $TOKEN
echo
