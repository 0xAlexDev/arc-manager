FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests
FROM ubuntu:latest
RUN apt-get update && \
    apt-get install -y openjdk-21-jdk && \
    ln -s /usr/lib/x86_64-linux-gnu/libgsl.so.27 /usr/lib/x86_64-linux-gnu/libgsl.so.25
ARG JAR_FILE=../target/*.jar
COPY ${JAR_FILE} /application/arc-manager-spring-app/app.jar
ENTRYPOINT ["java","-jar","/application/arc-manager-spring-app/app.jar"]