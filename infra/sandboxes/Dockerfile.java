FROM eclipse-temurin:21-jdk-alpine
WORKDIR /sandbox
USER nobody
CMD ["java", "-version"]
