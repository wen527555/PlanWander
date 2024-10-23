import ArticleContainer from './components/ArticleContainer';
import ViewList from './components/ViewList';

const ViewArticlePage = () => {
  return <ArticleContainer ListComponent={ViewList} isEdit={false} />;
};

export default ViewArticlePage;
