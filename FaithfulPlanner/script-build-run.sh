#!/usr/bin/env bash
set -e -o pipefail
./script-db-container.sh
./script-build.sh
./script-run.sh
