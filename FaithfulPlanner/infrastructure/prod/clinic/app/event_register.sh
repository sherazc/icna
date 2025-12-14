#!/usr/bin/env bash

if [ -f environment_variables.sh ]; then
  source environment_variables.sh
fi

EVENT_DATA_SOURCE_URL=$EVENT_DATA_SOURCE_URL \
EVENT_DATA_SOURCE_USERNAME=$EVENT_DATA_SOURCE_USERNAME \
EVENT_DATA_SOURCE_PASSWORD=$EVENT_DATA_SOURCE_PASSWORD \
java -jar event-register.jar
