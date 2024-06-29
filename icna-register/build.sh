#!/usr/bin/env bash
# export NODE_OPTIONS=--openssl-legacy-provider

icna_register_dir=$(pwd)
icna_register_ui_dir=$icna_register_dir/icna-register-ui
icna_register_api_dir=$icna_register_dir/icna-register-api

# Install/Update npm and yarn
npm install npm -g

# Install UI dependencies
cd $icna_register_ui_dir
rm -rf build
npm install
npm run build


# Clean static files
rm -rf $icna_register_api_dir/src/main/resources/static
mkdir -p $icna_register_api_dir/src/main/resources/static

# Copy static files
cp -r $icna_register_ui_dir/build/* $icna_register_api_dir/src/main/resources/static

# Building API + UI jar
# cd $icna_register_api_dir
# ./mvnw clean install

