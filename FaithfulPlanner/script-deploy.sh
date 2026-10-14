#!/usr/bin/env bash

set -e -o pipefail

./script-build.sh
cd infrastructure
./step1_deploy.sh
cd ..

