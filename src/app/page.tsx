import Image from 'next/image';

import styles from '@/app/styles/LandingPage.module.css';
import ClientAction from '@/components/Landing/ClientActions';
import bgImage from '@/public/travel.jpg';

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
      <div className={styles.detailSection}>
        <video className={styles.styledVideo} autoPlay loop muted>
          <source src="/searchVideo.mp4" type="video/mp4" />
        </video>
        <div className={styles.detail2}>
          <h1 className={styles.heading}>Your itinerary and your map in one view</h1>
          <p className={styles.description}>
            No more switching between different apps, tabs, and tools to keep track of your travel plans.
          </p>
        </div>
      </div>
      <div className={styles.detailSection}>
        <div className={styles.detail3}>
          <h1 className={styles.heading}>Read stories along with map</h1>
          <p className={styles.description}>
            Browse the map alongside travel stories, following in the footsteps of each attraction.
          </p>
        </div>
        <video className={styles.styledVideo} autoPlay loop muted>
          <source src="/articleVideo.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.section4}>
        <h3 className={styles.section4Title}>Ready to plan your trip in half the time?</h3>
        <div className={styles.buttonGroup}>
          <ClientAction />
        </div>
      </div>
    </>
  );
};

export default HomePage;
