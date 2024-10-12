#!/usr/bin/env bash
# Build

# Copy infrastructure
# copy infra
scp -r -i ~/.ssh/id_rsa \
  ./event-register \
  sheraz@10.0.0.196:/home/sheraz/

# Copy app
scp -r -i ~/.ssh/id_rsa \
  ../../event-register-api/target/event-register.jar \
  sheraz@10.0.0.196:/home/sheraz/event-register/app


