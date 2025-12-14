#!/usr/bin/env bash
# Build
cd ..
source env_pi

cd ..
# ./clean.sh
# ./build.sh

cd $app_infra_source_path


ssh -i ~/.ssh/id_rsa \
  "$app_server_user@$app_server_ip" \
  "mkdir -p '$app_server_path'"

# Copy infra
scp -r -i ~/.ssh/id_rsa \
  ./clinic \
  $app_server_user@$app_server_ip:$app_server_path

## Copy app
#scp -r -i ~/.ssh/id_rsa \
#  ../../event-register-api/target/event-register.jar \
#  sheraz@10.0.0.196:/home/sheraz/dev/event-register/app
#
#echo ====[ Successfully cleaned, built and deployed on sheraz-infra. ]====
#echo ====[ Now run: sudo /home/sheraz/dev/event-register/step2_install.sh. ]====
