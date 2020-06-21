#!/bin/bash

#  NODE_ENV=xxx ./scripts/data/dump.sh  

if [ -z ${NODE_ENV+x} ]; then NODE_ENV=development; fi

db=$(grep -i 'mongodb://' ./config/defaults/${NODE_ENV}.js | awk -F/ '{print $NF}' | rev | cut -c3- | rev )

mongodump -d ${db}  --out=./scripts/data/dump
