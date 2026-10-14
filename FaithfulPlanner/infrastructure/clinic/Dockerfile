FROM eclipse-temurin:25-jre
WORKDIR /app
ADD ./clinic.jar /app/clinic.jar
EXPOSE 8080
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "/app/clinic.jar"]
