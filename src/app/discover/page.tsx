import ArticleBlog from '@/app/discover/components/ArticleBlog';
import { fetchAllPublishedArticles } from '@/services/firebaseApi';

export const metadata = {
  title: 'Discover Your Next Adventure',
  description: 'Get inspired, plan your trips, and explore new destinations all in one place.',
};

export default async function DisCoverPage() {
  const initialArticles = await fetchAllPublishedArticles();
  return <ArticleBlog initialArticles={initialArticles} />;
}
