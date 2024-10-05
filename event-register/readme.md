# Development
Run below steps in a new terminal.

## 1. Start EVENT Register API
`$ cd event-register-api`

`$ cd event-register-api`

`$ ./mvnw clean install`

`$ ./mvnw spring-boot:run`

## 2. Start UI Project

`$ cd event-register-ui`

`$ npm install`

`$ npm run start`

## 3. Start Frame widget project

`$ widgets/frame-widget`

`$ npm install`

`$ npm run dev`

## 4. Create Test HTML file
Create a temporary HTML file, add this script in it and open it in Chrome browser

```html
<script>
    var appNamePrefix = "eventRegisterWidget";
    window[`${appNamePrefix}ServerUrl`] = "http://localhost:3000";
    window[`${appNamePrefix}AppUrl`] = "/event/10";
</script>
<script type="application/javascript" src="app.min.js"></script>

```

# Production build

Commands below will generate production jar `event-register/event-register-api/target/event-register.jar`

`$ ./clean.sh`

`$ ./build.sh`


# Deployment
???

# Configure client website

Add below script in wordpress page.
Replace event id in the AppUrl
````html
<script>
    var appNamePrefix = "eventRegisterWidget";
    window[`${appNamePrefix}ServerUrl`] = "";
    window[`${appNamePrefix}AppUrl`] = "/event/10";
</script>
<script type="application/javascript" src="app.min.js"></script>
````