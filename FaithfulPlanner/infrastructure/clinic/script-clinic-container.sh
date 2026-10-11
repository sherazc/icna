#!/usr/bin/env bash
set -e -o pipefail
source .env

echo Building $app_name image
docker stop $app_name || true
docker rm $app_name || true
sudo docker rmi $app_name -f || true
sudo docker build . -t $app_name

echo Run app container
docker run -it \
  --network clinic-net \
  --name $app_name \
  -v "$HOME/.aws:/root/.aws:ro" \
  -p 8080:8080 \
  -d $app_name

sleep 60
docker logs $app_name