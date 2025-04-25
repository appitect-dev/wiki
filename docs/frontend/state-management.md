---
sidebar_position: 4
---

# State Management

This guide covers different approaches to managing state in Next.js applications, from local component state to global state management solutions.

## Local State Management

### useState Hook

```typescript
// src/components/Counter.tsx
import { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};
```

### useReducer Hook

```typescript
// src/components/TodoList.tsx
import { useReducer } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

type Action =
  | { type: 'ADD_TODO'; text: string }
  | { type: 'TOGGLE_TODO'; id: number }
  | { type: 'DELETE_TODO'; id: number };

const todoReducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        {
          id: Date.now(),
          text: action.text,
          completed: false,
        },
      ];
    case 'TOGGLE_TODO':
      return state.map((todo) =>
        todo.id === action.id
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case 'DELETE_TODO':
      return state.filter((todo) => todo.id !== action.id);
    default:
      return state;
  }
};

export const TodoList = () => {
  const [todos, dispatch] = useReducer(todoReducer, []);
  
  const addTodo = (text: string) => {
    dispatch({ type: 'ADD_TODO', text });
  };
  
  return (
    <div>
      {/* Todo list implementation */}
    </div>
  );
};
```

## Context API

### Creating Context

```typescript
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');
  
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### Using Context

```typescript
// src/components/ThemeToggle.tsx
import { useTheme } from '@/contexts/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded ${
        theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      }`}
    >
      {theme === 'dark' ? '🌞' : '🌙'}
    </button>
  );
};
```

## Zustand

### Store Setup

```typescript
// src/store/useStore.ts
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        setUser: (user) => set({ user }),
        setToken: (token) => set({ token }),
        logout: () => set({ user: null, token: null }),
      }),
      {
        name: 'auth-storage',
      }
    )
  )
);
```

### Using Zustand Store

```typescript
// src/components/UserProfile.tsx
import { useAuthStore } from '@/store/useStore';

export const UserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  if (!user) return null;
  
  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## Redux Toolkit

### Store Configuration

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import todoReducer from './slices/todoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todoReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Creating Slices

```typescript
// src/store/slices/todoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoState {
  items: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  items: [],
  loading: false,
  error: null,
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      state.items.push({
        id: Date.now(),
        text: action.payload,
        completed: false,
      });
    },
    toggleTodo: (state, action: PayloadAction<number>) => {
      const todo = state.items.find((item) => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
    },
    deleteTodo: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addTodo, toggleTodo, deleteTodo } = todoSlice.actions;
export default todoSlice.reducer;
```

### Redux Hooks

```typescript
// src/hooks/redux.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/store/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Using Redux

```typescript
// src/components/TodoList.tsx
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { addTodo, toggleTodo, deleteTodo } from '@/store/slices/todoSlice';

export const TodoList = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector((state) => state.todos.items);
  
  const handleAddTodo = (text: string) => {
    dispatch(addTodo(text));
  };
  
  const handleToggleTodo = (id: number) => {
    dispatch(toggleTodo(id));
  };
  
  const handleDeleteTodo = (id: number) => {
    dispatch(deleteTodo(id));
  };
  
  return (
    <div>
      {/* Todo list implementation */}
    </div>
  );
};
```

## Best Practices

1. **Choosing State Management Solution**
   - Use local state for component-specific data
   - Use Context for theme, auth, and other app-wide settings
   - Use Zustand or Redux for complex state management
   - Consider server state management tools like React Query

2. **State Organization**
   - Keep state normalized
   - Avoid redundant state
   - Use appropriate state persistence
   - Implement proper type safety

3. **Performance**
   - Minimize re-renders
   - Use selective state updates
   - Implement proper memoization
   - Monitor state changes

4. **Testing**
   - Test state changes
   - Mock global state in component tests
   - Test async state updates
   - Verify state persistence

## Next Steps

1. Learn about [Form Management](./forms.md)
2. Explore [Data Fetching](./data-fetching.md)
3. Study [Performance Optimization](./performance.md) 