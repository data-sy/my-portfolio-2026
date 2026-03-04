# JSX 파일 실행 가이드 (Vite + React)

## JSX란?

JSX는 React에서 사용하는 문법으로, JavaScript 안에 HTML처럼 쓸 수 있게 해준다.
브라우저가 직접 읽을 수 없어서 **빌드 도구(Vite)** 가 변환해줘야 한다.

```
HTML  → 브라우저가 바로 읽음 (더블클릭으로 열기 가능)
JSX   → Vite가 변환 → 브라우저가 읽음 (npm 명령어 필요)
```

---

## 사전 준비

### Node.js 설치

```bash
# 설치 확인
node -v    # v18 이상 권장
npm -v     # 9 이상 권장
```

아직 없다면 → [https://nodejs.org](https://nodejs.org) 에서 LTS 버전 다운로드

---

## 프로젝트 생성 및 실행 (5분)

### 1단계: Vite 프로젝트 생성

```bash
npm create vite@latest distance-visualization -- --template react
```

### 2단계: 프로젝트 폴더로 이동 및 의존성 설치

```bash
cd distance-visualization
npm install
```

### 3단계: JSX 파일 복사

`visualization.jsx` 파일을 `src/App.jsx`에 덮어쓴다.

```bash
# Mac/Linux
cp /다운로드경로/visualization.jsx src/App.jsx

# Windows (PowerShell)
Copy-Item "C:\다운로드경로\visualization.jsx" -Destination "src\App.jsx"
```

### 4단계: 개발 서버 실행

```bash
npm run dev
```

터미널에 표시되는 주소(보통 `http://localhost:5173`)를 브라우저에서 열면 된다.

---

## 폴더 구조

```
distance-visualization/
├── node_modules/       ← npm install로 생성됨 (건드리지 않음)
├── public/
├── src/
│   ├── App.jsx         ← ★ 여기에 visualization.jsx 내용을 넣는다
│   ├── main.jsx        ← 자동 생성됨 (수정 불필요)
│   └── index.css       ← 기본 스타일 (필요시 비우기)
├── index.html
├── package.json
└── vite.config.js
```

---

## 자주 쓰는 명령어

| 명령어 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 시작 (수정하면 자동 반영) |
| `npm run build` | 배포용 정적 파일 생성 (`dist/` 폴더) |
| `npm run preview` | 빌드 결과물 미리보기 |
| `Ctrl + C` | 개발 서버 종료 |

---

## index.css 정리

Vite 기본 템플릿에 스타일이 들어있어서 레이아웃이 깨질 수 있다.
`src/index.css` 내용을 전부 지우고 아래만 남긴다:

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
```

---

## 트러블슈팅

### 포트 충돌 시

```bash
npm run dev -- --port 3000
```

### node_modules 문제 시

```bash
rm -rf node_modules package-lock.json
npm install
```

### 폰트가 안 보일 때

`visualization.jsx` 안에 Google Fonts 링크가 포함되어 있어서 인터넷 연결이 필요하다.
오프라인에서 쓰려면 폰트 파일을 직접 다운로드해서 `public/` 폴더에 넣고 CSS로 연결한다.
