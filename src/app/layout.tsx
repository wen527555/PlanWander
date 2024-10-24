import StyledComponentsRegistry from '@/lib/registry';

import './globals.css';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dynamic from 'next/dynamic';
import { Inter } from 'next/font/google';

import QueryProvider from '../lib/queryProvider';

export const metadata = {
  title: 'PlanWander',
  description: 'PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。',
};

const HeaderWrapper = dynamic(() => import('@/components/Header/HeaderWrapper'), { ssr: false });
const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <html lang="en">
        <head>
          <link rel="icon" href="/icon.png" sizes="any" />
          <meta name="description" content="PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。" />
          <meta name="keywords" content="旅行規劃, 免費, 旅遊, 旅行計畫, 規劃旅程, 旅行工具, 行程分享, PlanWander" />
          <meta name="author" content="Frontend Developer" />
          <meta name="robots" content="index, follow" />
        </head>
        <body className={inter.className}>
          <StyledComponentsRegistry>
            <HeaderWrapper />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
            <div id="modal-root" />
          </StyledComponentsRegistry>
        </body>
      </html>
    </QueryProvider>
  );
}
