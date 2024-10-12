#!/usr/bin/env bash

rm -rf /opt/sheraz-infra/event-register
mkdir -p /opt/sheraz-infra/event-register

mv /home/sheraz/event-register/app /opt/sheraz-infra/event-register

# setup service

echo ====[ Successfully installed event-register. ]====
echo ====[ Now restart. sudo systemctl restart event-register. ]====