import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apis } from '../../shared/api';

const initialState = {
  postList: [],
  isLoading: false,
  error: null,
  targetPost: {},
};

//thunk 본문조회
export const __getPost = createAsyncThunk(
  'getPost',
  async (payload, thunkAPI) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_URL}/api/page`);
      return thunkAPI.fulfillWithValue(data.data);
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);
//thunk 상세페이지 특정 post 조회
export const __getTargetPost = createAsyncThunk(
  'getTargetPost',
  async (payload, thunkAPI) => {
    try {
      const { data } = await apis.getpost(payload);
      // .then(res => {
      //   console.log(res);
      //   if (res.status === 400) {
      //     window.alert(res.body.errorMessage);
      //     window.history.back();
      //   }
      // });
      // console.log(data);
      return thunkAPI.fulfillWithValue(data.data);
    } catch (err) {
      console.log(err);
      return thunkAPI.rejectWithValue(err);
    }
  },
);

//리듀서
const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {},
  //thunk용 리듀서
  extraReducers: builder => {
    builder
      // ----------------------------------------------------------
      //본문 리스트 조회
      // 로딩 시작
      .addCase(__getPost.pending, state => {
        state.isLoading = true;
      })
      //로딩 완료. 성공 시
      .addCase(__getPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.postList = action.payload;
      })
      //로딩 완료. 실패 시
      .addCase(__getPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // ----------------------------------------------------------
      //타겟 post 조회
      // 로딩 시작
      .addCase(__getTargetPost.pending, state => {
        state.isLoading = true;
      })
      //로딩 완료. 성공 시
      .addCase(__getTargetPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.targetPost = action.payload;
      })
      //로딩 완료. 실패 시
      .addCase(__getTargetPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// // 액션크리에이터는 컴포넌트에서 사용하기 위해 export 하고;
export const {} = postSlice.actions;
// // reducer 는 configStore에 등록하기 위해 export default 합니다.
export default postSlice.reducer;
