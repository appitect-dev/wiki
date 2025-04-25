---
sidebar_position: 5
---

# Data Access with JPA and Hibernate

This guide provides a deep dive into using JPA (Java Persistence API) and Hibernate with Spring Boot, covering advanced concepts and best practices.

## JPA Basics

### Entity Lifecycle

JPA entities have four states:
1. **New/Transient**: Object instance not associated with persistence context
2. **Managed**: Object attached to persistence context
3. **Detached**: Object was managed but no longer associated
4. **Removed**: Object marked for deletion

```java
// New/Transient
User user = new User();
user.setName("John");

// Managed
entityManager.persist(user);
// or
userRepository.save(user);

// Detached
entityManager.detach(user);
// or
entityManager.clear();

// Removed
entityManager.remove(user);
// or
userRepository.delete(user);
```

## Advanced Entity Mapping

### Inheritance Strategies

#### 1. Single Table
```java
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type")
public abstract class Payment {
    @Id
    private Long id;
    private BigDecimal amount;
}

@Entity
@DiscriminatorValue("CREDIT")
public class CreditCardPayment extends Payment {
    private String cardNumber;
    private String cardHolder;
}

@Entity
@DiscriminatorValue("BANK")
public class BankTransferPayment extends Payment {
    private String accountNumber;
    private String bankName;
}
```

#### 2. Joined Table
```java
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Vehicle {
    @Id
    private Long id;
    private String manufacturer;
}

@Entity
public class Car extends Vehicle {
    private int numberOfDoors;
    private String fuelType;
}

@Entity
public class Motorcycle extends Vehicle {
    private boolean hasSidecar;
    private int engineCapacity;
}
```

### Complex Mappings

#### Embedded Objects
```java
@Embeddable
public class Address {
    private String street;
    private String city;
    private String state;
    private String zipCode;
    
    // Getters and setters
}

@Entity
public class User {
    @Id
    private Long id;
    
    @Embedded
    private Address address;
    
    @AttributeOverrides({
        @AttributeOverride(name = "street", 
            column = @Column(name = "work_street")),
        @AttributeOverride(name = "city", 
            column = @Column(name = "work_city"))
    })
    @Embedded
    private Address workAddress;
}
```

#### Element Collections
```java
@Entity
public class Product {
    @Id
    private Long id;
    
    @ElementCollection
    @CollectionTable(name = "product_categories",
        joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "category")
    private Set<String> categories = new HashSet<>();
    
    @ElementCollection
    @CollectionTable(name = "product_prices",
        joinColumns = @JoinColumn(name = "product_id"))
    @MapKeyColumn(name = "currency")
    @Column(name = "price")
    private Map<String, BigDecimal> pricesPerCurrency = new HashMap<>();
}
```

## Advanced Relationships

### Bidirectional Relationships
```java
@Entity
public class Order {
    @Id
    private Long id;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
    
    public void removeItem(OrderItem item) {
        items.remove(item);
        item.setOrder(null);
    }
}

@Entity
public class OrderItem {
    @Id
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;
    
    // Other fields and methods
}
```

### Self-Referential Relationships
```java
@Entity
public class Employee {
    @Id
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Employee manager;
    
    @OneToMany(mappedBy = "manager")
    private List<Employee> subordinates = new ArrayList<>();
}
```

## Advanced JPA Repository Features

### Custom Queries

#### 1. Query Methods
```java
public interface UserRepository extends JpaRepository<User, Long> {
    // Derived query methods
    List<User> findByEmailAndActive(String email, boolean active);
    
    List<User> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
    
    @Query("SELECT u FROM User u WHERE u.lastLoginDate > :date " +
           "AND u.status = :status")
    List<User> findActiveUsersSince(
        @Param("date") LocalDateTime date,
        @Param("status") UserStatus status);
    
    // Native queries
    @Query(value = "SELECT * FROM users WHERE " +
           "tsv @@ plainto_tsquery(:query)",
           nativeQuery = true)
    List<User> fullTextSearch(@Param("query") String query);
}
```

