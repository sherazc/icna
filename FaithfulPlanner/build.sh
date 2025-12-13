#!/usr/bin/env bash
source .env

# Install/Update npm
npm install npm -g

# Build UI
cd $app_ui_dir
rm -rf build
npm install
npm run build

# Clean static files
rm -rf $app_api_dir/src/main/resources/static
mkdir -p $app_api_dir/src/main/resources/static

# Copy static files
cp -r $app_ui_dir/build/* $app_api_dir/src/main/resources/static

# Building API + UI jar
cd $app_api_dir
./mvnw clean install
