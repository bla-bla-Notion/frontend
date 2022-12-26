import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/MainPage';
import PostDetailPage from '../pages/PostDetailPage';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:postId" element={<PostDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
