// src/redux/modules/config/configStore.js

import { configureStore } from '@reduxjs/toolkit';
import Post from '../modules/PostsSlice';

// //
//  * 모듈(Slice)이 여러개인 경우
//  * 추가할때마다 reducer 안에 각 모듈의 slice.reducer를 추가해줘야 합니다.
const store = configureStore({
  reducer: { Post: Post },
});

export default store;
