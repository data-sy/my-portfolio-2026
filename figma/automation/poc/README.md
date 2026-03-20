# Portfolio PoC - 사용 가이드

## 📋 PoC 목표

- ✅ MD/JSON 파일에서 회사별 데이터 관리
- ✅ 로컬 서버로 데이터 제공
- ✅ Figma 플러그인에서 회사 선택
- ✅ 간단한 트러블슈팅 페이지 자동 생성

---

## 🚀 시작하기

### 1. 서버 설정

```bash
cd poc/server
npm install
npm start
```

**확인:** 브라우저에서 `http://localhost:3000/api/companies` 접속
→ `{"success":true,"companies":["kakao","naver"]}` 표시되면 성공

---

### 2. Figma 플러그인 설치

1. Figma 열기
2. **Plugins** → **Development** → **Import plugin from manifest**
3. `poc/figma-plugin/manifest.json` 선택
4. 플러그인 설치 완료!

---

### 3. 사용 방법

1. Figma에서 플러그인 실행: **Plugins** → **Development** → **Portfolio PoC**
2. 드롭다운에서 회사 선택 (kakao 또는 naver)
3. **"포트폴리오 생성"** 버튼 클릭
4. 3초 후 페이지 생성됨!

---

## 📁 파일 구조

```
poc/
├── data/
│   ├── base.json              # 기본 데이터
│   └── companies/
│       ├── kakao.json         # 카카오 커스텀
│       └── naver.json         # 네이버 커스텀
├── server/
│   ├── server.js              # Express 서버
│   └── package.json
└── figma-plugin/
    ├── manifest.json
    ├── code.js                # 플러그인 로직
    └── ui.html                # UI
```

---

## 🎨 생성되는 페이지

**카카오 선택 시:**
- 상단에 노란색 하이라이트 박스 (대규모 트래픽 강조)
- 제목: "대규모 트래픽 대응 - DB 인덱스 최적화..."
- 하단에 카카오 기술 블로그 언급

**네이버 선택 시:**
- 상단에 초록색 하이라이트 박스 (검색 최적화 강조)
- 제목: "검색 쿼리 최적화 - DB 인덱스로..."
- 하단에 네이버 클라우드 언급

---

## 🔧 커스터마이징

### 새 회사 추가

1. `poc/data/companies/toss.json` 생성:
```json
{
  "company": "toss",
  "highlight": {
    "enabled": true,
    "text": "💳 금융 서비스 성능 최적화 경험",
    "color": "#3B82F6"
  },
  "troubleshooting": {
    "title": "결제 시스템 DB 최적화...",
    "emphasis": "토스 결제 인프라에 적용 가능"
  }
}
```

2. 서버 재시작 (자동 감지됨)
3. Figma 플러그인에서 "toss" 선택 가능!

---

## ✅ PoC 검증 항목

- [x] JSON 파일로 데이터 관리
- [x] 회사별 커스터마이징 동작
- [x] 서버 ↔ 플러그인 통신
- [x] 간단한 페이지 자동 생성
- [x] 하이라이트 색상 변경
- [x] 회사별 강조 문구 추가

---

## 🎯 다음 단계

PoC가 성공하면:

1. **데이터 확장**
   - JSON → MD 파일로 변경
   - 전체 포트폴리오 데이터 구조 설계

2. **플러그인 고도화**
   - 현재 code.js의 컴포넌트 활용
   - 19페이지 전체 생성

3. **워크플로우 최적화**
   - MD 파일 에디터 연동
   - 실시간 프리뷰

---

## 🐛 트러블슈팅

### 서버 연결 안 됨
→ `npm start` 실행했는지 확인
→ 포트 3000 이미 사용중이면 server.js에서 포트 변경

### 플러그인에서 회사 목록 안 보임
→ CORS 에러 가능성: 서버 재시작
→ Figma 플러그인 재실행

### 폰트 에러
→ Figma에 Noto Sans KR 설치 필요
→ 또는 code.js에서 다른 폰트로 변경
