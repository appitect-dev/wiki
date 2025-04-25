# Frontend Development

This guide covers modern frontend development using React, Next.js, TypeScript, and TailwindCSS.

## React

React is a JavaScript library for building user interfaces. Key concepts include:

### Components
- Reusable UI pieces
- Can be functional or class-based
- Accept props and manage state
- Follow a unidirectional data flow

Example of a functional component:
```tsx
interface UserProps {
  name: string;
  email: string;
}

const UserCard: React.FC<UserProps> = ({ name, email }) => {
  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold">{name}</h2>
      <p className="text-gray-600">{email}</p>
    </div>
  );
};
```

### Hooks
Common React hooks:
- `useState`: Manage component state
- `useEffect`: Handle side effects
- `useContext`: Access context data
- `useRef`: Reference DOM elements
- `useMemo`: Memoize computed values
- `useCallback`: Memoize functions

Example:
```tsx
const Counter: React.FC = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
};
```

## Next.js

Next.js is a React framework that provides:

### Routing
- File-system based routing
- Dynamic routes
- Nested routes
- Route handlers (API routes)

Example structure:
```
app/
  page.tsx           # Home page (/)
  about/
    page.tsx         # About page (/about)
  blog/
    [slug]/
      page.tsx       # Dynamic blog post (/blog/post-1)
  api/
    users/
      route.ts       # API endpoint (/api/users)
```

### Data Fetching
Methods for getting data:
```tsx
// Server Component
async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await fetchPost(params.slug);
  return <article>{post.content}</article>;
}

// Client Component
const Profile: React.FC = () => {
  const { data, error } = useSWR('/api/user', fetcher);
  if (error) return <div>Error loading</div>;
  if (!data) return <div>Loading...</div>;
  return <div>{data.name}</div>;
};
```

### Rendering
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- Client-Side Rendering (CSR)

## TypeScript

TypeScript adds static typing to JavaScript:

### Basic Types
```typescript
// Primitives
const name: string = 'John';
const age: number = 30;
const isActive: boolean = true;

// Arrays
const numbers: number[] = [1, 2, 3];
const names: Array<string> = ['John', 'Jane'];

// Objects
interface User {
  id: number;
  name: string;
  email?: string; // Optional
}

// Functions
function add(a: number, b: number): number {
  return a + b;
}
```

### Advanced Types
```typescript
// Union Types
type Status = 'pending' | 'success' | 'error';

// Generic Types
interface Response<T> {
  data: T;
  status: Status;
}

// Utility Types
type UserPartial = Partial<User>;
type UserReadonly = Readonly<User>;
type UserPick = Pick<User, 'id' | 'name'>;
```

## TailwindCSS

TailwindCSS is a utility-first CSS framework:

### Basic Usage
```tsx
// Component with Tailwind classes
const Card: React.FC = () => {
  return (
    <div className="
      p-6 
      bg-white 
      rounded-lg 
      shadow-md 
      hover:shadow-lg 
      transition-shadow
    ">
      <h2 className="text-xl font-bold text-gray-800">
        Title
      </h2>
      <p className="mt-2 text-gray-600">
        Content
      </p>
    </div>
  );
};
```

### Common Patterns
```tsx
// Responsive Design
<div className="
  w-full          // Mobile
  md:w-1/2       // Medium screens
  lg:w-1/3       // Large screens
">

// Flexbox
<div className="
  flex 
  items-center 
  justify-between
">

// Grid
<div className="
  grid 
  grid-cols-1 
  md:grid-cols-2 
  lg:grid-cols-3 
  gap-4
">

// Dark Mode
<div className="
  bg-white 
  dark:bg-gray-800 
  text-gray-900 
  dark:text-white
">
```

### Custom Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#1a73e8',
        secondary: '#7c3aed',
      },
      spacing: {
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
```

## Best Practices

### Code Organization
- Use feature-based folder structure
- Keep components small and focused
- Separate business logic from UI
- Use TypeScript for better maintainability

### Performance
- Use proper React hooks
- Implement code splitting
- Optimize images
- Minimize bundle size
- Use proper caching strategies

### Accessibility
- Use semantic HTML
- Include ARIA attributes
- Ensure keyboard navigation
- Test with screen readers

## Next Steps

To continue learning:
- [State Management](./state-management.md)
- [Testing](./testing.md)
- [Performance Optimization](./performance.md)
- [Backend Integration](../backend/overview.md) 