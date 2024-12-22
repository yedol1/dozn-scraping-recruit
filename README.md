# 스크래핑 사업본부 채용과제

이 프로젝트는 **Next.js**와 **React Query**를 활용하여 로그인, 스크래핑 조회, API 호출 등을 구현한 예시입니다.

<br/>

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [주요 기능](#주요-기능)
3. [기술 스택](#기술-스택)
4. [설치 및 실행](#설치-및-실행)
5. [프로젝트 구조](#프로젝트-구조)
6. [과제 외 내용 추가 설명](#과제-외-내용-추가-설명)

<br/>

## 프로젝트 소개

- **Node.js v18 이상** 환경에서 동작하도록 설정되었습니다.
- **Next.js 14+** 환경을 사용하고 있으며, App Router 기반으로 라우팅이 구성되어 있습니다.
- 로그인 기능, 스크래핑 API 호출, React Query를 활용한 상태 관리 등의 예시 코드를 포함하고 있습니다.

<br/>

## 주요 기능

1. **로그인**

   - 사용자 아이디(`admUserId`)와 비밀번호(`userPw`)를 입력받아 **서버에 인증** 요청합니다.
   - 정상적으로 응답받으면 **accessToken**을 `localStorage`에 저장합니다.

2. **토큰 검증**

   - **`AuthClientChecker`** 컴포넌트 등에서 **토큰 존재 여부**와 **유효 기간**을 체크합니다.
   - 만료 시 자동으로 로그인 페이지(`router.replace('/')`)로 이동하고, 로컬 스토리지의 토큰 값을 제거합니다.

3. **스크래핑**

   - 특정 **API 코드**, **모듈 코드**를 전달하여 서버에서 **스크래핑**을 수행하고 응답받습니다.
   - 요청/응답 이력을 **React Query 캐시**에 저장하고, 별도 페이지(예: `CallHistoryCard`)에서 조회할 수 있습니다.

4. **캐싱 + localStorage 동기화**
   - **React Query**로 관리되는 캐시를 새로고침 후에도 유지하기 위해 **localStorage**에 저장합니다.
   - 데이터 변경(스크래핑 호출, 북마크 토글 등) 시 **캐시와 localStorage**가 함께 업데이트되어 **재접속** 또는 **새로고침** 시에도 데이터가 유지됩니다.
   - 토큰 만료 혹은 삭제시, 로컬스토리지에 저장된 스크랩핑 호출 데이터, 북마크 데이터는 삭제 됩니다.

<br/>

## 기술 스택

- **Node.js**: 18+
- **Next.js**: 14+
- **React**: 18+
- **React Query** / **@tanstack/react-query**
- **TypeScript** (권장)
- **Tailwind CSS, radix/ui**, ESLint, etc.

<br/>

## 설치 및 실행

1. **Node.js 버전 확인**
   ```bash
   node -v
   # Node.js v18 이상인지 확인
   ```
2. **개발 서버 실행**
   ```bash
   yarn install
   yarn dev
   ```
3. **빌드 및 배포**

   ```bash
   yarn build
   yarn start
   ```

4. 로컬 환경 변수 설정 ( .env.local )

   ```bash
   NODE_ENV=development

   NEXT_PUBLIC_FRONT_URL=http://localhost:3000
   NEXT_PUBLIC_BACKEND_URL= https://admin.octover.co.kr
   ```

## 프로젝트 구조

```bash
 📦app
 ┣ 📂(protected)
 ┃ ┣ 📂history
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┣ 📂list
 ┃ ┃ ┗ 📜page.tsx
 ┃ ┗ 📜layout.tsx
 ┣ 📜error.tsx
 ┣ 📜layout.tsx
 ┣ 📜page.tsx;
 📦components
 ┣ 📂apiList
 ┃ ┣ 📜apiList-modal.tsx
 ┃ ┗ 📜list-table.tsx
 ┣ 📂scrpHistory
 ┃ ┗ 📜history-card.tsx
 ┣ 📂ui
 ┣ 📜table-pagination.tsx
 📦screens
 ┣ 📂authChecker
 ┃ ┗ 📜index.tsx
 ┣ 📂history
 ┃ ┗ 📜page.tsx
 ┣ 📂list
 ┃ ┗ 📜page.tsx
 ┣ 📂login
 ┃ ┣ 📜index.tsx
 ┃ ┣ 📜login-form.test.tsx
 ┗ ┗ 📜login-form.tsx

```

## 과제 외 내용 추가 설명

### 로그인 페이지 ( Page 1 )

📎 ' FRONT_URL / '

**admUserId (필수 입력 필드)**

- 최소 1글자 이상이어야 함

**userPw (필수 입력 필드)**

- 영문자(A-Za-z) 최소 1개
- 숫자(\d) 최소 1개
- 영문자·숫자가 아닌 문자([^A-Za-z\d]) 최소 1개
- 길이 8~16자

### API 목록 조회 페이지 + 스크래핑 데이터 호출 후 응답 팝업 페이지 ( Page 2 )

📎 ' FRONT_URL / list '

**유효시간**

> JWT 토큰을 디코딩하여, 남은 유효시간(만료 시점까지 남은 시간)을 계산하고 표시하는 타이머

**히스토리 페이지로 이동 [버튼]**

> 스크래핑 호출 히스토리를 볼 수 있는 페이지로 이동하는 버튼

**로그아웃 [버튼]**

> 로컬 스토리지에서 토큰 삭제하여 로그아웃 설정

**스크래핑 호출 [버튼+모달(팝업)]**

> 캐싱된 데이터와 받아온 데이터를 비교하여, 로컬 스토리지에 저장 ( 히스토리로 남기기 위해 로컬스토리지 사용)

### 호출 목록 조회 페이지 + 스크래핑 데이터 호출에 대한 응답 팝업 페이지 ( Page 3 )

📎 ' FRONT_URL / history '

**유효시간**

> JWT 토큰을 디코딩하여, 남은 유효시간(만료 시점까지 남은 시간)을 계산하고 표시하는 타이머

**API 목록 페이지로 이동 [버튼]**

> Page2 로 이동하는 버튼

**로그아웃 [버튼]**

> 로컬 스토리지에서 토큰 삭제하여 로그아웃 설정

**스크래핑 호출**

> 카드섹션 클릭시 팝업으로 생성
