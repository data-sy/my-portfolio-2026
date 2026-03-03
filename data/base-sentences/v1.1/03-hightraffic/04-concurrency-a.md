# Troubleshooting A: 문제해결형

## Redis 분산락으로 선착순 쿠폰 동시성 제어
| key | value |
|---|---|
| title | Redis 분산락으로 선착순 쿠폰 동시성 제어 |
| problem | 선착순 100명 쿠폰 발급 시 동시 1000명 요청으로 초과 발급 발생 |
| try_1_title | synchronized 키워드 |
| try_1_desc | JVM 락으로 쿠폰 발급 메서드 동기화 |
| try_1_result | 단일 서버에서 정합성 확보, 로컬 테스트 시 100명 정확 발급 확인 |
| try_1_limit | Docker Compose로 3개 인스턴스 실행 시 각 JVM이 독립적으로 락 획득하여 초과 발급 발생. Scale-out 환경에서 무효 |
| try_2_title | DB 비관적 락 (SELECT FOR UPDATE) |
| try_2_desc | 쿠폰 수량 조회 시 Row 잠금으로 분산 환경 정합성 확보 |
| try_2_result | 3개 인스턴스 환경에서 정합성 확보, 100명 정확 발급 확인 |
| try_2_limit | 동시 1000명 요청 시 커넥션 풀(기본 10개) 고갈. 락 대기 중인 요청들이 커넥션 점유하여 타임아웃 발생 |
| try_3_title | Redis 분산락 + Lua Script |
| try_3_desc | SETNX로 분산 락 획득, Lua Script로 수량 확인+차감 원자화 |
| try_3_result | 동시 1000명 요청 시 100명 정확 발급, 커넥션 풀 부담 없이 안정적 처리 ✓ |
| try_3_limit | Redis 장애 시 쿠폰 발급 불가, Redis-DB 동기화 필요 |
| final_result | 동시 1000명 요청 시 100명 정확 발급 |
| insight_1 | 동시성 문제는 "어디서 락을 잡을 것인가"가 핵심. JVM → DB → Redis 순으로 락의 범위가 확장되며, 분산 환경에서는 애플리케이션 외부에 락을 두어야 함 |
| insight_2 | 기술 선택은 현재 인프라 맥락에 영향받음. Redis를 이미 캐시로 사용 중이었기에 추가 인프라 비용이 없었고, 그렇지 않았다면 DB 락 + 커넥션 풀 튜닝이 더 현실적인 선택이었을 수 있음 |
| followup_q1 | Redis 장애 시 쿠폰 발급은 어떻게 되나? |
| followup_q2 | DB 비관적 락을 선택했다면 커넥션 풀 문제를 어떻게 완화했을까? |

<!--
insight_1 방향: 락 계층 확장, 분산 환경 동시성 제어
insight_1 예상 꼬리질문: JVM 락은 왜 분산 환경에서 안 되나? / DB 락과 Redis 락의 차이는? / 외부 락의 단점은?

insight_2 방향: 인프라 맥락 기반 기술 선택
insight_2 예상 꼬리질문: Redis 없는 환경이었다면? / 새 인프라 도입 시 고려할 점은? / 인프라 의존성의 리스크는?

followup_a1: Redis 장애 시 DB 비관적 락으로 폴백하는 이중 전략 고려. 또는 서킷 브레이커 패턴으로 장애 감지 후 빠른 실패 처리. 선착순 특성상 짧은 이벤트이므로 Redis 고가용성(Sentinel/Cluster) 구성이 우선.
followup_a2: 커넥션 풀 사이즈 확대 + 락 타임아웃 설정으로 최소한의 대기. 또는 큐 기반 순차 처리로 동시 접근 자체를 줄이는 방식. 하지만 1000명 동시 요청 시 커넥션 풀 확대에는 한계가 있음.
-->

<!--
## 문제 해결 맥락 (면접 대비용)

상황: 선착순 100명 쿠폰 발급 API
POST /coupons/issue
→ 쿠폰 수량 확인 → 차감 → 발급
→ 동시 1000명 요청 시 100명 초과 발급 발생

시도 1: synchronized 키워드
- 왜? 가장 단순한 동기화 방법
- 결과: 로컬 테스트(단일 JVM)에서 정합성 확보
- 한계: Docker Compose로 3개 인스턴스 실행 시 각 JVM이 독립적으로 락 획득
       → 각 서버에서 100명씩 발급하여 총 300명 발급됨

시도 2: SELECT FOR UPDATE (DB 비관적 락)
- 왜? 분산 환경에서 공유 가능한 락 필요
- 핵심: SELECT stock FROM coupon WHERE id = ? FOR UPDATE
- 결과: 3개 인스턴스 환경에서 정합성 확보
- 한계: 동시 1000명 요청 시 커넥션 풀(10개) 고갈
       → 대부분의 요청이 커넥션 대기 → 타임아웃

시도 3: Redis 분산락 + Lua Script
- 왜? DB 부담 분리, 원자적 처리 필요
- 핵심: 
  SETNX coupon:lock:100 {request_id} EX 5
  Lua: if stock > 0 then stock = stock - 1 end
- 결과: 동시 1000명 요청 시 100명 정확 발급, 커넥션 풀 부담 없음

인사이트 연결:
단일 서버에서는 synchronized로 충분했지만,
Scale-out을 가정하니 각 JVM이 독립적으로 동작.
DB 락으로 해결했지만 커넥션이 병목.
Redis는 이미 캐시로 사용 중이었고, 인메모리 특성상
빠른 락 획득/해제로 DB 부담을 줄일 수 있었음.
-->

<!--
## 각 시도의 적합한 상황

synchronized:
- 단일 서버 환경
- 소규모 동시성 (10명 이하)
- 추가 인프라 없이 빠른 구현 필요

DB 비관적 락:
- 분산 환경 + 트랜잭션 보장 필수
- 저~중빈도 동시 요청
- 데이터 무결성 최우선

Redis 분산락:
- 분산 환경 + 고빈도 동시 요청
- DB 부하 분리 필요
- Redis 인프라 이미 보유

우리 상황: 다중 서버 + 동시 1000명 + Redis 보유 → Redis 선택
-->

<!--
## 테스트 검증 방법

로컬 단일 인스턴스:
- ExecutorService로 1000 스레드 동시 요청
- synchronized 검증: ✓ 100명 정확 발급

Docker Compose 3개 인스턴스:
docker-compose up --scale app=3
- synchronized 검증: ✗ 300명 발급 (각 JVM 독립)
- DB 비관적 락 검증: ✓ 100명 정확 발급
- Redis 분산락 검증: ✓ 100명 정확 발급

부하 테스트:
- JMeter 1000명 동시 요청
- DB 비관적 락: 커넥션 풀 고갈로 다수 타임아웃
- Redis 분산락: 안정적 처리 확인
-->
