import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { Roboto } from 'next/font/google';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import theme from '../theme';
import { dark } from "@mui/material/styles/createPalette";
import { CssBaseline } from "@mui/material";
import darkTheme from "../theme";


const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});


export const metadata: Metadata = {
  title: "Acton Healthcare",
  description: "Radiologi healthcare System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const [themeMode , setThemeMode] = useState(false);

  return (
    <html lang="en">
      <head>
      <link href="https://fonts.googleapis.com/css2?family=ABeeZee&family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className={roboto.variable}>
        <AppRouterCacheProvider
          options={{ key: 'css', prepend: true }}  >
            
          <ThemeProvider theme={darkTheme}>
          <CssBaseline /> 
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
