import ArticleContainer from '../components/ArticleContainer';
import EditList from '../components/EditList';

const EditArticlePage = () => {
  return <ArticleContainer ListComponent={EditList} isEdit={true} />;
};

export default EditArticlePage;
