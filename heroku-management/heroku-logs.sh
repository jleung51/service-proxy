#!/bin/sh

heroku logs \
  --force-colors \
  --tail \
  --app $PROXY_HEROKU_APP
