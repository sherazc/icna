#!/usr/bin/env bash

icna_register_dir=$(pwd)
# Clean Logs


icna_register_ui_dir=$icna_register_dir/icna-register-ui
# Clean UI
rm $icna_register_ui_dir/yarn.lock
rm $icna_register_ui_dir/package-lock.json
rm $icna_register_ui_dir/yarn-error.log
rm -rf $icna_register_ui_dir/build
rm -rf $icna_register_ui_dir/node_modules

# Clean Logs
# rm rf misc/logs/*.log
# rm -rf misc/logs/archived
# mkdir misc/logs/archived

# Clean rod-widget
# rm -rf widgets/rod-widget/yarn.lock
# rm -rf widgets/rod-widget/package-lock.json
# rm -rf widgets/rod-widget/yarn-error.log
# rm -rf widgets/rod-widget/node_modules
# rm -rf ui/public/static/rod-widget/app.min.*


icna_register_api_dir=$icna_register_dir/icna-register-api
# Clean API
rm -rf $icna_register_api_dir/src/main/resources/static
cd $icna_register_api_dir
./mvnw clean
cd ..
