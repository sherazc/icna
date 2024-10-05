#!/usr/bin/env bash

event_register_dir=$(pwd)
event_register_ui_dir=$event_register_dir/event-register-ui
event_register_api_dir=$event_register_dir/event-register-api

# Clean UI
rm $event_register_ui_dir/yarn.lock
rm $event_register_ui_dir/package-lock.json
rm $event_register_ui_dir/yarn-error.log
rm -rf $event_register_ui_dir/build
rm -rf $event_register_ui_dir/node_modules

# Clean Logs
# rm rf misc/logs/*.log
# rm -rf misc/logs/archived
# mkdir misc/logs/archived

# Clean frame-widget
rm -rf widgets/frame-widget/yarn.lock
rm -rf widgets/frame-widget/package-lock.json
rm -rf widgets/frame-widget/yarn-error.log
rm -rf widgets/frame-widget/node_modules
rm -rf ui/public/static/frame-widget/app.min.*



# Clean API
rm -rf $event_register_api_dir/src/main/resources/static
cd $event_register_api_dir
./mvnw clean
cd ..
