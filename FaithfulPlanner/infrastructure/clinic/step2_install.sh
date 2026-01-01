#!/usr/bin/env bash

sudo systemctl start docker

./clinic_container.sh

echo ====[ Successfully installed started clinic service. ]====
