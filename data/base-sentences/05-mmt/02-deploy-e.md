# Troubleshooting E: 일반형

## GitHub Actions + Docker Compose로 배포 자동화 — 25분 → 7분 (72%↓)
| key | value |
|---|---|
| title | GitHub Actions + Docker Compose로 배포 자동화 — 25분 → 7분 (72%↓) |
| situation | 수작업 배포(SSH 접속 → pull → build → restart)로 매번 25분 소요. 빌드 순서 실수, 환경변수 누락 등 휴먼에러 반복 발생 |
| action_1 | GitHub Actions 워크플로우 작성 — main 브랜치 push 시 자동 트리거 |
| action_2 | Docker Compose로 애플리케이션, DB, Redis 컨테이너 구성 |
| action_3 | GitHub Actions에서 Docker 이미지 빌드 → Docker Hub 푸시 → 서버에서 pull + 재시작 |
| action_4 | 환경변수는 GitHub Secrets로 관리, docker-compose.yml에서 참조 |
| action_5 | null |
| result | 배포 시간 25분 → 7분 (72%↓). 수작업 절차 제거로 휴먼에러 완전 차단. 코드 push만으로 배포 완료 |
| insight_1 | 자동화의 가치는 "시간 절약"보다 "실수 제거". 수작업 배포에서 가장 위험한 것은 느린 속도가 아니라 사람이 개입하는 모든 단계 |
| insight_2 | Docker Compose로 인프라를 코드화하니 "이 서버에서만 되는" 문제가 사라짐. 환경 일관성 확보가 배포 자동화의 전제 조건 |
| followup_q1 | 배포 중 장애가 발생하면 롤백은 어떻게 하나? |
| followup_q2 | GitHub Actions의 비용이나 제약은 없었나? |

<!--
insight_1 방향: 자동화의 본질 (시간 vs 안정성)
insight_1 예상 꼬리질문: 수작업 배포에서 가장 자주 발생한 실수는? / 자동화 전후로 장애 빈도가 달라졌나? / CI/CD에서 테스트 단계는 포함했나?

insight_2 방향: 인프라 코드화, 환경 일관성
insight_2 예상 꼬리질문: Docker 없이 배포 자동화는 불가능한가? / Docker Compose vs Kubernetes 비교? / 개발 환경과 운영 환경의 차이는 어떻게 관리했나?

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

액션 선택 이유:
- GitHub Actions: 이미 GitHub 사용 중, 별도 CI 서버 불필요
- Docker Compose: 멀티 컨테이너 구성이 필요 (App + MySQL + Redis)
- Docker Hub: 이미지 레지스트리로 빌드 산출물 관리

결과에서 의미 있는 부분:
- 정량적: 25분 → 7분 (72%↓)
- 정성적: 휴먼에러 완전 제거, 배포 심리적 부담 감소

다시 한다면 다르게 할 점:
- 초기부터 CI/CD를 구성했으면 개발 속도가 더 빨랐을 것
- 테스트 자동화 단계를 CI 파이프라인에 포함하지 못한 점 아쉬움

인사이트 연결:
"수작업도 매뉴얼만 있으면 된다"고 생각했지만,
매뉴얼을 아무리 잘 만들어도 사람은 실수함.
자동화는 "편의"가 아니라 "안정성"을 위한 것.
-->
