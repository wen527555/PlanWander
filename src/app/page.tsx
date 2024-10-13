import dynamic from 'next/dynamic';
import Image from 'next/image';

import styles from '@/app/styles/HomePage.module.css';
import bgImage from '@/public/travel.jpg';

const ClientAction = dynamic(() => import('@/components/Landing/ClientActions'), { ssr: false });
const LandingPageContent = dynamic(() => import('@/components/Landing/LandingContent'), { ssr: false });

export const metadata = {
  title: 'PlanWander',
  description: 'PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。',
  keywords: '旅行, 行程規劃, 度假, 旅程, 旅遊地圖',
  robots: 'index, follow',
  openGraph: {
    title: 'PlanWander - 為每個人設計的旅行規劃工具',
    description: 'PlanWander 是一個免費的旅行規劃網站，讓您輕鬆安排並規劃旅程。',
    images: [{ url: '/travel.jpg' }],
    type: 'website',
  },
};

const HomePage = () => {
  return (
    <>
      <div className={styles.pageWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.textSection}>
            <h1 className={styles.heading}>A travel planner for everyone</h1>
            <p className={styles.description}>
              Organize your trip and map it out on a free travel website designed for vacation planning.
            </p>
            <div className={styles.buttonGroup}>
              <ClientAction />
            </div>
          </div>
        </div>
        <div className={styles.imageSection}>
          <Image src={bgImage} alt="Travel planning" fill objectFit="cover" quality={100} />
        </div>
      </div>
      <LandingPageContent />
    </>
  );
};

export default HomePage;
