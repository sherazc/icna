#!/usr/bin/env bash

docker network create clinic-net

sudo systemctl start docker
# Uncomment this to recreate database .container.
./script-postgres-container.sh
./script-clinic-container.sh
./script-backup-db-cron.sh

echo ====[ Successfully installed started clinic service. ]====
