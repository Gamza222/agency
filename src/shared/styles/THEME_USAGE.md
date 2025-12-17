# 🌙 Theme System - Simple Usage

## 🚀 Quick Setup

### 1. Wrap your app

```tsx
import { ThemeProvider, ThemeScript } from '@/shared/lib/theme';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <ThemeScript />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Import styles

```scss
// In your main CSS file
@use '@/shared/styles' as design-system;
```

## 🎛️ Using Themes

### Simple Toggle Button

```tsx
import { ThemeToggle } from '@/shared/ui/ThemeToggle';

<ThemeToggle />;
```

### Custom Theme Control

```tsx
import { useTheme, THEME } from '@/shared/lib/theme';

function MyComponent() {
  const { theme, isDark, setTheme, toggleTheme } = useTheme();

  return (
    <div>
      <p>Current: {theme}</p>
      <p>Dark mode: {isDark ? 'Yes' : 'No'}</p>

      <button onClick={toggleTheme}>Toggle</button>
      <button onClick={() => setTheme(THEME.LIGHT)}>Light</button>
      <button onClick={() => setTheme(THEME.DARK)}>Dark</button>
      <button onClick={() => setTheme(THEME.SYSTEM)}>System</button>
    </div>
  );
}
```

## 🎨 Using Theme Colors in CSS

All colors automatically switch:

```scss
.my-component {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border-default);

  &:hover {
    background: var(--color-state-hover);
  }
}
```

## ⚙️ Provider Options

```tsx
<ThemeProvider
  defaultTheme={THEME.LIGHT} // Default: THEME.SYSTEM
  enableSystem={true} // Default: true
>
  {children}
</ThemeProvider>
```

## 📚 Available Values

- **Themes**: `THEME.LIGHT`, `THEME.DARK`, `THEME.SYSTEM`
- **Hook**: `useTheme()` returns `{ theme, resolvedTheme, setTheme, toggleTheme, isDark }`
- **Components**: `<ThemeToggle size="sm|md|lg" className="..." />`

That's it! Perfect React patterns with no complexity. 🎉
