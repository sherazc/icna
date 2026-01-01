#!/usr/bin/env bash

ln -s ./infrastructure/prod/clinic/.env .env

sudo systemctl start docker

echo Building clinic image

echo Building clinic image
docker stop clinic || true
docker rm clinic || true
docker rmi clinic -f || true
docker build . -t clinic

echo Running clinic container
docker run -it \
  --name clinic \
  -p 8080:8080 \
  -d clinic

echo ====[ Successfully installed started clinic service. ]====
