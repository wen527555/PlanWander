'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { fetchAllPublishedArticles } from '@/lib/firebaseApi';

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  coverImage?: string;
  photoURL?: string;
  userName?: string;
}

export default function ArticleList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const router = useRouter();
  console.log('articles', articles);
  useEffect(() => {
    const fetchArticles = async () => {
      const data = await fetchAllPublishedArticles();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  const handleArticleClick = (articleId: string) => {
    router.push(`articles/${articleId}/view`);
  };

  return (
    <Container>
      <ArticleContainer>
        {articles.length > 0 ? (
          articles.map((article) => (
            <ArticleWrapper key={article.id} onClick={() => handleArticleClick(article.id)}>
              <ArticleContent>
                <PublishUserWrapper>
                  <UserImg src={article?.photoURL} />
                  <UserName>{article?.userName} </UserName>
                </PublishUserWrapper>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleDescription>{article.description}</ArticleDescription>
                <PublishedDate>
                  Published on {new Date(article.createdAt.seconds * 1000).toLocaleDateString()}
                </PublishedDate>
              </ArticleContent>
              {article.coverImage && (
                <ArticleImage src={article.coverImage} alt={article.title} width={150} height={100} />
              )}
            </ArticleWrapper>
          ))
        ) : (
          <p></p>
        )}
      </ArticleContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  /* height: 100vh; */
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PublishUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const UserImg = styled.img`
  cursor: pointer;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  margin-right: 10px;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
`;

const ArticleContainer = styled.div`
  margin: 10px 50px;
  width: 70%;
`;

const ArticleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 250px;
  cursor: pointer;
  align-items: center;
`;

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  justify-content: space-between;
  height: 100%;
  padding: 20px;
`;

const ArticleTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
`;

const ArticleDescription = styled.p`
  font-size: 16px;
  color: #555;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: auto;
`;

const PublishedDate = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: #999;
`;

const ArticleImage = styled.img`
  width: 250px;
  height: auto;
  object-fit: cover;
  height: 90%;
  border-radius: 10px;
`;