#### 2. Specifications
```java
public class UserSpecifications {
    public static Specification<User> hasEmail(String email) {
        return (root, query, cb) -> 
            cb.equal(root.get("email"), email);
    }
    
    public static Specification<User> createdAfter(LocalDateTime date) {
        return (root, query, cb) ->
            cb.greaterThan(root.get("createdAt"), date);
    }
}

// Usage
userRepository.findAll(
    where(hasEmail(email))
    .and(createdAfter(startDate))
);
```

## Performance Optimization

### 1. Batch Operations
```java
@Service
@Transactional
public class UserService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EntityManager entityManager;
    
    public void saveUsers(List<User> users) {
        for (int i = 0; i < users.size(); i++) {
            entityManager.persist(users.get(i));
            if (i % 50 == 0) {
                entityManager.flush();
                entityManager.clear();
            }
        }
    }
}
```

### 2. Caching
```java
@Entity
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Product {
    @Id
    private Long id;
    
    @Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
    @ManyToMany
    private Set<Category> categories = new HashSet<>();
}

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    @QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
    List<Product> findByCategory(Category category);
}
```

### 3. Fetch Strategies
```java
@Entity
public class Blog {
    @Id
    private Long id;
    
    @OneToMany(mappedBy = "blog")
    @BatchSize(size = 25)
    private List<Post> posts = new ArrayList<>();
    
    @ManyToMany
    @LazyCollection(LazyCollectionOption.EXTRA)
    private Set<Tag> tags = new HashSet<>();
}
```

## Transaction Management

### Transaction Annotations
```java
@Service
public class OrderService {
    @Transactional(
        propagation = Propagation.REQUIRED,
        isolation = Isolation.READ_COMMITTED,
        rollbackFor = OrderException.class,
        timeout = 30
    )
    public Order createOrder(OrderRequest request) {
        // Business logic
    }
    
    @Transactional(readOnly = true)
    public List<Order> getUserOrders(Long userId) {
        // Read-only operations
    }
}
```

### Programmatic Transactions
```java
@Service
@RequiredArgsConstructor
public class PaymentService {
    private final TransactionTemplate transactionTemplate;
    
    public Payment processPayment(PaymentRequest request) {
        return transactionTemplate.execute(status -> {
            try {
                // Payment processing logic
                return payment;
            } catch (Exception e) {
                status.setRollbackOnly();
                throw e;
            }
        });
    }
}
```

## Best Practices

1. **Entity Design**
   - Use appropriate fetch types
   - Implement equals() and hashCode()
   - Consider using @NaturalId
   - Handle bidirectional relationships properly

2. **Query Optimization**
   - Use projections for specific data
   - Implement pagination
   - Avoid N+1 problems
   - Use batch operations

3. **Transaction Management**
   - Keep transactions short
   - Use appropriate isolation levels
   - Handle exceptions properly
   - Consider read-only transactions

4. **Performance**
   - Use caching strategically
   - Implement batch processing
   - Monitor query performance
   - Use appropriate fetch strategies

## Common Issues and Solutions

### N+1 Problem
```java
// Bad
List<Order> orders = orderRepository.findAll(); // 1 query
orders.forEach(order -> order.getItems().size()); // N queries

// Good
@Query("SELECT o FROM Order o JOIN FETCH o.items")
List<Order> findAllWithItems(); // 1 query
```

### Memory Issues
```java
// Stream large results
@Transactional(readOnly = true)
public void processLargeData() {
    repository.findAllByStreamable()
        .forEach(this::processItem);
}
```

### Lazy Loading Exceptions
```java
// Solution 1: Use JOIN FETCH
@Query("SELECT u FROM User u JOIN FETCH u.roles WHERE u.id = :id")
Optional<User> findByIdWithRoles(@Param("id") Long id);

// Solution 2: Use @EntityGraph
@EntityGraph(attributePaths = {"roles", "permissions"})
Optional<User> findById(Long id);
```

## Next Steps

Now that you understand JPA and Hibernate:
1. Learn about [Security](./security.md) implementation
2. Study [Testing](./testing.md) strategies
3. Explore [API Documentation](./api-docs.md) 