#!/usr/bin/env bash
./script-build.sh
cd infrastructure
./step1_deploy.sh
cd ..

conn-pi
