import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/MainPage';
import PostDetailPage from '../pages/PostDetailPage';
import Layout from '../components/Layout';

const Router = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:postId" element={<PostDetailPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
