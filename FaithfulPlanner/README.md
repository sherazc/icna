# Faithful Planner

Faithful Planner manages, scheduling for organizations or events that do not have a predefined or regular operation dates. It can be used for weekend clinics, weekend schools, conventions, volunteer events and many more...

These features makes it a diverse scheduling service.
- Register an organization or an event.
- Create employee groups. Employee groups are categories of employees.
- Create employees and assign them to different employee groups.
- Each employee group can have multiple employee types.
- Assign employees to operation date.
- Operation date could be assigned with the employee types needed to operate the day. 

## /api
Backend API Application. Standard spring boot application, configured to use kotlin and java. Kotlin is the preferred language.
File structure is a standard spring boot application

- `/api/src/main/resources/db/migration`: Flyway migration scripts
- `api/src/main/resources/static`: Public static files. This is where ReactJS UI built compiled files will be copied
- `/api/src/main/kotlin/com/sc/clinic/configuration`: Configurations
- `/api/src/main/kotlin/com/sc/clinic/controller`: Restful controllers
- `/api/src/main/kotlin/com/sc/clinic/dto`: DTOs
- `/api/src/main/kotlin/com/sc/clinic/entity`: Entities
- `/api/src/main/kotlin/com/sc/clinic/exception`: Exceptions
- `/api/src/main/kotlin/com/sc/clinic/repository`: Repositories
- `/api/src/main/kotlin/com/sc/clinic/service`: Services
- `/api/src/main/kotlin/com/sc/clinic/util`: Utilities


## /ui
Frontend UI. React JS, Typescript application. 

- `ui/src/__tests__`: Unit Tests
- `ui/src/assets`: 
- `ui/src/components`: ReactJS Components
- `ui/src/hook`: ReactJS Hooks
- `ui/src/layouts`: Application layout
- `ui/src/navigation`: Left rail navigation
- `ui/src/routes`: react-router-dom's Path to Component mapping
- `ui/src/service`: UI Services. I have tried to keep UI components clean from business logic code.
- `ui/src/store`: Application State. Created using ReactJS's createContext, and useReducer.
- `ui/src/App.css`: 
- `ui/src/App.tsx`: Wraps application with Application State's <AppProvider> and react-router-dom's <BrowserRouter> 
- `ui/src/index.css`: 
- `ui/src/main.tsx`: 

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

## /documents
Application design

## /FaithfulPlanner_UI_Design
AI generated UI design
