#!/usr/bin/env bash

echo Building clinic image
docker stop clinic || true
docker rm clinic || true
docker rmi clinic -f || true
docker build . -t clinic

echo Run clinic container
docker run -it \
  --name clinic \
  -p 8080:8080 \
  -d clinic

sleep 10
docker logs clinic