import React, { useState, useCallback } from 'react';
import Quill from 'quill';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { __getTargetPost } from '../redux/modules/PostsSlice';
import styled from 'styled-components';

const PostDetailPage = () => {
  const dispatch = useDispatch();
  const param = useParams().postId;

  const target = useSelector(state => state.Post.targetPost);
  console.log(target);

  //더미데이터
  const a = {
    pageId: '1',
    document: {
      ops: [
        { attributes: { bold: true }, insert: 'ddddd' },
        { insert: '\n' },
        { attributes: { color: '#e60000', bold: true }, insert: 'ddddd' },
        { insert: '\n' },
        {
          attributes: { color: '#e60000', background: '#ffff00', bold: true },
          insert: 'ddddd',
        },
      ],
    },
    createdAt: '2022-12-28 오후 11:59:59',
  };
  //해당 페이지에 알맞는 post가져오기
  useEffect(() => {
    dispatch(__getTargetPost(param));
  }, []);
  //데이터 보여줄 Quill State
  const [mainPost, setMainPost] = useState();
  //mainPost Quill이 생긴 후 서버로부터 데이터를 가져와 입력
  useEffect(() => {
    if (mainPost === undefined) return;
    mainPost.setContents(a.document);
  }, [mainPost]);
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
    <Wrap>
      {/* {isLoading ? null : target ? <div></div> : null} */}
      <CreatedAtText>
        {a.createdAt.substr(0, 17)}00:00부터 {a.createdAt.substr(14, 22)}까지
        작성된 내용입니다.
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
  justify-content: center;
  height: 40px;
  font-size: 20px;
  text-align: center;
  border-bottom: 0.1px solid rgb(209, 208, 208);
  background: rgb(247, 247, 245);
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
