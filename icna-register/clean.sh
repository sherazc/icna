#!/usr/bin/env bash

icna_register_dir=$(pwd)
icna_register_ui_dir=$icna_register_dir/icna-register-ui
icna_register_api_dir=$icna_register_dir/icna-register-api

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

# Clean frame-widget
rm -rf widgets/frame-widget/yarn.lock
rm -rf widgets/frame-widget/package-lock.json
rm -rf widgets/frame-widget/yarn-error.log
rm -rf widgets/frame-widget/node_modules
rm -rf ui/public/static/frame-widget/app.min.*



# Clean API
rm -rf $icna_register_api_dir/src/main/resources/static
cd $icna_register_api_dir
./mvnw clean
cd ..
