import React, { useCallback, useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import 'quill/dist/quill.snow.css';
import Quill from 'quill';

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
      console.log(delta);
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
            style={{ width: '300px', height: '300px' }}
            name="message"
            id="mainShow"
            ref={showRef}
          />
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
            <div
              style={{ width: '300px', height: '300px' }}
              name="message"
              id="container"
              ref={wrapperRef}
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

export default MainPage;
