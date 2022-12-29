import React from 'react';
import styled from 'styled-components';
import { useState } from 'react';

function Modal() {
  const [modalOpen, setModalOpen] = useState(true);

  return (
    <ModalOverall modalOpen={modalOpen}>
      <ModalBackground>
        <ModalContainer>
          <TitleCloseBtn></TitleCloseBtn>
          <Title>
            <h1>경고!</h1>
          </Title>
          <Body>
            <p>같은 줄에서 텍스트 입력시 오류가 발생할 수 있습니다.</p>
          </Body>
          <Footer>
            <ModalButton
              onClick={() => {
                setModalOpen(!modalOpen);
              }}
            >
              확인했습니다!
            </ModalButton>
          </Footer>
        </ModalContainer>
      </ModalBackground>
    </ModalOverall>
  );
}

const ModalBackground = styled.div`
  width: 53.5vw;
  height: 100vh;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalContainer = styled.div`
  width: 500px;
  height: 500px;
  border-radius: 12px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  display: flex;
  flex-direction: column;
  padding: 25px;
  user-select: none;
`;

const TitleCloseBtn = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const Title = styled.div`
  display: inline-block;
  text-align: center;
  margin-top: 10px;
`;

const Body = styled.div`
  flex: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.7rem;
  text-align: center;
`;

const Footer = styled.div`
  flex: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalButton = styled.button`
  width: 150px;
  height: 45px;
  margin: 10px;
  border: none;
  background-color: cornflowerblue;
  color: white;
  border-radius: 8px;
  font-size: 20px;
  cursor: pointer;
  &:hover {
    background-color: #517fd6;
  }
`;

const ModalOverall = styled.div`
  display: ${({ modalOpen }) => (modalOpen ? '' : 'none')};
  z-index: 2;
`;

export default Modal;
