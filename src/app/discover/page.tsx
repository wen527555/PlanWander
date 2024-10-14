import ArticleList from '@/components/Discover/ArticleList';
import { fetchAllPublishedArticles } from '@/lib/firebaseApi';

export const metadata = {
  title: 'Explore Travel Itineraries',
  description: 'Discover travel itineraries tailored to your next adventure.',
};

export default async function DisCoverPage() {
  const articles = await fetchAllPublishedArticles();
  return <ArticleList articles={articles} />;
}
