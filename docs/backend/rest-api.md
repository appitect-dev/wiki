---
sidebar_position: 3
---

# REST API Basics

This guide covers the fundamentals of building RESTful APIs with Spring Boot, including best practices, request/response handling, and common patterns.

## REST Principles

REST (Representational State Transfer) is an architectural style that defines a set of constraints for creating web services:

1. **Stateless**: Each request contains all necessary information
2. **Client-Server**: Separation of concerns between client and server
3. **Cacheable**: Responses must be cacheable when applicable
4. **Uniform Interface**: Standardized way to handle resources
5. **Layered System**: Client can't tell if it's connected directly to the server

## HTTP Methods

Common HTTP methods and their usage:

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Retrieve resource(s) | GET /api/users |
| POST | Create new resource | POST /api/users |
| PUT | Update entire resource | PUT /api/users/1 |
| PATCH | Partial update | PATCH /api/users/1 |
| DELETE | Remove resource | DELETE /api/users/1 |

## Creating REST Controllers

### Basic Controller Structure

```java
package com.example.demo.controller;

import com.example.demo.dto.request.UserRequest;
import com.example.demo.dto.response.UserResponse;
import com.example.demo.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }
    
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.createUser(request));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
```

### Request/Response DTOs

```java
// UserRequest.java
package com.example.demo.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "Name is required")
    private String name;
    
    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    private String password;
}

// UserResponse.java
package com.example.demo.dto.response;

import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    // Exclude sensitive data like password
}
```

## Exception Handling

### Global Exception Handler

```java
package com.example.demo.exception;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        ErrorResponse error = new ErrorResponse(
            "NOT_FOUND",
            ex.getMessage()
        );
        return ResponseEntity.status(404).body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidation(ValidationException ex) {
        ErrorResponse error = new ErrorResponse(
            "VALIDATION_ERROR",
            ex.getMessage()
        );
        return ResponseEntity.status(400).body(error);
    }

    // Generic error handler
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        ErrorResponse error = new ErrorResponse(
            "INTERNAL_ERROR",
            "An unexpected error occurred"
        );
        return ResponseEntity.status(500).body(error);
    }
}

// ErrorResponse.java
@Data
public class ErrorResponse {
    private String code;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(String code, String message) {
        this.code = code;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }
}
```

## Request Validation

Spring Boot provides validation through Jakarta Bean Validation:

```java
public class CreateProductRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be positive")
    private BigDecimal price;

    @Size(max = 500, message = "Description cannot exceed 500 characters")
    private String description;

    @Pattern(regexp = "^[A-Z]{2,5}$", message = "Invalid category code format")
    private String categoryCode;
}
```

## Response Status Codes

Use appropriate HTTP status codes:

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid input |
| 401 | Unauthorized | Authentication required |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 500 | Internal Server Error | Server error |

## API Versioning

There are several approaches to API versioning:

### 1. URL Versioning
```java
@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 { }

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 { }
```

### 2. Header Versioning
```java
@RestController
@RequestMapping("/api/users")
public class UserController {
    @GetMapping(headers = "X-API-VERSION=1")
    public ResponseEntity<UserV1Response> getUserV1() { }

    @GetMapping(headers = "X-API-VERSION=2")
    public ResponseEntity<UserV2Response> getUserV2() { }
}
```

## Best Practices

1. **Use Proper HTTP Methods**
   - GET for retrieval
   - POST for creation
   - PUT for full updates
   - PATCH for partial updates
   - DELETE for removal

2. **Resource Naming**
   - Use nouns for resources
   - Use plural forms
   - Keep it simple and intuitive
   - Example: `/api/users`, `/api/orders`

3. **Response Formatting**
   - Be consistent with response structure
   - Include proper error messages
   - Use appropriate status codes
   - Consider pagination for lists

4. **Security**
   - Validate all inputs
   - Use HTTPS
   - Implement proper authentication
   - Apply authorization checks

5. **Documentation**
   - Use OpenAPI/Swagger
   - Document all endpoints
   - Include example requests/responses
   - Document error scenarios

## Testing REST APIs

### Unit Testing Controllers

```java
@WebMvcTest(UserController.class)
class UserControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void shouldCreateUser() throws Exception {
        UserRequest request = new UserRequest();
        request.setName("John Doe");
        request.setEmail("john@example.com");

        UserResponse response = new UserResponse();
        response.setId(1L);
        response.setName("John Doe");
        response.setEmail("john@example.com");

        when(userService.createUser(any())).thenReturn(response);

        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(new ObjectMapper().writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("John Doe"));
    }
}
```

## Common Patterns

### 1. Pagination
```java
@GetMapping
public ResponseEntity<Page<UserResponse>> getUsers(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(defaultValue = "id") String sortBy) {
    Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
    return ResponseEntity.ok(userService.getUsers(pageable));
}
```

### 2. Filtering
```java
@GetMapping
public ResponseEntity<List<UserResponse>> getUsers(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String email) {
    return ResponseEntity.ok(userService.findUsers(name, email));
}
```

### 3. Bulk Operations
```java
@PostMapping("/bulk")
public ResponseEntity<List<UserResponse>> createUsers(
        @RequestBody List<UserRequest> requests) {
    return ResponseEntity.ok(userService.createUsers(requests));
}
```

## Next Steps

Now that you understand REST API basics:
1. Learn about [Database Integration](./database.md)
2. Explore [Security](./security.md) implementation
3. Study [API Documentation](./api-docs.md) with Swagger/OpenAPI 