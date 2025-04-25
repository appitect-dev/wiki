---
sidebar_position: 4
---

# Database Integration

This guide covers database integration with PostgreSQL, including database design, JPA/Hibernate configuration, and best practices for data modeling.

## PostgreSQL Setup

### Installation

1. Download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
2. During installation:
   - Remember your superuser (postgres) password
   - Default port is 5432
   - Install pgAdmin for GUI management

### Creating a Database

Using psql:
```sql
CREATE DATABASE demo;
CREATE USER demo_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE demo TO demo_user;
```

Using pgAdmin:
1. Right-click Databases
2. Select "Create" > "Database"
3. Enter database name and owner

## Database Configuration

### Spring Boot Configuration

```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/demo
spring.datasource.username=demo_user
spring.datasource.password=password

# JPA/Hibernate properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### Connection Pooling with HikariCP

```properties
# Connection pool settings
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
spring.datasource.hikari.connection-timeout=20000
spring.datasource.hikari.max-lifetime=1200000
```

## Database Design

### Entity Relationship Diagrams (ERD)

Example ERD for a blog system:
```
User (1) ----< Post (*)
Post (1) ----< Comment (*)
User (1) ----< Comment (*)
Post (*) >---- Category (1)
```

### SQL Basics

#### Creating Tables
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    post_id INTEGER REFERENCES posts(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Common SQL Operations
```sql
-- Select with join
SELECT p.*, u.username 
FROM posts p 
JOIN users u ON p.user_id = u.id 
WHERE p.created_at > '2024-01-01';

-- Insert
INSERT INTO users (username, email, password_hash) 
VALUES ('john_doe', 'john@example.com', 'hashed_password');

-- Update
UPDATE posts 
SET title = 'New Title' 
WHERE id = 1;

-- Delete
DELETE FROM comments 
WHERE post_id = 1;
```

## JPA Entity Mapping

### Basic Entity

```java
@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "created_at")
    @CreationTimestamp
    private LocalDateTime createdAt;
}
```

### Relationships

#### One-to-Many
```java
// In User.java
@OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
private List<Post> posts = new ArrayList<>();

// In Post.java
@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "user_id")
private User user;
```

#### Many-to-Many
```java
@Entity
public class Post {
    @ManyToMany
    @JoinTable(
        name = "post_tags",
        joinColumns = @JoinColumn(name = "post_id"),
        inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();
}

@Entity
public class Tag {
    @ManyToMany(mappedBy = "tags")
    private Set<Post> posts = new HashSet<>();
}
```

## Database Migrations

Using Flyway for database migrations:

1. Add Flyway dependency:
```xml
<dependency>
    <groupId>org.flywaydb</groupId>
    <artifactId>flyway-core</artifactId>
</dependency>
```

2. Configure Flyway:
```properties
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true
spring.flyway.locations=classpath:db/migration
```

3. Create migration files:
```sql
-- V1__Create_users_table.sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- V2__Add_user_role.sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';
```

## Data Access Layer

### Spring Data JPA Repository

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.username LIKE %:username%")
    List<User> searchByUsername(@Param("username") String username);
    
    @Query(value = "SELECT * FROM users WHERE created_at > :date", 
           nativeQuery = true)
    List<User> findRecentUsers(@Param("date") LocalDateTime date);
}
```

### Custom Repository Implementation

```java
@Repository
public interface CustomUserRepository {
    List<User> findActiveUsersWithPosts();
}

@Repository
public class CustomUserRepositoryImpl implements CustomUserRepository {
    @PersistenceContext
    private EntityManager em;

    @Override
    public List<User> findActiveUsersWithPosts() {
        return em.createQuery(
            "SELECT DISTINCT u FROM User u " +
            "JOIN FETCH u.posts " +
            "WHERE u.active = true", User.class)
            .getResultList();
    }
}
```

## Performance Optimization

### Indexing

```sql
-- Create index for frequent searches
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_created_at ON posts(created_at);

-- Composite index for multiple columns
CREATE INDEX idx_posts_user_date ON posts(user_id, created_at);
```

### Query Optimization

1. Use Fetch Joins for N+1 Problems:
```java
@Query("SELECT p FROM Post p JOIN FETCH p.user WHERE p.id = :id")
Optional<Post> findByIdWithUser(@Param("id") Long id);
```

2. Pagination:
```java
@Query("SELECT p FROM Post p")
Page<Post> findPosts(Pageable pageable);
```

3. Projections for Specific Fields:
```java
public interface PostSummary {
    Long getId();
    String getTitle();
    String getAuthorName();
}

@Query("SELECT p.id as id, p.title as title, u.username as authorName " +
       "FROM Post p JOIN p.user u")
List<PostSummary> findPostSummaries();
```

## Best Practices

1. **Database Design**
   - Use appropriate data types
   - Normalize your database
   - Create proper indexes
   - Use constraints for data integrity

2. **Entity Mapping**
   - Use lazy loading appropriately
   - Consider fetch strategies
   - Handle bidirectional relationships
   - Use cascade operations carefully

3. **Performance**
   - Use connection pooling
   - Implement pagination
   - Optimize queries
   - Use caching when appropriate

4. **Security**
   - Never store plain passwords
   - Use prepared statements
   - Implement proper access control
   - Regular backups

5. **Maintenance**
   - Use database migrations
   - Monitor performance
   - Regular cleanup of unused data
   - Keep documentation updated

## Common Issues and Solutions

### Connection Issues
```properties
# Increase timeout
spring.datasource.hikari.connection-timeout=30000

# Enable leak detection
spring.datasource.hikari.leak-detection-threshold=30000
```

### Performance Issues
```java
// Use @BatchSize for collections
@OneToMany(mappedBy = "user")
@BatchSize(size = 20)
private List<Post> posts;

// Use @QueryHints for read-only operations
@QueryHints(value = @QueryHint(name = HINT_READONLY, value = "true"))
List<User> findAllByActive(boolean active);
```

### Memory Issues
```properties
# Limit result set size
spring.data.web.pageable.max-page-size=100

# Configure fetch size
spring.jpa.properties.hibernate.jdbc.fetch_size=50
```

## Next Steps

Now that you understand database integration:
1. Learn about [JPA and Hibernate](./jpa-hibernate.md) in detail
2. Explore [Security](./security.md) implementation
3. Study [Testing](./testing.md) strategies 