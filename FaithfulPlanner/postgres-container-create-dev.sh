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
  -p 5432:5432 \
  --env="POSTGRES_PASSWORD=$db_password" \
  --env="POSTGRES_DB=$db_name" \
  --env="POSTGRES_USER=$db_user" \
  -v $dataDir:/var/lib/postgresql \
  postgres:latest

sleep 5
echo "Created DB container."

