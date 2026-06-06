#!/usr/bin/env bash

sudo systemctl start docker
# Uncomment this to recreate container.
# ./script-postgres-container.sh
./clinic_container.sh

echo ====[ Successfully installed started clinic service. ]====
