import ArticleList from '@/components/AllArticle';

// import { fetchAllPublishedArticles } from '@/lib/firebaseApi';

export default async function Home() {
  // const articles = await fetchAllPublishedArticles();
  // console.log(' articles', articles);
  return (
    <>
      <ArticleList />
    </>
  );
}
