#!/usr/bin/env bash

source .env

echo Building $app_name image
docker stop $app_name || true
docker rm $app_name || true
sudo docker rmi $app_name -f || true
sudo docker build . -t $app_name

echo Run app container
docker run -it \
  --name $app_name \
  -p 8080:8080 \
  -d $app_name

sleep 20
docker logs $app_name