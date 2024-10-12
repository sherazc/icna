#!/usr/bin/env bash
# export NODE_OPTIONS=--openssl-legacy-provider

event_register_dir=$(pwd)
event_register_ui_dir=$event_register_dir/event-register-ui
event_register_frame_widget_dir=$event_register_dir/widgets/frame-widget
event_register_api_dir=$event_register_dir/event-register-api

# Install/Update npm
npm install npm -g

# Build frame-widget
cd $event_register_frame_widget_dir
npm install
npm run build

# Build UI
cd $event_register_ui_dir
rm -rf build
npm install
npm run build

# Clean static files
rm -rf $event_register_api_dir/src/main/resources/static
mkdir -p $event_register_api_dir/src/main/resources/static

# Copy static files
cp -r $event_register_ui_dir/build/* $event_register_api_dir/src/main/resources/static
# TODO copy frame widget

# Building API + UI jar
cd $event_register_api_dir
./mvnw clean install
