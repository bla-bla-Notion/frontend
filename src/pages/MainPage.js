import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import UserItem from '../components/userItem';
import { useDispatch, useSelector } from 'react-redux';
import { __getPost } from '../redux/modules/PostsSlice';
import './snow.css';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

function MainPage() {
  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    ['blockquote', 'code-block'],
    ['clean'],
  ];

  const [socket, setSocket] = useState(); //소켓을 어디서든 접근가능하게
  const [quill, setQuill] = useState(); //quill접근을 어디서든 가능하게

  const { postList, isLoading } = useSelector(state => state.Post);
  const dispatch = useDispatch();

  //서버에 저장된 postList가져오기
  useEffect(() => {
    dispatch(__getPost());
  }, [dispatch]);

  //서버와 socket.io 연결
  useEffect(() => {
    const s = io(`${process.env.REACT_APP_URL}`);
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  //사이트 처음 접속 시 이미 존재하는 데이터 받아오기
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.on('load-document', document => {
      quill.setContents(document);
    });
  }, [socket, quill]);

  //작성창 데이터 보내기
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
      socket.emit('save-document', quill.getContents());
    };
    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  //접속유저 받아오기
  const [users, setUsers] = useState([]);
  const [newUserText, setNewUserText] = useState('');
  const [justText, setJustText] = useState('');
  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.on('nickname', data => {
      setUsers(data.usersList);
      setNewUserText(data.newUser);
      setJustText('님이 입장하셨습니다!');
    });
    socket.on('disconnectedUser', data => {
      setUsers(data.usersList);
    });
  }, [socket, quill, users]);

  //새로운 유저 닉네임 상단에 띄우기
  useEffect(() => {
    setTimeout(() => {
      setNewUserText('');
      setJustText('');
    }, 5000);
  }, [newUserText]);

  //변경데이터 받아오기, broadcast
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = delta => {
      quill.updateContents(delta);
    };
    socket.on('receive-changes', handler);
    return () => {
      socket.off('receive-changes', handler);
    };
  }, [socket, quill]);

  //textarea Quill
  const wrapperRef = useCallback(wrapper => {
    if (wrapper == null) return;
    wrapper.innerHTML = '';
    const editor = document.createElement('div');
    wrapper.append(editor);
    const q = new Quill(editor, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    setQuill(q);
  }, []);

  //db와 사이드바에 보여주는 데이터의 동기화를 위한 코드
  const SAVE_INTERVAL_MS = 1000 * 60 * 10;
  useEffect(() => {
    if (socket == null || quill == null) return;
    const interval = setInterval(() => {
      window.location.reload();
    }, SAVE_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  //눈내리는 모양 만들기
  const body = document.querySelector('body');
  const MIN_DURATION = 10;
  function makeSnowflake() {
    const snowflake = document.createElement('div');
    const delay = Math.random() * 10;
    const initialOpacity = Math.random();
    const duration = Math.random() * 20 + MIN_DURATION;
    snowflake.classList.add('snowflake');
    snowflake.style.left = `${Math.random() * window.screen.width}px`;
    snowflake.style.animationDelay = `${delay}s`;
    snowflake.style.opacity = initialOpacity;
    snowflake.style.animation = `fall ${duration}s linear`;
    body.appendChild(snowflake);
    setTimeout(() => {
      body.removeChild(snowflake);
      makeSnowflake();
    }, (duration + delay) * 1000);
  }
  makeSnowflake();
  for (let index = 0; index < 50; index++) {
    makeSnowflake(makeSnowflake, 500 * index);
  }

  return (
    <Wrap>
      <SideBar>
        <NicknameList>
          <NicknameTitle>참여중인 닉네임</NicknameTitle>
          {users
            ? users.map(user => {
                return <UserItem key={user.socketId} user={user} />;
              })
            : null}
        </NicknameList>
        <MainList>
          📝리스트
          <p></p>
          {isLoading
            ? null
            : postList
            ? postList.map(post => (
                <CreatedAt>
                  <Link
                    style={{
                      color: 'black',
                      textDecoration: 'none',
                      userSelect: 'none',
                    }}
                    to={`/${post.pageId}`}
                    key={post.pageId}
                  >
                    {new Date(post.createdAt).toLocaleString()}
                  </Link>
                </CreatedAt>
              ))
            : null}
        </MainList>
      </SideBar>
      <Textbox>
        <Modal />
        <div>
          <NewUserTextBox>
            <div style={{ color: 'rgb(166, 208, 248)' }}>{newUserText}</div>
            {justText}
          </NewUserTextBox>
          <div>
            <form>
              <div>
                <div
                  style={{ width: '1000px', height: 'auto' }}
                  name="message"
                  id="container"
                  ref={wrapperRef}
                />
              </div>
            </form>
          </div>
        </div>
      </Textbox>
    </Wrap>
  );
}

const Wrap = styled.div`
  max-width: 100%;
  display: flex;
  height: 100%;
`;

const SideBar = styled.div`
  width: 20%;
  min-width: 170px;
  height: 1200px;
  background: rgb(247, 247, 245);
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const NicknameList = styled.div`
  font-size: medium;
  font-weight: bold;
  display: block;
  padding-bottom: 10px;
`;

const MainList = styled.div`
  position: relative;
  transform: translateY(340%);
  padding-bottom: 10px;
`;
const NicknameTitle = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Textbox = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
  position: relative;
`;

const NewUserTextBox = styled.div`
  align-items: center;
  height: 30px;
  font-weight: bold;
  color: gray;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0px;
`;

const CreatedAt = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 5px;
  &:hover {
    background-color: rgb(218, 218, 215);
  }
`;

export default MainPage;
