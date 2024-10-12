#!/usr/bin/env bash
# Build

# cd ../../
# ./clean.sh
# ./build.sh

cd infrastructure/prod

# Copy infrastructure
# copy infra
scp -r -i ~/.ssh/id_rsa \
  ./event-register \
  sheraz@10.0.0.196:/home/sheraz/

# Copy app
scp -r -i ~/.ssh/id_rsa \
  ../../event-register-api/target/event-register.jar \
  sheraz@10.0.0.196:/home/sheraz/event-register/app

echo ====[ Successfully cleaned, built and deployed on sheraz-infra. ]====
echo ====[ Now run /home/sheraz/event-register/sandbox_step2_init.sh. ]====
