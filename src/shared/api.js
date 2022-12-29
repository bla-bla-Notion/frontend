import axios from 'axios';

// axios instance 생성자 입니다.

const api = axios.create({
  baseURL: `${process.env.REACT_APP_URL}/api/page`,
});

export const apis = {
  //Home
  getpost: param => api.get(`/${param}`),
};
