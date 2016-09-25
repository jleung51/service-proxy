#!/bin/sh

curl -iX POST http://${PROXY_HEROKU_APP}.herokuapp.com${PROXY_MAPPING}
