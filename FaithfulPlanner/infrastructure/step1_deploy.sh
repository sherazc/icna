#!/usr/bin/env bash

source env_pi

ssh -i ~/.ssh/id_rsa \
  "$app_server_user@$app_server_ip" \
  "mkdir -p '$app_server_path'"

# Copy infra
scp -r -i ~/.ssh/id_rsa \
  ./$app_name \
  $app_server_user@$app_server_ip:$app_server_path

# Copy app
scp -r -i ~/.ssh/id_rsa \
  ../api/build/libs/api-1.0.jar \
  $app_server_user@$app_server_ip:$app_server_path/$app_name/$app_name.jar

echo ====[ Successfully deployed. Now run ./step2_install.sh on server ]====
