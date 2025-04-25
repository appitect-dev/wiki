---
sidebar_position: 7
---

# API Documentation with Swagger/OpenAPI

This guide covers how to document your Spring Boot REST APIs using Swagger/OpenAPI 3.0, making them more accessible and easier to understand for other developers.

## Setup and Configuration

### Dependencies

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

### Basic Configuration

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Your API Name")
                .version("1.0")
                .description("API Documentation for Your Spring Boot Application")
                .contact(new Contact()
                    .name("Your Team")
                    .email("team@example.com")
                    .url("https://your-website.com"))
                .license(new License()
                    .name("Apache 2.0")
                    .url("http://www.apache.org/licenses/LICENSE-2.0.html")))
            .servers(List.of(
                new Server()
                    .url("http://localhost:8080")
                    .description("Development server"),
                new Server()
                    .url("https://api.production.com")
                    .description("Production server")
            ));
    }
}
```

### Application Properties

```properties
# swagger-ui custom path
springdoc.swagger-ui.path=/swagger-ui.html

# Disable swagger-ui in production
springdoc.swagger-ui.enabled=true

# Sort APIs alphabetically
springdoc.swagger-ui.operationsSorter=alpha

# Enable API grouping
springdoc.swagger-ui.tagsSorter=alpha

# Disable default petstore example
springdoc.swagger-ui.disable-swagger-default-url=true
```

## Documenting Controllers

### Basic Controller Documentation

```java
@RestController
@RequestMapping("/api/users")
@Tag(name = "User Management", description = "APIs for managing users")
@SecurityRequirement(name = "bearerAuth")
public class UserController {
    
    @Operation(
        summary = "Get user by ID",
        description = "Retrieves a user's information based on their unique identifier"
    )
    @ApiResponses(value = {
        @ApiResponse(
            responseCode = "200",
            description = "Successfully retrieved user",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = UserResponse.class)
            )
        ),
        @ApiResponse(
            responseCode = "404",
            description = "User not found",
            content = @Content(
                mediaType = "application/json",
                schema = @Schema(implementation = ErrorResponse.class)
            )
        )
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(
        @Parameter(description = "User ID", example = "123")
        @PathVariable Long id
    ) {
        // Implementation
    }
    
    @Operation(
        summary = "Create new user",
        description = "Creates a new user account"
    )
    @PostMapping
    public ResponseEntity<UserResponse> createUser(
        @RequestBody @Valid CreateUserRequest request
    ) {
        // Implementation
    }
}
```

### Request/Response Models

```java
@Schema(description = "User creation request")
public class CreateUserRequest {
    
    @Schema(
        description = "User's email address",
        example = "john.doe@example.com",
        required = true
    )
    @Email
    private String email;
    
    @Schema(
        description = "User's password",
        example = "strongPassword123",
        required = true,
        minLength = 8
    )
    @Size(min = 8)
    private String password;
    
    @Schema(
        description = "User's full name",
        example = "John Doe"
    )
    private String fullName;
}

@Schema(description = "User response model")
public class UserResponse {
    
    @Schema(description = "User's unique identifier")
    private Long id;
    
    @Schema(description = "User's email address")
    private String email;
    
    @Schema(description = "User's full name")
    private String fullName;
    
    @Schema(description = "User's roles")
    private Set<String> roles;
}
```

## Security Documentation

### Security Scheme Configuration

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            // ... other configurations ...
            .components(new Components()
                .addSecuritySchemes("bearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("JWT token authentication"))
                .addSecuritySchemes("basicAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("basic")));
    }
}
```

### Securing Endpoints

```java
@RestController
@RequestMapping("/api/admin")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin Operations", description = "Administrative APIs")
public class AdminController {
    
    @Operation(
        summary = "Get system statistics",
        description = "Retrieves system-wide statistics (Admin only)",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemStats> getStats() {
        // Implementation
    }
}
```

## Advanced Features

### Custom Response Examples

```java
@Operation(summary = "Create order")
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "201",
        description = "Order created successfully",
        content = @Content(
            mediaType = "application/json",
            schema = @Schema(implementation = OrderResponse.class),
            examples = @ExampleObject(
                name = "Success Response",
                value = """
                {
                    "orderId": "12345",
                    "status": "CREATED",
                    "totalAmount": 99.99,
                    "items": [
                        {
                            "productId": "P123",
                            "quantity": 2,
                            "price": 49.99
                        }
                    ]
                }
                """
            )
        )
    )
})
@PostMapping("/orders")
public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
    // Implementation
}
```

### Request Parameter Documentation

```java
@GetMapping("/search")
@Operation(summary = "Search users")
public ResponseEntity<Page<UserResponse>> searchUsers(
    @Parameter(description = "Search query", example = "john")
    @RequestParam(required = false) String query,
    
    @Parameter(description = "User role filter", schema = @Schema(allowableValues = {"ADMIN", "USER"}))
    @RequestParam(required = false) String role,
    
    @Parameter(description = "Page number (0-based)", example = "0")
    @RequestParam(defaultValue = "0") int page,
    
    @Parameter(description = "Page size", example = "20")
    @RequestParam(defaultValue = "20") int size,
    
    @Parameter(description = "Sort field", example = "email")
    @RequestParam(defaultValue = "id") String sort
) {
    // Implementation
}
```

### Grouping APIs

```java
@Configuration
public class OpenApiConfig {
    
    @Bean
    public GroupedOpenApi publicApi() {
        return GroupedOpenApi.builder()
            .group("public")
            .pathsToMatch("/api/public/**")
            .build();
    }
    
    @Bean
    public GroupedOpenApi adminApi() {
        return GroupedOpenApi.builder()
            .group("admin")
            .pathsToMatch("/api/admin/**")
            .addOpenApiCustomizer(openApi -> openApi.info(
                new Info().title("Admin API").version("1.0")))
            .build();
    }
}
```

## Best Practices

1. **Consistent Documentation**
   - Use consistent naming conventions
   - Provide meaningful descriptions
   - Include examples where possible
   - Document all possible responses

2. **Security Documentation**
   - Clearly document authentication requirements
   - Specify required roles and permissions
   - Document security-related headers

3. **Response Documentation**
   - Document all response codes
   - Provide example responses
   - Include error scenarios
   - Document pagination details

4. **Maintenance**
   - Keep documentation up to date
   - Version your API documentation
   - Remove deprecated endpoints
   - Document breaking changes

## Common Issues and Solutions

### 1. Hidden Endpoints
```java
@Hidden // Hide endpoint from Swagger UI
@GetMapping("/internal/health")
public String healthCheck() {
    return "OK";
}
```

### 2. Custom Response Headers
```java
@Operation(summary = "Download file")
@ApiResponses(value = {
    @ApiResponse(
        responseCode = "200",
        description = "File downloaded successfully",
        headers = {
            @Header(
                name = "Content-Disposition",
                description = "Attachment filename",
                schema = @Schema(type = "string")
            )
        }
    )
})
@GetMapping("/download/{fileId}")
public ResponseEntity<Resource> downloadFile(@PathVariable String fileId) {
    // Implementation
}
```

## Next Steps

Now that you understand API documentation:
1. Learn about [Testing](./testing.md) your documented endpoints
2. Explore monitoring and metrics collection
3. Study API versioning strategies 