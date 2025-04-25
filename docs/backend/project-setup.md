---
sidebar_position: 2
---

# Project Setup and Structure

This guide will walk you through setting up a Spring Boot project with all necessary dependencies and configurations.

## Creating a New Project

### Using Spring Initializer

1. Visit [Spring Initializer](https://start.spring.io/)
2. Configure your project:
   - Project: Maven
   - Language: Java
   - Spring Boot: 3.2.x
   - Group: com.example
   - Artifact: demo
   - Name: demo
   - Description: Demo project for Spring Boot
   - Package name: com.example.demo
   - Packaging: Jar
   - Java: 17

3. Add dependencies:
   - Spring Web
   - Spring Data JPA
   - PostgreSQL Driver
   - Lombok
   - Spring Security
   - Validation
   - SpringDoc OpenAPI UI

### Maven Configuration

Your `pom.xml` should look like this:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.0</version>
        <relativePath/>
    </parent>
    
    <groupId>com.example</groupId>
    <artifactId>demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>demo</name>
    <description>Demo project for Spring Boot</description>
    
    <properties>
        <java.version>17</java.version>
        <jjwt.version>0.11.5</jjwt.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- Database -->
        <dependency>
            <groupId>org.postgresql</groupId>
            <artifactId>postgresql</artifactId>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        
        <!-- JWT -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        
        <!-- Swagger/OpenAPI -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>2.3.0</version>
        </dependency>
        
        <!-- Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>
    
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

## Project Structure

Organize your project using the following structure:

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── example/
│   │           └── demo/
│   │               ├── DemoApplication.java
│   │               ├── config/
│   │               │   ├── SecurityConfig.java
│   │               │   ├── OpenApiConfig.java
│   │               │   └── WebConfig.java
│   │               ├── controller/
│   │               │   └── UserController.java
│   │               ├── dto/
│   │               │   ├── request/
│   │               │   └── response/
│   │               ├── entity/
│   │               │   └── User.java
│   │               ├── repository/
│   │               │   └── UserRepository.java
│   │               ├── service/
│   │               │   └── UserService.java
│   │               ├── exception/
│   │               │   ├── GlobalExceptionHandler.java
│   │               │   └── CustomException.java
│   │               └── security/
│   │                   ├── JwtTokenProvider.java
│   │                   └── UserDetailsServiceImpl.java
│   └── resources/
│       ├── application.properties
│       ├── application-dev.properties
│       └── application-prod.properties
└── test/
    └── java/
        └── com/
            └── example/
                └── demo/
                    ├── controller/
                    ├── service/
                    └── repository/
```

## Application Properties

Create different property files for different environments:

```properties
# application.properties (common settings)
spring.profiles.active=dev

# Server configuration
server.port=8080
server.servlet.context-path=/api

# Logging
logging.level.org.springframework=INFO
logging.level.com.example.demo=DEBUG

# OpenAPI/Swagger
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

```properties
# application-dev.properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/demo
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your-secret-key
jwt.expiration=86400000
```

## Basic Application Class

Create the main application class:

```java
package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DemoApplication {
    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }
}
```

## Next Steps

Now that you have set up your project structure and basic configuration:

1. Set up your database connection (covered in [Database Integration](./database.md))
2. Create your first REST controller (covered in [REST API Basics](./rest-api.md))
3. Implement security (covered in [Security](./security.md))

## Common Issues and Solutions

### Database Connection
If you can't connect to PostgreSQL:
1. Ensure PostgreSQL is running
2. Verify database credentials
3. Check if database exists
4. Confirm port availability

### Maven Dependencies
If dependencies aren't resolving:
1. Run `mvn clean install -U`
2. Check your Maven settings.xml
3. Verify internet connection
4. Clear Maven cache if needed

### IDE-Specific
For IntelliJ IDEA:
1. Enable annotation processing for Lombok
2. Refresh Maven project
3. Invalidate caches if needed

## Best Practices

1. **Version Control**
   - Initialize Git repository
   - Create .gitignore file
   - Don't commit sensitive data

2. **Properties Management**
   - Use different profiles (dev, prod)
   - Externalize configurations
   - Use environment variables for sensitive data

3. **Code Organization**
   - Follow package structure
   - Use meaningful names
   - Keep classes focused and small

4. **Security**
   - Never commit secrets
   - Use environment variables
   - Implement proper security from start 