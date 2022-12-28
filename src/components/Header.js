import styled from 'styled-components';

const Header = () => {
  return (
    <HeaderComponent>
      <HeaderLeft>
        <HeaderItem
          style={{ marginLeft: '15px' }}
          onClick={() => {
            window.location.href =
              'https://teamsparta.notion.site/99-10-E-Docs-90cdaca6538c44569b63ef2a1ff9b60b';
          }}
        >
          📚 항해99 10기 E반 - Docs
        </HeaderItem>
        <HeaderItem>/</HeaderItem>
        <HeaderItem
          onClick={() => {
            window.location.href =
              'https://teamsparta.notion.site/Chapter-5-W7-26ca46794da44960b8fcd3700177584d';
          }}
        >
          📕 [Chapter 5] 클론 코딩 (W7)
        </HeaderItem>
        <HeaderItem>/</HeaderItem>
        <HeaderItem
          onClick={() => {
            window.location.href =
              'https://www.notion.so/SA-4-8b7494504f0e46b58a3d3b6600afdfe8';
          }}
        >
          🗒️ Bla-Bla-Notion (4조)
        </HeaderItem>
      </HeaderLeft>
      <HeaderRight>
        <HeaderItem>🔎검색</HeaderItem>
        <HeaderItem>복제</HeaderItem>
        <HeaderItem>· · ·</HeaderItem>
        <VerticalLine></VerticalLine>
        <HeaderItem style={{ marginRight: '15px' }}>Notion 열기</HeaderItem>
      </HeaderRight>
    </HeaderComponent>
  );
};

const HeaderComponent = styled.div`
  position: fixed;
  left: 50%;
  top: 0;
  z-index: 2000;
  transform: translateX(-50%);
  width: 100%;
  height: 40px;
  background-color: white;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  color: black;
`;

const HeaderLeft = styled.div`
  display: flex;
  gap: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
`;

const HeaderItem = styled.div`
  height: 30px;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  text-align: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    background-color: rgb(239, 239, 239);
    border-radius: 10px;
  }
`;

const VerticalLine = styled.div`
  border-left: 0.1px solid lightgray;
  width: 0.1px;
  height: 20px;
`;

export default Header;
