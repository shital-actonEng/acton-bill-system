'use client';

import { ThemeProvider, CssBaseline } from '@mui/material';
import { useThemeStore } from '@/stores/themeStore';
import { theme, darkTheme } from '@/theme/theme';

export default function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const mode = useThemeStore((state) => state.mode);

  const currentTheme =
    mode === 'light' ? theme : darkTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
