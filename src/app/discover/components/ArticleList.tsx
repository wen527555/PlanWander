'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
import { fetchAllPublishedArticles } from '@/lib/firebaseApi';

const CountrySelect = dynamic(() => import('./CountrySelect'), { ssr: false });

interface Article {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  coverImage?: string;
  photoURL?: string;
  userName?: string;
  imageUrl: string;
  countries?: { name: string; code: string }[];
}

interface ArticleListProps {
  initialArticles: Article[];
}

export default function ArticleList({ initialArticles }: ArticleListProps) {
  const [articles, setArticles] = useState(initialArticles);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      const data = await fetchAllPublishedArticles();
      setArticles(data);
    };
    fetchArticles();
  }, []);

  const filteredArticles = selectedCountry
    ? articles.filter(
        (article) =>
          Array.isArray(article.countries) && article.countries.some((country) => country.code === selectedCountry)
      )
    : articles;

  const handleCountryChange = (selectedOption: { code: string } | null) => {
    setSelectedCountry(selectedOption ? selectedOption.code : null);
  };

  const handleArticleClick = (articleId: string) => {
    startTransition(() => {
      router.push(`articles/${articleId}/view`);
    });
  };

  const sortedArticles = articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const latestArticles = sortedArticles.slice(-3);

  return (
    <>
      {isPending && <LoadingAnimation />}
      <Container>
        <MainContent>
          <SidebarContainer>
            <CountrySelect onChange={handleCountryChange} />
            <LatestPostsTitle>Recommend Reading</LatestPostsTitle>
            <PostList>
              {latestArticles.map((article) => (
                <PostItem key={article.id} onClick={() => handleArticleClick(article.id)}>
                  <PostImage src={article.coverImage || article.imageUrl} alt={article.title} />
                  <PostInfo>
                    <PostTitle>{article.title}</PostTitle>
                    <PostDate>{article.createdAt.toLocaleDateString()}</PostDate>
                  </PostInfo>
                </PostItem>
              ))}
            </PostList>
          </SidebarContainer>
          <ArticleContainer>
            {filteredArticles?.length > 0 ? (
              filteredArticles.map((article) => (
                <ArticleWrapper key={article.id} onClick={() => handleArticleClick(article.id)}>
                  <ArticleImageWrapper>
                    <ArticleImage src={article.coverImage || article.imageUrl} alt={article.title} />
                  </ArticleImageWrapper>
                  <ArticleContent>
                    {article.countries?.length ? <CountryTag>{article.countries[0].name}</CountryTag> : null}
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleDescription>{article.description}</ArticleDescription>
                    <PublishUserWrapper>
                      <UserImg src={article?.photoURL} />
                      <UserDetails>
                        <UserName>{article?.userName} </UserName>
                        <PublishedDate>Published on {article.createdAt.toLocaleDateString()}</PublishedDate>
                      </UserDetails>
                      <ArrowIcon>
                        <MdArrowOutward />
                      </ArrowIcon>
                    </PublishUserWrapper>
                  </ArticleContent>
                </ArticleWrapper>
              ))
            ) : (
              <NoArticleContainer>
                <NoArticleTitle>No articles found for this country.</NoArticleTitle>
                <NoArticleTitleDescription>
                  Planning is where the adventure starts. Plan a new trip and start yours! 🚀
                </NoArticleTitleDescription>
              </NoArticleContainer>
            )}
          </ArticleContainer>
        </MainContent>
      </Container>
    </>
  );
}

const NoArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const NoArticleTitle = styled.h1`
  font-size: 30px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 20px;
`;

const NoArticleTitleDescription = styled.p`
  font-size: 18px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
`;

const LatestPostsTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0px;
  /* text-transform: uppercase; */

  @media (max-width: 945px) {
    display: none;
  }
`;

const PostList = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  margin-bottom: 20px;

  @media (max-width: 945px) {
    display: none;
  }
`;

const PostItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const PostImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 5px;
  object-fit: cover;
  margin-right: 15px;
`;

const PostInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const PostTitle = styled.a`
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  &:hover {
    color: #3f51b5;
  }
`;

const PostDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const SidebarContainer = styled.div`
  width: 350px;
  padding: 16px 24px;
  flex-shrink: 0;
`;

const MainContent = styled.div`
  display: flex;
  width: 100%;
  margin: 80px 0px;
  @media (min-width: 1920px) {
    padding: 10px 100px 10px 80px;
    gap: 20px;
  }

  @media (max-width: 1919px) {
    padding: 10px 80px 10px 60px;
    gap: 20px;
  }
  @media (max-width: 945px) {
    padding: 10px 50px;
    flex-direction: column;
  }
`;

const Container = styled.div`
  margin-top: 40px;
  width: 100%;
`;

const PublishUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

const UserImg = styled.img`
  border-radius: 50%;
  width: 35px;
  height: 35px;
  object-fit: cover;
  margin-right: 10px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const ArticleContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  justify-content: center;
  gap: 10px;
  width: 75%;
  margin: 0 auto;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CountryTag = styled.div`
  display: inline-block;
  color: #3f51b5;
  background-color: #eef2fe;
  color: #827def;
  font-size: 15px;
  padding: 5px 10px;
  border-radius: 20px;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 12px;
  padding: 5px 10px;
  max-width: 100px;
  text-align: center;
`;

const ArticleContent = styled.div<{ isFeatured?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  width: 100%;
  @media (max-width: 1200px) {
    padding: 0px;
    width: 100%;
  }
`;

const ArticleTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: 30px;
  line-height: 1.5;
`;

const ArticleDescription = styled.p`
  font-size: 14px;
  color: #696868;
  margin-bottom: auto;
  letter-spacing: 2px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
`;

const PublishedDate = styled.p`
  margin-top: 5px;
  font-size: 12px;
  color: #999;
`;

const ArrowIcon = styled.div`
  margin-left: auto;
  font-size: 16px;
  color: #333;
  display: flex;
  align-items: center;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateX(5px);
  }
`;

const ArticleImageWrapper = styled.div<{ isFeatured?: boolean }>`
  overflow: hidden;
  margin-bottom: 15px;
  width: ${({ isFeatured }) => (isFeatured ? '55%' : '100%')};
  border-radius: 18px;
  height: 100%;
  width: 50%;
  @media (max-width: 1200px) {
    width: 100%;
    height: 250px;
    margin-bottom: 15px;
    border-radius: 15px;
  }
`;

const ArticleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  &:hover {
    transform: scale(1.05);
  }
`;
const ArticleWrapper = styled.div<{ isFeatured?: boolean }>`
  display: flex;
  height: 250px;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  gap: 30px;
  &:hover {
    background: #ecf6f9;
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    height: auto;
    gap: 0px;
  }
`;
