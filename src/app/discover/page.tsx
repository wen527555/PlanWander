import ArticleList from '@/components/Discover/ArticleList';
import { fetchAllPublishedArticles } from '@/lib/firebaseApi';

export const metadata = {
  title: 'Discover Your Next Adventure',
  description: 'Get inspired, plan your trips, and explore new destinations all in one place.',
};

export default async function DisCoverPage() {
  const initialArticles = await fetchAllPublishedArticles();
  return <ArticleList initialArticles={initialArticles} />;
}
