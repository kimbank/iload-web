# 빌드 단계
FROM openjdk:17-jdk-slim AS builder
WORKDIR /app
COPY ./gradlew .
COPY gradle ./gradle
COPY build.gradle settings.gradle ./
COPY src ./src
RUN chmod +x gradlew
RUN ./gradlew build -x test

# 실행 단계
FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=builder /app/build/libs/iload-backend.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]