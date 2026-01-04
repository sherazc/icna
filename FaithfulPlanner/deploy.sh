#!/usr/bin/env bash
./build.sh
cd infrastructure
./step1_deploy.sh
cd ..

conn-pi
