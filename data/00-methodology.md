# 포트폴리오/이력서 문장 관리 시스템

## 목적
JD 키워드에 맞춰 포트폴리오/이력서 문장을 커스터마이징하여 지원 효율을 높인다.

## 구조

### 데이터 저장소
- **베이스 문장**: 로컬 md 파일 (Claude Code가 참조)
- **JD 수집 + 커스텀 문장**: Notion DB (Save to Notion + Claude Code 자동화)

### Notion DB 구성 (7개)
| DB | 용도 | 비고 |
|---|---|---|
| 기본정보 | 커버, Skills, Cert, Edu, Degree | 행 1개 (본인 정보) |
| 프로젝트 | 5개 프로젝트별 문장 | 키워드별 커스텀 행 추가 |
| 트러블슈팅 A | 문제해결형 (문제→시도→해결) | |
| 트러블슈팅 B | 비교분석형 (A vs B) | |
| 트러블슈팅 C | 시나리오형 (질문들→시도→해결) | |
| 트러블슈팅 D | 트레이드오프형 | 추후 추가 |
| 트러블슈팅 E | 일반형 | 추후 추가 |

### 로컬 md 파일 구성
```
base-sentences/
├── 01-basic-info.md
├── 02-projects.md
├── 03-troubleshooting-a.md
├── 04-troubleshooting-b.md
├── 05-troubleshooting-c.md
├── 06-troubleshooting-d.md
└── 07-troubleshooting-e.md
```

## 워크플로우

### 1. JD 스크랩
- 도구: Save to Notion (브라우저 확장)
- 저장 위치: Notion JD 수집 DB

### 2. 키워드 추출 + 커스텀 문장 생성
- 도구: Claude Code + Notion MCP
- 프로세스:
  1. Claude Code가 JD 페이지 읽기
  2. 필수/우대 키워드 추출
  3. 로컬 md 파일에서 베이스 문장 참조
  4. 키워드에 맞게 문장 커스터마이징
  5. 해당 Notion DB에 새 행 추가

### 3. 이력서/포트폴리오 적용
- Notion에서 해당 회사 키워드로 필터링
- 커스텀 문장 복사하여 적용

## 토큰 효율화 포인트
- 베이스 문장은 로컬 md 파일로 관리 → Notion API 호출 없이 즉시 참조
- Notion은 커스텀 결과물 저장용으로만 사용
- 예상 토큰: 작업당 ~2,000-3,000 (모두 Notion 대비 40% 절감)

## 설정 필요 사항
- [ ] Notion Integration 생성 및 API 키 발급
- [ ] 7개 DB 생성 및 Integration 연결
- [ ] Claude Code MCP 설정
- [ ] 베이스 문장 md 파일 생성

## 향후 개선: n8n 자동화

### 목표
JD 스크랩 → 커스텀 문장 생성 과정을 완전 자동화

### 워크플로우
1. **트리거**: Notion JD 수집 DB에 새 페이지 생성 감지
2. **처리**: 
   - JD 페이지 내용 읽기
   - Claude API로 키워드 추출
   - 베이스 문장 참조하여 커스텀 문장 생성
3. **저장**: 해당 Notion DB에 새 행 추가

### 추가 자동화 (검토 중)
- Notion → Figma 텍스트 자동 삽입
- 포트폴리오/이력서 PDF 자동 생성
