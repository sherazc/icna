#!/usr/bin/env bash
# Build

cd ../../
 ./clean.sh
 ./build.sh

cd infrastructure/prod

# Copy infrastructure
# copy infra
scp -r -i ~/.ssh/id_rsa \
  ./event-register \
  sheraz@10.0.0.196:/home/sheraz/dev/

# Copy app
scp -r -i ~/.ssh/id_rsa \
  ../../event-register-api/target/event-register.jar \
  sheraz@10.0.0.196:/home/sheraz/dev/event-register/app

echo ====[ Successfully cleaned, built and deployed on sheraz-infra. ]====
echo ====[ Now run: sudo /home/sheraz/dev/event-register/step2_install.sh. ]====
