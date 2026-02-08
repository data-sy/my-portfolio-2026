# Troubleshooting E: 일반형

## GitHub Actions + Docker Compose로 배포 자동화 — 25분 → 7분 (72%↓)
| key | value |
|---|---|
| title | GitHub Actions + Docker Compose로 배포 자동화 — 25분 → 7분 (72%↓) |
| context | 수작업 배포(SSH 접속 → pull → build → restart)로 매번 25분 소요. 빌드 순서 실수, 환경변수 누락 등 휴먼에러 반복 발생 |
| action_1_title | GitHub Actions 워크플로우 작성 |
| action_1_desc | main 브랜치 push 시 자동 트리거 |
| action_2_title | Docker Compose로 컨테이너 구성 |
| action_2_desc | App + DB + Redis, 서버 환경을 코드로 정의하여 어떤 서버에서든 동일한 실행 환경 보장 |
| action_3_title | CI/CD 파이프라인 구축 |
| action_3_desc | Docker 이미지 빌드 → Docker Hub 푸시 → EC2에서 pull + 재시작 |
| action_4_title | 환경변수 관리 |
| action_4_desc | GitHub Secrets로 관리, docker-compose.yml에서 참조 |
| action_5_title | null |
| action_5_desc | null |
| result | 배포 시간 25분 → 7분 (72%↓). 수작업 절차 제거로 휴먼에러 완전 차단. 코드 push만으로 배포 완료 |
| result_desc | 배포 자동화로 시간 72% 단축, 휴먼에러 제거 |
| insight_1 | {실제 겪은 구체적 실수 에피소드 — TODO}. 사람의 실수가 반복되는 지점이 자동화 대상이라는 판단의 계기가 됨 |
| insight_2 | 배포 자동화로 배포 부담이 줄면서 소규모 빈번한 배포가 가능해졌고, 장애 발생 시 원인 파악도 쉬워짐 |
| followup_q1 | 배포 중 장애가 발생하면 롤백은 어떻게 하나? |
| followup_q2 | GitHub Actions의 비용이나 제약은 없었나? |

<!--
insight_1 방향: 실제 경험에서 자동화 대상을 판단하는 기준
insight_1 TODO: 실제 겪은 구체적 실수 에피소드 채워넣기 (환경변수 누락? 빌드 순서 실수?)
insight_1 예상 꼬리질문: 수작업 배포에서 가장 자주 발생한 실수는? / 자동화 전후로 장애 빈도가 달라졌나? / CI/CD에서 테스트 단계는 포함했나?

insight_2 방향: 배포 빈도와 장애 원인 파악의 관계
insight_2 예상 꼬리질문: 자동화 전에는 배포를 얼마나 자주 했나? / 소규모 배포로 전환하면서 체감한 차이는? / 모아서 배포했을 때 실제로 장애가 난 경험이 있나?

followup_a1: Docker 이미지에 태그(버전)를 부여하여 이전 버전 이미지로 docker-compose up 실행. 추가로 DB 마이그레이션이 포함된 배포는 롤백이 복잡하므로 배포 전 백업 스크립트 실행.
followup_a2: GitHub Actions는 공개 레포 무료, 비공개 레포는 월 2,000분 무료 제공. 빌드 시간이 7분이므로 월 280회 이상 배포 가능하여 개인 프로젝트에는 충분. Self-hosted runner도 고려했으나 관리 비용 대비 이점 없어 GitHub-hosted 사용.
-->

<!--
## 경험 맥락 (면접 대비용)

상황 배경:
- My Math Teacher 프로젝트 운영 중 배포 빈도 증가
- 매번 SSH 접속 → git pull → ./gradlew build → 서비스 재시작
- 빌드 순서 실수 (DB 마이그레이션 전 애플리케이션 재시작 등)
- 환경변수 누락으로 운영 서버 장애 발생 경험

배포 파이프라인 실제 흐름:
1. main 브랜치에 push → GitHub Actions 트리거
2. GitHub Actions 러너에서 Docker 이미지 빌드 (멀티스테이지: gradle 빌드 → amazoncorretto 런타임)
3. Docker Hub에 이미지 푸시
4. SSH로 EC2 접속 → 기존 컨테이너 제거 → docker-compose up -d

액션 선택 이유:
- GitHub Actions: 이미 GitHub 사용 중, 별도 CI 서버 불필요
- Docker Compose: 멀티 컨테이너 구성 필요 (App + MySQL + Redis), 서버 환경을 코드로 정의하여 일관성 확보
- Docker Hub: 이미지 레지스트리로 빌드 산출물 관리

Docker 도입 맥락:
- Docker의 1차 목적은 개발/운영 환경 격리와 일관성 확보
- 환경이 코드로 정의되어 있으니 자동화 스크립트가 "항상 같은 결과"를 보장
- 즉, 환경 일관성 확보가 자동화를 믿고 쓸 수 있는 전제 조건

결과에서 의미 있는 부분:
- 정량적: 25분 → 7분 (72%↓)
- 정성적: 휴먼에러 완전 제거, 배포 심리적 부담 감소

다시 한다면 다르게 할 점:
- 초기부터 CI/CD를 구성했으면 개발 속도가 더 빨랐을 것
- 테스트 자동화 단계를 CI 파이프라인에 포함하지 못한 점 아쉬움

인사이트 연결:
수작업 배포 시 배포 부담이 커서 변경사항을 모아서 배포하게 됨
→ 자동화 후 소규모 빈번한 배포 가능
→ HT 프로젝트에서는 처음부터 Docker Compose로 개발 환경 구성
-->
