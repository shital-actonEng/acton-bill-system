import type { Metadata } from "next";
import "./globals.css";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { CssBaseline } from "@mui/material";
import Header from "@/components/Header";
import ThemeWrapper from "@/theme/ThemeWrapper";

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
      </head>
      <body>
        <AppRouterCacheProvider
          options={{ key: 'css', prepend: true }}  >
            <ThemeWrapper>
          <CssBaseline /> 
          <Header>
            {children}
          </Header>
          </ThemeWrapper>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}

// app/layout.tsx

// import React from 'react';
// import "./globals.css"; // or any global CSS you use
// import { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'My App',
//   description: 'Generated by Next.js',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head />
//       <body>{children}</body>
//     </html>
//   );
// }
