'use client';

import { usePathname } from 'next/navigation';

import Header from '@/components/Header';

const HeaderWrapper = () => {
  const pathname = usePathname();

  const hideHeader =
    /^\/trip\/[a-zA-Z0-9\-]+$/.test(pathname) ||
    /^\/article\/[a-zA-Z0-9\-]+$/.test(pathname) ||
    /^\/article\/[a-zA-Z0-9\-]+\/edit$/.test(pathname);

  if (hideHeader) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
