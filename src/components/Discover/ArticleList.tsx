'use client';

// import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import styled from 'styled-components';

import LoadingAnimation from '@/components/Loading';
import CountrySelect from './CountrySelect';

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
  imageUrl: string;
  countries?: { name: string; code: string }[];
}

interface ArticleListProps {
  articles: Article[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

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

  const sortedArticles = articles.sort(
    (a, b) => b.createdAt.seconds - a.createdAt.seconds || b.createdAt.nanoseconds - a.createdAt.nanoseconds
  );

  const latestArticles = sortedArticles.slice(0, 5);

  return (
    <>
      {isPending && <LoadingAnimation />}
      <Container>
        <SearchContainer>
          <SearchTitle>Discover Your Next Adventure</SearchTitle>
          <SearchSub>Get inspired, plan your trips, and explore new destinations all in one place.</SearchSub>
        </SearchContainer>
        <MainContent>
          <SidebarContainer>
            <CountrySelect onChange={handleCountryChange} />
            <LatestPostsTitle>Latest Posts</LatestPostsTitle>
            <PostList>
              {latestArticles.map((article) => (
                <PostItem key={article.id} onClick={() => handleArticleClick(article.id)}>
                  <PostImage src={article.coverImage || article.imageUrl} alt={article.title} />
                  <PostInfo>
                    <PostTitle>{article.title}</PostTitle>
                    <PostDate>{new Date(article.createdAt.seconds * 1000).toLocaleDateString()}</PostDate>
                  </PostInfo>
                </PostItem>
              ))}
            </PostList>
          </SidebarContainer>
          <ArticleContainer>
            {filteredArticles?.length > 0 ? (
              filteredArticles.map((article, index) => (
                <ArticleWrapper
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  isFeatured={index === 0 || index % 5 === 0}
                >
                  <ArticleImageWrapper isFeatured={index === 0 || index % 5 === 0}>
                    <ArticleImage src={article.coverImage || article.imageUrl} alt={article.title} />
                  </ArticleImageWrapper>
                  <ArticleContent isFeatured={index === 0 || index % 5 === 0}>
                    <CountryTag>{article.countries?.[0]?.name || 'Unknown Country'}</CountryTag>
                    <ArticleTitle>{article.title}</ArticleTitle>
                    <ArticleDescription>{article.description}</ArticleDescription>
                    <PublishUserWrapper>
                      <UserImg src={article?.photoURL} />
                      <UserDetails>
                        <UserName>{article?.userName} </UserName>
                        <PublishedDate>
                          Published on {new Date(article.createdAt.seconds * 1000).toLocaleDateString()}
                        </PublishedDate>
                      </UserDetails>
                      <ArrowIcon>
                        <MdArrowOutward />
                      </ArrowIcon>
                    </PublishUserWrapper>
                  </ArticleContent>
                </ArticleWrapper>
              ))
            ) : (
              <div>No articles found for this country.</div>
            )}
          </ArticleContainer>
        </MainContent>
      </Container>
    </>
  );
}

const LatestPostsTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0px;
  text-transform: uppercase;

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
  padding: 10px 80px;
  @media (max-width: 1200px) {
    padding: 10px 50px;
    flex-direction: column;
  }
`;

const Container = styled.div`
  margin-top: 40px;
  width: 100%;
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  margin: 90px 0px 20px 0px;
  flex-direction: column;
  align-items: center;
`;

const SearchTitle = styled.h1`
  font-size: 30px;
  font-weight: 700;
  margin-bottom: 10px;
  color: #333;
`;

const SearchSub = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #6c757d;
`;

const PublishUserWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
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
  grid-template-columns: repeat(2, 400px);
  gap: 10px;
  justify-content: center;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const CountryTag = styled.div`
  display: inline-block;
  background-color: #dbdbf0;
  color: #3f51b5;
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
  padding: ${({ isFeatured }) => (isFeatured ? '0 20px' : '0px')};
  width: ${({ isFeatured }) => (isFeatured ? '40%' : '100%')};

  @media (max-width: 1200px) {
    padding: 0px;
    width: 100%;
  }
`;

const ArticleTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 1.2px;
  margin-bottom: 20px;
`;

const ArticleDescription = styled.p`
  font-size: 14px;
  color: #696868;
  margin-bottom: 15px;
  letter-spacing: 2px;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
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
  width: ${({ isFeatured }) => (isFeatured ? '60%' : '100%')};
  height: ${({ isFeatured }) => (isFeatured ? '250px' : '200px')};
  margin-bottom: ${({ isFeatured }) => (isFeatured ? '0' : '15px')};
  border-radius: 18px;

  @media (max-width: 1200px) {
    width: 100%;
    height: 200px;
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
  flex-direction: ${({ isFeatured }) => (isFeatured ? 'row' : 'column')};
  grid-column: ${({ isFeatured }) => (isFeatured ? 'span 2' : 'span 1')};
  grid-row: ${({ isFeatured }) => (isFeatured ? 'span 2' : 'span 2')};
  height: ${({ isFeatured }) => (isFeatured ? '300px' : 'auto')};
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  cursor: pointer;
  width: 100%;
  &:hover {
    background: #ecf6f9;
  }

  @media (max-width: 1200px) {
    flex-direction: column;
    grid-column: span 1;
    grid-row: span 1;
    height: auto;
  }
`;
