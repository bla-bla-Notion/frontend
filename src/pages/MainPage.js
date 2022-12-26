import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import styled from 'styled-components';

function App() {
  const [state, setState] = useState('');
  const [post, setPost] = useState('');
  const [visible, SetVisible] = useState(true);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io.connect('http://localhost:4000');

    socketRef.current.on('message', message => {
      setPost(message);
    });

    return () => socketRef.current.disconnect();
  }, [post]);

  const onTextChange = e => {
    setState(e.target.value);
    socketRef.current.emit('message', state);
  };

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
          <span>{post}</span>
        </h3>
      </div>
    );
  };

  return (
    <div className="card">
      <Toggle show={!visible}>
        <form>
          <h1>편집하기</h1>
          <button onClick={onToggleHandler}>편집완료</button>
          <div>
            <textarea
              style={{ width: '300px', height: '300px' }}
              name="message"
              value={post}
              onChange={e => onTextChange(e)}
              id="container"
            />
          </div>
        </form>
      </Toggle>
      <Toggle show={visible}>
        <div className="render-chat">
          <button onClick={onCompleteHandler}>편집하기</button>
          <h1>bla-bla-Notion</h1>
          {renderChat()}
        </div>
      </Toggle>
    </div>
  );
}

const Toggle = styled.div`
  display: ${({ show }) => (show ? '' : 'none')};
`;

export default App;
