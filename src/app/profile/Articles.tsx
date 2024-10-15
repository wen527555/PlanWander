'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useState, useTransition } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';
import { SlOptions } from 'react-icons/sl';
import styled from 'styled-components';

import ConfirmModal from '@/components/confirmModal';
import LoadingAnimation from '@/components/Loading';
import { fetchDeleteArticle, fetchUserAllArticles } from '@/lib/firebaseApi';
import { useConfirmModalStore } from '@/lib/store';

type Article = {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  coverImage: string;
  imageUrl: string;
};

const ArticlesContainer = () => {
  const { data: articles = [], isLoading: loadingArticles } = useQuery<any>({
    queryKey: ['userArticles'],
    queryFn: fetchUserAllArticles,
  });
  const router = useRouter();
  const [openMenuArticleId, setOpenArticleId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const openConfirmModal = useConfirmModalStore((state) => state.openModal);
  const handleArticleClick = (articleId: string) => {
    startTransition(() => {
      router.push(`articles/${articleId}`);
    });
  };
  const handleArticleOptionClick = (ArticleId: string) => {
    if (openMenuArticleId === ArticleId) {
      setOpenArticleId(null);
    } else {
      setOpenArticleId(ArticleId);
    }
  };

  const deleteArticleMutation = useMutation({
    mutationFn: fetchDeleteArticle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userArticles'] });
    },
    onError: (error) => {
      console.error('Error deleting trip:', error);
    },
  });

  const handleDeleteArticleClick = (articleId: string) => {
    openConfirmModal('Are you sure you want to delete this article? This action is not reversible!', () => {
      deleteArticleMutation.mutate(articleId);
    });
  };

  if (loadingArticles) {
    return <LoadingAnimation />;
  }

  if (!articles.length) {
    return (
      <NoArticleContainer>
        <NoArticleTitle>Create your first article</NoArticleTitle>
        <NoArticleTitleDescription>
          Click the 「Publish」 button on the top right corner to create your first article.🚀
        </NoArticleTitleDescription>
      </NoArticleContainer>
    );
  }

  return (
    <>
      {isPending && <LoadingAnimation />}
      <ConfirmModal />
      <ArticleContainer>
        {articles.map((article: Article) => (
          <CardWrapper key={article.id}>
            <ArticleHeader>
              <OptionIcon onClick={() => handleArticleOptionClick(article.id)} />
              {openMenuArticleId === article.id && (
                <Menu>
                  <MenuItem>
                    <DeleteWrapper onClick={() => handleDeleteArticleClick(article.id)}>
                      <DeleteIcon />
                      Delete
                    </DeleteWrapper>
                  </MenuItem>
                </Menu>
              )}
            </ArticleHeader>
            <ArticleWrapper onClick={() => handleArticleClick(article.id)}>
              <ArticleContent>
                <ArticleTitle>{article.title}</ArticleTitle>
                <ArticleDescription>{article.description}</ArticleDescription>
                <PublishedDate>Published on {article.createdAt}</PublishedDate>
              </ArticleContent>
              <ArticleImage src={article.coverImage || article.imageUrl} alt={article.title} />
            </ArticleWrapper>
          </CardWrapper>
        ))}
      </ArticleContainer>
    </>
  );
};

export default ArticlesContainer;

const NoArticleContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
`;

const NoArticleTitle = styled.h1`
  font-size: 40px;
  font-weight: bold;
  color: #34495e;
  margin-bottom: 20px;
`;

const NoArticleTitleDescription = styled.p`
  font-size: 24px;
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 30px;
`;

const ArticleContainer = styled.div`
  margin: 0;
  width: 70%;
  padding: 10px 5px;
`;

const CardWrapper = styled.div`
  width: 100%;
  cursor: pointer;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 20px;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */

  &:hover {
    opacity: 1;
    background: #ecf6f9;
    border-radius: 10px;
  }
`;

const ArticleHeader = styled.div`
  width: 100%;
  height: 20px;
  padding: 5px 20px;
  display: flex;
  justify-content: end;
  position: relative;
`;

const OptionIcon = styled(SlOptions)`
  cursor: pointer;
  font-size: 15px;
  margin-left: 10px;
`;

const Menu = styled.div`
  position: absolute;
  top: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DeleteWrapper = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
`;

const DeleteIcon = styled(AiOutlineDelete)`
  font-size: 18px;
  margin-right: 5px;
`;

const ArticleWrapper = styled.div`
  display: flex;
  gap: 50px;
  justify-content: space-between;
  padding: 20px;
  height: 250px;
  cursor: pointer;
  align-items: center;

  @media (max-width: 1200px) {
    flex-direction: column;
    height: auto;
    gap: 20px;
  }
`;

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 15px;
  height: 100%;
`;

const ArticleTitle = styled.h2`
  font-size: 20px;
  margin-bottom: 15px;
  font-weight: 700;
  letter-spacing: 1.2px;
`;

const ArticleDescription = styled.p`
  font-size: 15px;
  color: #696868;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: auto;
  margin-top: 15px;

  letter-spacing: 2px;
  font-weight: 500;
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
  @media (max-width: 1200px) {
    width: 100%;
    order: -1;
  }
`;
