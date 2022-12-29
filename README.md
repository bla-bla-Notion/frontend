# 4조 bla-bla-Notion

- 프로젝트소개 : Notion의 웹소켓 통신기능을 클론한 프로젝트입니다.

- frontend : React, backend : NodeJS

---

## 실행화면 및 배포주소 (최종 배포 후 작성)

![배포1](https://user-images.githubusercontent.com/117638805/209925812-10824932-0ef7-4bed-a180-121eb39d1c40.png)
![배포2](https://user-images.githubusercontent.com/117638805/209925815-7de64e52-5aa0-414d-9adf-f7479efecae0.png)

https://bla-bla-notion.vercel.app/

사이트로 접속한 모든 유저는 실시간 공동 편집이 가능합니다.
1시간 단위로 페이지에 있는 데이터를 db에 저장하고, 페이지를 백지로 갱신합니다.
1시간 단위로 저장된 페이지는 왼쪽 메뉴바 하단 목록에서 조회 가능하며, 이 또한 생성된지 1시간이 지나면 자동 소멸됩니다.

---

## 사용 패키지

`frontend`
- JavaScript
- React / React-Dom / React-Redux / React-Router-Dom / React-Scripts
- axios / quill / Socket.io-Client / Styled-Components

`deploy`
- Vercel

`etc Tools`
- github
    - PR 요청을 통한 코드 리뷰
    - front-back 통합 Project work-flow board 사용 (레포지토리별 issue 연동)
- notion
    - S.A.
    - 와이어프레임, ERD, API 명세서 관리

---

## trouble shooting (FE)

- 발생 데이터를 받아오고 보내는 명령이 입력과 동시에 일어나지 않는 문제

- 원인 useEffect, useRef, socket.io만으로 데이터를 동시에 보내고 받는 것에 한계가 있음

- 해결 quill 라이브러리의 내장함수를 socket.io의 내장함수와 같이 사용하여 작성과 동시에 데이터가 이동하도록 해결함

---

- 발생 같은 textarea에서 동시에 작성하면 중복된 데이터가 여러번 emit되고 클라이언트로 돌아오는 문제

- 원인 한 페이지에서 두개의 Quill이 존재하여 반복되며 데이터를 받아옴

- 해결 필요없는 readonly Quill을 제거하고 데이터를 보여주는 방식을 타 페이지로 이동하여 보게끔 바꾸어 해결함

---

- 발생 중간에 들어온 이용자가 기존 데이터를 받지 못하는 문제

- 원인 작성되고있는 전체 데이터가 존재하지 않았음

- 해결 데이터 변화를 서버에 보낼 때 전체 데이터도 같이 보내어 사용자가 처음 들어왔을 때 받도록 기능을 구현함

---

- 발생 DB에 저장된 데이터가 최신화 되었을 때 사이드바에 보이는 데이터와 일치하지 않는 문제 

- 원인 데이터가 최신화 되었을 때 리렌더링하는 조건을 만들지 않음

- 해결 시간이 부족하여 10분에 한번 씩 페이지를 새로고침하도록 설정함

---

- 발생 서버에서 받은 데이터 중 document가 존재하지 않을 때 보여줄 default data의 스타일이 적용되지 않는 문제

- 원인 quill의 해당 attributes를 표현하는 방식이 틀렸음

- 해결 attributes에 알맞는 방식으로 데이터를 작성하여 원하는 스타일의 default data를 보여줌

---

## 코드리뷰

- 1번리뷰 :

- 2번리뷰 :

- 3번리뷰 :

- 4번리뷰 :

---
