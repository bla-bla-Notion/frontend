import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';
import UserItem from '../components/userItem';

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
  const [mainPost, setMainPost] = useState();

  useEffect(() => {
    const s = io('https://dev-jn.shop');
    setSocket(s);
    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('message', delta);
    };
    quill.on('text-change', handler);
    return () => {
      quill.off('text-change', handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = delta => {
      mainPost.updateContents(delta);
    };
    socket.on('message', handler);
    return () => {
      socket.off('message', handler);
    };
  }, [socket, quill]);

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

  useEffect(() => {
    if (socket == null || quill == null) return;
    const handler = delta => {
      quill.updateContents(delta);
    };
    socket.on('message', handler);
    return () => {
      socket.off('message', handler);
    };
  }, [socket, quill]);

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

  const [visible, SetVisible] = useState(true);

  const onToggleHandler = e => {
    e.preventDefault();
    SetVisible(!visible);
  };

  const onCompleteHandler = e => {
    e.preventDefault();
    SetVisible(!visible);
  };

  const renderChat = () => {
    return (
      <div>
        <h3>
          <div
            style={{ width: '120%', height: '120%' }}
            name="message"
            id="mainShow"
            ref={showRef}
          />
        </h3>
      </div>
    );
  };

  return (
    <Wrap>
      <Backgr>
        <Nickname>
          {users
            ? users.map(user => {
                return <UserItem key={user.socketId} user={user} />;
              })
            : null}
        </Nickname>
      </Backgr>
      <Textbox>
        <Title style={{ color: 'gray' }}>o o o님이 입장하셨습니다.</Title>
        <Toggle show={!visible}>
          <form>
            <Button onClick={onToggleHandler}>편집완료</Button>
            <div>
              <div
                style={{ width: '120%', height: '120%' }}
                name="message"
                id="container"
                ref={wrapperRef}
              />
            </div>
          </form>
        </Toggle>
        <Toggle show={visible}>
          <div className="render-chat">
            <Button onClick={onCompleteHandler}>편집하기</Button>
            <h1>bla-bla-Notion</h1>
            {renderChat()}
          </div>
        </Toggle>
      </Textbox>
    </Wrap>
  );
}

const Toggle = styled.div`
  display: ${({ show }) => (show ? '' : 'none')};
`;

const Wrap = styled.div`
  justify-content: center;
  max-width: 2000px;
  //align-items: center;
  display: flex;
  height: 100%;
`;

const Backgr = styled.div`
  width: 400px;
  height: auto;
  background: #d9d9d9;
`;

const Nickname = styled.div`
  font-size: medium;
  font-weight: bold;
  padding-left: 20px;
  padding-top: 20px;
`;

const Title = styled.div`
  align-items: center;
  margin-top: 60px;
  margin-bottom: 50px;
  font-weight: bold;
`;

const Textbox = styled.div`
  text-align: center;
  margin-bottom: 100px;
`;

const Button = styled.div`
  text-align: center;
  padding-right: 10px;
`;
export default MainPage;
