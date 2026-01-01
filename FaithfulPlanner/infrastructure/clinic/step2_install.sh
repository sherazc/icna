#!/usr/bin/env bash

sudo systemctl start docker
./postgres-container.sh
./clinic_container.sh

echo ====[ Successfully installed started clinic service. ]====
