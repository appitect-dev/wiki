---
sidebar_position: 3
---

# Component Development

This guide covers how to create and structure components in Next.js using TypeScript and TailwindCSS, including best practices and common patterns.

## Basic Component Structure

### Functional Component Template

```typescript
// src/components/Button.tsx
import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  ...props
}) => {
  const baseStyles = "rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500"
  };
  
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        isLoading && "opacity-75 cursor-not-allowed",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : children}
    </button>
  );
};
```

### Component with State

```typescript
// src/components/Counter.tsx
import { useState, useCallback } from 'react';
import { Button } from './Button';

interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
}

export const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  min = 0,
  max = Infinity,
  onChange
}) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => {
    if (count < max) {
      const newValue = count + 1;
      setCount(newValue);
      onChange?.(newValue);
    }
  }, [count, max, onChange]);
  
  const decrement = useCallback(() => {
    if (count > min) {
      const newValue = count - 1;
      setCount(newValue);
      onChange?.(newValue);
    }
  }, [count, min, onChange]);
  
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant="outline"
        size="sm"
        onClick={decrement}
        disabled={count <= min}
      >
        -
      </Button>
      <span className="text-lg font-medium">{count}</span>
      <Button
        variant="outline"
        size="sm"
        onClick={increment}
        disabled={count >= max}
      >
        +
      </Button>
    </div>
  );
};
```

## Layout Components

### Page Layout

```typescript
// src/components/Layout/PageLayout.tsx
import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Sidebar } from './Sidebar';

interface PageLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showSidebar = true
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        {showSidebar && (
          <Sidebar className="w-64 flex-shrink-0" />
        )}
        <main className="flex-grow p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};
```

### Card Component

```typescript
// src/components/Card.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  footer
}) => {
  return (
    <div className={clsx(
      "bg-white rounded-lg shadow-sm overflow-hidden",
      className
    )}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};
```

## Form Components

### Input Field

```typescript
// src/components/Form/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helpText,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={clsx(
          "block w-full rounded-md shadow-sm",
          "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
```

### Select Field

```typescript
// src/components/Form/Select.tsx
import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Option[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  options,
  className,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          "block w-full rounded-md shadow-sm",
          "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
          error && "border-red-300 focus:border-red-500 focus:ring-red-500",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
```

## Data Display Components

### Table Component

```typescript
// src/components/Table/Table.tsx
import { ReactNode } from 'react';
import clsx from 'clsx';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyMessage?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'No data available'
}: TableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={clsx(
                  "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                  column.className
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={clsx(
                    "px-6 py-4 whitespace-nowrap text-sm text-gray-900",
                    column.className
                  )}
                >
                  {typeof column.accessor === 'function'
                    ? column.accessor(item)
                    : item[column.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Implement proper prop validation
   - Use meaningful component and prop names

2. **Styling**
   - Use TailwindCSS utility classes
   - Create reusable style combinations
   - Maintain consistent spacing and colors
   - Follow responsive design principles

3. **Performance**
   - Memoize callbacks with useCallback
   - Memoize expensive computations with useMemo
   - Use proper React keys for lists
   - Implement lazy loading when needed

4. **Accessibility**
   - Use semantic HTML elements
   - Include ARIA attributes
   - Ensure keyboard navigation
   - Maintain proper color contrast

## Next Steps

1. Learn about [State Management](./state-management.md)
2. Explore [Form Handling](./forms.md)
3. Study [Component Testing](./testing.md) 