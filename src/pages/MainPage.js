import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import UserItem from '../components/userItem';
//
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { __getPost } from '../redux/modules/PostsSlice';
//
function MainPage() {
  const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    ['image', 'blockquote', 'code-block'],
    ['clean'],
  ];

  const [socket, setSocket] = useState(); //소켓을 어디서든 접근가능하게
  const [quill, setQuill] = useState(); //quill접근을 어디서든 가능하게
  //

  const { postList, isLoading } = useSelector(state => state.Post);
  console.log();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(__getPost());
  }, [dispatch]);

  //
  //서버와 socket.io 연결
  useEffect(() => {
    const s = io('https://dev-jn.shop');
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  //사이트 처음 접속 시 이미 존재하는 데이터 받아오기
  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once('load-document', document => {
      quill.setContents(document);
      console.log('기존 데이터 : ', document);
    });
  }, [socket, quill]);

  //작성창 데이터 보내기
  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      console.log(delta);
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
      socket.emit('save-document', quill.getContents());
      console.log('delta : ', delta);
      console.log('qgC : ', quill.getContents());
    };
    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  //접속유저 받아오기
  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (socket == null || quill == null) return;
    socket.on('nickname', data => {
      setUsers(data.usersList);
    });
    socket.on('disconnectedUser', data => {
      setUsers(data.usersList);
    });
  }, [socket, quill, users]);

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

  //textarea
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

  // 주석 모아놓은 곳
  // const [mainPost, setMainPost] = useState();
  // useEffect(() => {
  //   if (socket == null || quill == null) return;
  //   const handler = delta => {
  //     mainPost.setContents(delta);
  //   };
  //   socket.on('receive-changes', handler => {
  //     console.log(handler);
  //   });
  //   return () => {
  //     socket.off('receive-changes', handler);
  //   };
  // }, [socket, quill, mainPost]);

  // const showRef = useCallback(showRef => {
  //   if (showRef == null) return;
  //   showRef.innerHTML = '';
  //   const editor = document.createElement('div');
  //   showRef.append(editor);
  //   const Q = new Quill(editor, {
  //     modules: { toolbar: false },
  //     readOnly: true,
  //   });

  //   setMainPost(Q);
  // }, []);

  // const [visible, SetVisible] = useState(true);

  // const onToggleHandler = e => {
  //   e.preventDefault();
  //   SetVisible(!visible);
  // };

  // const onCompleteHandler = e => {
  //   e.preventDefault();
  //   SetVisible(!visible);
  // };

  // const renderChat = () => {
  //   return (
  //     <div>
  //       <h3>
  //         <div
  //           style={{ width: '1200px', height: '1800px' }}
  //           name="message"
  //           id="mainShow"
  //           ref={showRef}
  //         />
  //       </h3>
  //     </div>
  //   );
  // };

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
        {isLoading
          ? null
          : postList
          ? postList.map(post => <div key={post.pageId}>{post.createdAt}</div>)
          : null}
      </SideBar>
      <Textbox>
        <div>
          <Title style={{ color: 'gray' }}>o o o님이 입장하셨습니다.</Title>
          <div>
            <form>
              {/* <Button>편집완료</Button> */}
              <div>
                <div
                  style={{ width: '120%', height: 'auto' }}
                  name="message"
                  id="container"
                  ref={wrapperRef}
                />
              </div>
            </form>
          </div>
          {/* <Toggle show={visible}>
          <div className="render-chat">
            <Button onClick={onCompleteHandler}>편집하기</Button>
            <h1>bla-bla-Notion</h1>
            {renderChat()}
          </div>
        </Toggle> */}
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
  height: 1000px;
  background: rgb(247, 247, 245);
`;

const NicknameList = styled.div`
  font-size: medium;
  font-weight: bold;
  display: block;
  padding-bottom: 10px;
`;

const NicknameTitle = styled.div`
  text-align: center;
  margin-top: 10px;
`;

const Title = styled.div`
  align-items: center;
  margin-top: 60px;
  margin-bottom: 50px;
  font-weight: bold;
`;

const Textbox = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 100px;
  display: flex;
  justify-content: center;
`;

export default MainPage;
