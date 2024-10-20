#!/bin/bash

# Vars
# baseDir=$PWD
baseDir=~/dev
dataDir=$baseDir/event-register-db

# Clean up
docker stop event-register-db
docker rm -f event-register-db
rm -rf $dataDir
mkdir $dataDir

sleep 3

# Create container
docker run \
  --detach \
  --name=event-register-db \
  -p 3306:3306 \
  --env="MYSQL_ROOT_PASSWORD=password" \
  --env="MYSQL_DATABASE=erdb" \
  --env="MYSQL_USER=erdbuser" \
  --env="MYSQL_PASSWORD=password" \
  -v $dataDir:/var/lib/mysql \
  mysql:latest

sleep 5
echo "Created DB container."