'use client';

import { usePathname } from 'next/navigation';

import Header from '@/components/Header';

const HeaderWrapper = () => {
  const pathname = usePathname();

  const hideHeader = /^(\/trips|\/articles\/[a-zA-Z0-9\-]+(?:\/view)?)$/.test(pathname);

  if (hideHeader) {
    return null;
  }

  return <Header />;
};

export default HeaderWrapper;
