import React, { useState, useCallback } from 'react';
import Quill from 'quill';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { __getTargetPost } from '../redux/modules/PostsSlice';
import styled from 'styled-components';

const PostDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const param = useParams().postId;

  //전역상태 가져오기
  const { isLoading, targetPost } = useSelector(state => state.Post);

  //해당 페이지에 알맞는 post가져오기
  useEffect(() => {
    dispatch(__getTargetPost(param));
  }, []);

  //데이터 보여줄 Quill State
  const [mainPost, setMainPost] = useState();

  //mainPost Quill이 생긴 후 서버로부터 데이터를 가져와 입력
  useEffect(() => {
    if (mainPost === undefined) return;
    mainPost.setContents(targetPost.document);
  }, [mainPost, targetPost.documnet]);

  //Quill생성
  const showRef = useCallback(showRef => {
    if (showRef == null) return;
    showRef.innerHTML = '';
    const editor = document.createElement('div');
    showRef.append(editor);
    const Q = new Quill(editor, {
      modules: { toolbar: false },
      readOnly: true,
    });
    setMainPost(Q);
  }, []);

  return (
    <>
      {isLoading ? (
        //HTTP get 명령 Pending중 보일 박스
        <Wrap>
          <CreatedAtLoadingText>
            <div style={{ textAlign: 'center' }}>Loading...</div>
          </CreatedAtLoadingText>
          <TextareaWrap>
            <div
              style={{
                minWidth: '1000px',
                maxWidth: '100%',
                minHeight: '800px',
                maxHeight: '100%',
                border: '1px solid black',
                marginTop: '18px',
              }}
            />
          </TextareaWrap>
        </Wrap>
      ) : targetPost ? (
        //HTTP get 명령이 잘 이뤄졌을 때 보일 박스
        <Wrap>
          <CreatedAtText>
            <TopItemWrap>
              <div>
                {new Date(targetPost.createdAt)
                  .toLocaleString()
                  .slice(0, 19)
                  .replace(':', '')}
                :00:00 ~{' '}
                {new Date(targetPost.createdAt).toLocaleString().slice(17, 26)}
                까지 작성된 내용입니다.
              </div>
              <GoBackButton
                onClick={() => {
                  navigate('/');
                }}
              >
                작성페이지로 이동하기
              </GoBackButton>
            </TopItemWrap>
          </CreatedAtText>
          <TextareaWrap>
            <h3>
              <Textarea
                style={{
                  minWidth: '1000px',
                  maxWidth: '100%',
                  minHeight: '800px',
                  maxHeight: '100%',
                }}
                name="message"
                id="mainShow"
                ref={showRef}
              />
            </h3>
          </TextareaWrap>
        </Wrap>
      ) : //http get 요청이 rejected되었을 때 아무것도 출력하지 않음
      null}
    </>
  );
};

const Wrap = styled.div`
  margin: 0px auto;
  max-width: 1200px;
  width: 1400px;
  border: 1px solid rgb(209, 208, 208);
`;

const CreatedAtText = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  font-size: 20px;
  text-align: center;
  border-bottom: 0.1px solid rgb(209, 208, 208);
  background: rgb(247, 247, 245);
`;

const CreatedAtLoadingText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  font-size: 20px;
  text-align: center;
  border-bottom: 0.1px solid rgb(209, 208, 208);
  background: rgb(247, 247, 245);
`;

const TopItemWrap = styled.div`
  max-width: 1000px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 140px;
`;

const GoBackButton = styled.button`
  width: 140px;
  height: 30px;
  margin-right: 10px;
  user-select: none;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background-color: rgb(247, 247, 245);
  &:hover {
    background-color: rgb(224, 224, 219);
  }
`;

const TextareaWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Textarea = styled.div`
  border: 1px solid black;
`;

export default PostDetailPage;
