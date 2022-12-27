import styled from 'styled-components';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <Wrap>
      <Header />
      <div>{children}</div>
    </Wrap>
  );
};

const Wrap = styled.div`
  width: 100%;
  /* margin: 0 auto; */
  padding-top: 40px;
`;

export default Layout;
