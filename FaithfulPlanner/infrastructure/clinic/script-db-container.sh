#!/bin/bash
set -e -o pipefail
echo "Creating DB container..."

source .env
dataDir=$container_disks/$db_name

echo Clean up DB
docker stop $db_name || true
docker rm -f $db_name || true
# sudo rm -rf $dataDir
mkdir -p $dataDir

sleep 3

echo Run DB container
docker run \
  --detach \
  --name=$db_name \
  --network clinic-net \
  -p 5432:5432 \
  --env="POSTGRES_PASSWORD=$db_password" \
  --env="POSTGRES_DB=$db_name" \
  --env="POSTGRES_USER=$db_user" \
  -v $dataDir:/var/lib/postgresql \
  postgres:latest

sleep 30
echo "DB container finished!"
