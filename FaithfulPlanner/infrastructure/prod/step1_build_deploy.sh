#!/usr/bin/env bash
# Build
cd ..
source env_pi

cd ..
# ./clean.sh
./build.sh

cd $app_infra_source_path


ssh -i ~/.ssh/id_rsa \
  "$app_server_user@$app_server_ip" \
  "mkdir -p '$app_server_path'"

# Copy infra
scp -r -i ~/.ssh/id_rsa \
  ./$app_name \
  $app_server_user@$app_server_ip:$app_server_path

# Copy app
scp -r -i ~/.ssh/id_rsa \
  ../../api/build/libs/api-1.0.jar \
  $app_server_user@$app_server_ip:$app_server_path/$app_name/$app_name.jar

#echo ====[ Successfully cleaned, built and deployed on sheraz-infra. ]====
#echo ====[ Now run: sudo /home/sheraz/dev/event-register/step2_install.sh. ]====
