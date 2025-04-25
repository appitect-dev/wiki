---
sidebar_position: 2
---

# Backend Integration

This guide covers how to integrate your Next.js frontend with a backend API, including setting up API clients, handling authentication, and managing API calls.

## API Client Setup

### Base Configuration

Create a reusable API client using Axios:

```typescript
// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

## API Services

### User Service

```typescript
// src/services/userService.ts
import api from '@/lib/api';
import { User, CreateUserDto, UpdateUserDto } from '@/types/user';

export const userService = {
  getCurrentUser: () => 
    api.get<User>('/users/me'),
  
  getUserById: (id: string) => 
    api.get<User>(`/users/${id}`),
  
  updateProfile: (data: UpdateUserDto) => 
    api.put<User>('/users/me', data),
    
  createUser: (data: CreateUserDto) =>
    api.post<User>('/users', data),
    
  deleteUser: (id: string) =>
    api.delete(`/users/${id}`),
    
  listUsers: (params?: { page?: number; limit?: number }) =>
    api.get<{ users: User[]; total: number }>('/users', { params }),
};
```

### Authentication Service

```typescript
// src/services/authService.ts
import api from '@/lib/api';
import { LoginDto, RegisterDto, AuthResponse } from '@/types/auth';

export const authService = {
  login: (credentials: LoginDto) =>
    api.post<AuthResponse>('/auth/login', credentials),
    
  register: (data: RegisterDto) =>
    api.post<AuthResponse>('/auth/register', data),
    
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
    
  refreshToken: () =>
    api.post<AuthResponse>('/auth/refresh'),
    
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
    
  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/reset-password', { token, newPassword }),
};
```

## Type Definitions

### User Types

```typescript
// src/types/user.ts
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface CreateUserDto {
  email: string;
  password: string;
  fullName: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  password?: string;
}
```

### Authentication Types

```typescript
// src/types/auth.ts
export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
```

## Error Handling

### API Error Types

```typescript
// src/types/error.ts
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, string[]>;
}

export class ApiException extends Error {
  constructor(
    public statusCode: number,
    public error: ApiError
  ) {
    super(error.message);
    this.name = 'ApiException';
  }
}
```

### Error Handler

```typescript
// src/lib/errorHandler.ts
import { ApiException } from '@/types/error';

export const handleApiError = (error: unknown) => {
  if (error instanceof ApiException) {
    // Handle known API errors
    switch (error.statusCode) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Please log in to continue.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Validation error. Please check your input.';
      default:
        return error.error.message;
    }
  }
  
  // Handle network errors
  if (error instanceof Error) {
    if (error.message === 'Network Error') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again later.';
};
```

## Usage Examples

### Making API Calls in Components

```typescript
// src/components/UserProfile.tsx
import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { userService } from '@/services/userService';
import { handleApiError } from '@/lib/errorHandler';

export const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userService.getCurrentUser();
        setUser(response.data);
      } catch (err) {
        setError(handleApiError(err));
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleUpdateProfile = async (data: UpdateUserDto) => {
    try {
      const response = await userService.updateProfile(data);
      setUser(response.data);
      // Show success message
    } catch (err) {
      // Handle error
      const errorMessage = handleApiError(err);
      // Show error message
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      {/* Render user profile */}
    </div>
  );
};
```

### Using Authentication

```typescript
// src/hooks/useAuth.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { authService } from '@/services/authService';
import { LoginDto, AuthResponse } from '@/types/auth';
import { handleApiError } from '@/lib/errorHandler';

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: LoginDto) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      
      // Store tokens
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and redirect regardless of API call success
      localStorage.clear();
      router.push('/login');
    }
  }, [router]);

  return {
    login,
    logout,
    loading,
    error,
  };
};
```

## Best Practices

1. **Error Handling**
   - Always handle API errors gracefully
   - Provide meaningful error messages to users
   - Log errors for debugging

2. **Authentication**
   - Securely store tokens
   - Implement token refresh mechanism
   - Handle unauthorized access consistently

3. **Type Safety**
   - Define types for all API requests and responses
   - Use TypeScript's strict mode
   - Validate API responses

4. **Performance**
   - Implement request caching where appropriate
   - Use loading states for better UX
   - Handle race conditions in concurrent requests

## Next Steps

1. Learn about [State Management](./state-management.md)
2. Explore [Form Handling](./forms.md)
3. Study [Error Handling](./error-handling.md) in depth 