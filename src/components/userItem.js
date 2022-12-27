import React from 'react';
import styled from 'styled-components';

const UserItem = ({ user }) => {
  return (
    <NickNamediv>
      <NickName>{user.nickname}</NickName>
    </NickNamediv>
  );
};

const NickNamediv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
`;

const NickName = styled.div`
  text-align: center;
  width: 130px;
  border: 1px solid lightgray;
`;

export default UserItem;
