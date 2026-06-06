# Faithful Planner

Faithful Planner manage scheduling for organizations or events that do not have a predefined operation dates.

It can be used for weekend clinics, weekend schools, conventions, volunteers management an event and many more...

These features makes it a diverse scheduling service.
- Register an organization or an event.
- Create employee groups. Employee groups are categories of employees.
- Create employees and assign them to different employee groups.
- Each employee group can have multiple employee types.
- Assign employees to operation date.
- Operation date could be assigned with the employee types needed to operate the day. 

## /api
Provides the backend API of application. 
It is spring boot application, configured to use kotlin and java. Kotlin is the preferred language.
File structure is a standard spring boot application

### /api/src/main/resources/db/migration
Flyway migration scripts

## /ui
React JS application. 

## /bruno
Uses bruno for end to end testing.

## /infrastructure
Deployment scripts.

### infrastructure/step1_deploy.sh 
Uploads built application on the server. It should be executed on developer/deployment machine.

### infrastructure/clinic/step2_install.sh
Install application on the servers. It should be executed on the server

## /script-build.sh
Builds both /api and /ui. Copies built /ui in /api/src/main/resources/static.
Uses Gradle to build /api/build/libs/api-#.#.jar executable jar.

## /script-postgres-container.sh
Link to /infrastructure/clinic/script-postgres-container.sh

Used to create postgres db docker container for local testing and server app installation.

## /script-deploy.sh
Builds and deploys application on the server. Calls ./script-build.sh and ./infrastructure/step1_deploy.sh

