// src/redux/modules/config/configStore.js

import { configureStore } from '@reduxjs/toolkit';
import Post from '../modules/PostsSlice';

// //
//  * 모듈(Slice)이 여러개인 경우
//  * 추가할때마다 reducer 안에 각 모듈의 slice.reducer를 추가해줘야 합니다.
const store = configureStore({
  reducer: { Post: Post },
  //devtools 배포환경에선 사용못하도록 막기위함
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
