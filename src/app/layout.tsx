// import { Metadata } from 'next';
'use client';

//! layout應該是不能用use client的
import { createTheme, ThemeProvider } from '@mui/material';
import { usePathname } from 'next/navigation';

import StyledComponentsRegistry from '../lib/registry';

import './globals.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Inter } from 'next/font/google';

import Header from '../components/Header';
import QueryProvider from '../lib/queryProvider';

const inter = Inter({ subsets: ['latin'] });

const theme = createTheme({
  palette: {
    primary: {
      main: '#F9FCFD',
    },
    secondary: {
      main: '#e3e1e7',
    },
  },
});
// export const metadata: Metadata = {
//   title: `planwander`,
//   description: `planwander`,
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = /^\/trips(\/[a-zA-Z0-9]+)?$/.test(pathname);
  return (
    <QueryProvider>
      <html lang="en">
        <body className={inter.className}>
          <ThemeProvider theme={theme}>
            <StyledComponentsRegistry>
              {!hideHeader && <Header />}
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
              <div id="modal-root"></div>
            </StyledComponentsRegistry>
          </ThemeProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
