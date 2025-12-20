#!/bin/bash
echo "Creating DB container, please wait..."

source .env

dataDir=$container_disks/$db_name

# Clean up
docker stop $db_name
docker rm -f $db_name
rm -rf $dataDir
mkdir $dataDir

sleep 3

# Create container
docker run \
  --detach \
  --name=$db_name \
  -p 3306:3306 \
  --env="MYSQL_ROOT_PASSWORD=$db_password" \
  --env="MYSQL_DATABASE=$db_name" \
  --env="MYSQL_USER=$db_user" \
  --env="MYSQL_PASSWORD=$db_password" \
  -v $dataDir:/var/lib/mysql \
  mysql:latest

sleep 5
echo "Created DB container."