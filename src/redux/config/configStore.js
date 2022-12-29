import { configureStore } from '@reduxjs/toolkit';
import Post from '../modules/PostsSlice';

const store = configureStore({
  reducer: { Post: Post },
  //devtools 배포환경에선 사용못하도록 막기위함
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
