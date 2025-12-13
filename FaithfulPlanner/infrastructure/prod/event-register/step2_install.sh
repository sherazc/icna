#!/usr/bin/env bash

systemctl disable event_register.service
systemctl stop event_register

rm -rf /opt/sheraz-infra/event-register
mkdir -p /opt/sheraz-infra/event-register

mv /home/sheraz/dev/event-register/app /opt/sheraz-infra/event-register

rm /etc/systemd/system/event_register.service
mv /home/sheraz/dev/event-register/event_register.service /etc/systemd/system/

systemctl daemon-reload
systemctl start event_register
systemctl enable event_register.service

echo ====[ Successfully installed started event-register service. ]====
echo ====[ Check status. sudo systemctl status event_register ]====