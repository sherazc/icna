# Development
Run below steps in a new terminal.

## 1. Start ICNA Register API
`$ cd icna-register-api`

`$ cd icna-register-api`

`$ ./mvnw clean install`

`$ ./mvnw spring-boot:run`

## 2. Start UI Project

`$ cd icna-register-ui`

`$ npm install`

`$ npm run start`

## 3. Start Frame widget project

`$ widgets/frame-widget`

`$ npm install`

`$ npm run dev`

## 4. Create Test HTML file
Create a temporary HTML file and add this script in it:

```html
<script>
    var appNamePrefix = "icnaRegisterWidget";
    window[`${appNamePrefix}ServerUrl`] = "http://localhost:3000";
    window[`${appNamePrefix}AppUrl`] = "/event/10";
</script>
<script type="application/javascript" src="app.min.js"></script>

```

# Production build

Commands below will generate production jar `icna-register/icna-register-api/target/icna-register.jar`

`$ ./clean.sh`

`$ ./build.sh`


# Deployment of ICNA register
Add below script in wordpress page.
Replace event id in the AppUrl
````html
<script>
    var appNamePrefix = "icnaRegisterWidget";
    window[`${appNamePrefix}ServerUrl`] = "";
    window[`${appNamePrefix}AppUrl`] = "/event/10";
</script>
<script type="application/javascript" src="app.min.js"></script>
````