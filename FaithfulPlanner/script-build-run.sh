#!/usr/bin/env bash
set -e -o pipefail
./script-postgres-container.sh
./script-build.sh
./script-run.sh
