import StyledComponentsRegistry from '@/lib/registry';

import './globals.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';

import GoogleApiProvider from '@/lib/GoogleApiProvider';
import QueryProvider from '../lib/queryProvider';

export const metadata = {
  title: 'PlanWander',
  description: 'PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。',
};

const HeaderWrapper = dynamic(() => import('@/components/Header/HeaderWrapper'), { ssr: false });
const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleApiProvider>
      <QueryProvider>
        <html lang="en">
          <head>
            <link rel="icon" href="/planWanderIcon.png" sizes="any" />
            <meta name="description" content="PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。" />
          </head>
          <body className={inter.className}>
            <StyledComponentsRegistry>
              <HeaderWrapper />
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </StyledComponentsRegistry>
          </body>
        </html>
      </QueryProvider>
    </GoogleApiProvider>
  );
}
