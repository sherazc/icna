#!/usr/bin/env bash

sudo systemctl start docker
docker stop clinic || true
docker rm clinic || true
docker rmi clinic -f || true
docker build . -t clinic

docker run -it \
  --name clinic \
  -p 8080:8080 \
  -d clinic

echo ====[ Successfully installed started clinic service. ]====
