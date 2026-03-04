# Phase 3-2: Redis Ranking Optimization (Interview Guide)

## 프로젝트 개요

**목표:** 실시간 판매 랭킹 조회를 DB 기반에서 Redis Sorted Set으로 전환하여 99% 성능 개선

**핵심 성과:**
- v1 (DB, no index): p95 2.8s, 77.5% 성공률
- v2 (DB, with index): p95 5.9s, 72.6% 성공률 (오히려 악화!)
- v3 (String cache): p95 202ms, 100% 성공률
- v4 (Sorted Set): **p95 16.5ms, 100% 성공률** ✨

**개선율:** v2 대비 99.7% 개선 (5906ms → 16.5ms)

---

## 핵심 인사이트 (면접 1분 요약)

```
"실시간 랭킹 조회를 최적화하면서 4단계 진화를 거쳤습니다.

v1(DB 직접 조회)은 150K rows를 GROUP BY하느라 느렸고,
v2(covering index 추가)는 단일 요청엔 빨랐지만 
100 VU 부하에서 index lock contention으로 오히려 악화됐습니다.

v3(String 캐싱)로 100% 성공률을 달성했지만 p95가 202ms였고,
v4(Sorted Set)로 16.5ms까지 단축했습니다.

가장 중요한 발견은 '결과 캐싱 vs 구조 캐싱'의 차이였습니다.
v3는 조회 결과 전체를 JSON으로 저장해 갱신 시마다 DB를 다시 봐야 했지만,
v4는 정렬 구조 자체를 저장해 ZINCRBY만으로 원자적으로 갱신할 수 있었습니다."
```

---

## v1 → v2 → v3 → v4 진화 과정

### v1: DB 직접 조회 (Baseline)

**구현:**
```java
@Query(value = """
    SELECT oi.product_id, SUM(oi.quantity) as sales_count
    FROM order_items oi
    GROUP BY oi.product_id
    ORDER BY sales_count DESC
    LIMIT 100
    """, nativeQuery = true)
List<Object[]> findTopProductsBySales(@Param("limit") int limit);
```

**성능 (100 VU):**
- p95: 2812ms
- 성공률: 77.5%
- 처리량: 37.7 req/s

**문제점:**
- 매 요청마다 150K rows 스캔
- GROUP BY + SUM 집계 연산
- ORDER BY filesort
- 동시성 증가 시 DB 병목

---

### v2: Covering Index 추가

**인덱스:**
```sql
CREATE INDEX idx_orderitem_product_quantity 
ON order_items(product_id, quantity);
```

**기대:**
- Index scan으로 성능 개선
- Using index (filesort 없이)

**실제 결과 (100 VU):**
- p95: **5906ms** (v1의 2배!)
- 성공률: 72.6% (v1보다 낮음)
- 처리량: 23.7 req/s (37% 감소)

**왜 악화됐나?**
```
단일 요청: index 효과 있음 (150ms → 138ms)
고부하 (100 VU): index lock contention
→ 더 많은 스레드가 같은 index 대기
→ timeout 증가
→ 처리량 감소
→ 성능 악화
```

**핵심 교훈:**
> "인덱스 최적화만으로는 고부하를 해결할 수 없다"

---

### v3: Redis String Cache

**구현:**
```java
public RankingResponse getRankings() {
    String cached = redisRepository.getCachedRanking();
    if (cached != null) {
        return objectMapper.readValue(cached, RankingResponse.class);
    }
    
    // Cache miss: DB 조회
    RankingResponse response = queryFromDB();
    
    // 캐시에 저장 (5분 TTL)
    String json = objectMapper.writeValueAsString(response);
    redisRepository.cacheRanking(json);
    
    return response;
}
```

**성능 (100 VU):**
- p95: 201.85ms
- 성공률: 100%
- 처리량: 368 req/s

**개선점:**
- DB 부하 해소
- 안정적인 응답 시간
- 100% 성공률 달성

**한계:**
1. **Race Condition 발생**
   - 100개 스레드가 동시에 cache miss
   - 모두 DB 조회 → 중복 쿼리
   - Lost Update 가능성

2. **갱신 비용**
   - 주문 발생 시 전체 재조회 필요
   - DB 의존성 여전히 존재

---

### v4: Redis Sorted Set (최종 솔루션)

**구현:**
```java
// 조회: Redis만 사용
public RankingResponse getRankings() {
    Set<TypedTuple<Object>> topN = redisRepository.getTopN(100);
    // ZREVRANGE ranking:products 0 99 WITHSCORES
    
    List<RankingItemResponse> rankings = topN.stream()
        .map(tuple -> new RankingItemResponse(
            rank++,
            Long.parseLong(tuple.getValue().toString()),
            "Product " + tuple.getValue(),
            tuple.getScore().longValue()
        ))
        .toList();
    
    return new RankingResponse(rankings, LocalDateTime.now());
}

// 갱신: 원자적 연산
public void incrementScore(Long productId, int quantity) {
    redisRepository.incrementScore(productId, quantity);
    // ZINCRBY ranking:products {quantity} {productId}
    
    redisRepository.removeOutOfTop(100);
    // ZREMRANGEBYRANK ranking:products 0 -101
}
```

**성능 (100 VU):**
- p95: **16.51ms**
- 성공률: 100%
- 처리량: 519 req/s

**핵심 장점:**
1. **Zero DB 조회**
   - 읽기 시 DB 접근 없음
   - Redis 메모리 연산만

2. **원자적 갱신**
   - ZINCRBY는 단일 명령어
   - Race condition 불가능

3. **자동 메모리 관리**
   - ZREMRANGEBYRANK로 top 100 유지
   - 메모리: 1.28MB 고정

4. **실시간 반영**
   - 주문 즉시 랭킹 업데이트
   - 배치 작업 불필요

---

## 결과 캐싱 vs 구조 캐싱 (핵심 개념)

### 비교표

| 항목 | v3 (String 캐싱) | v4 (Sorted Set) |
|------|------------------|-----------------|
| **저장 대상** | 조회 결과 전체 (JSON) | 정렬 구조 (score + member) |
| **갱신 방식** | DB 재조회 → 전체 덮어쓰기 | ZINCRBY로 증분 갱신 |
| **DB 의존성** | 매번 필요 | 불필요 (Redis만으로 완결) |
| **동시성** | Race Condition 발생 | 원자적 연산 보장 |
| **메모리** | 고정 크기 (~100KB) | ZREMRANGEBYRANK로 관리 |
| **실시간성** | TTL 만료 시 갱신 | 즉시 반영 |

### 핵심 차이

```
v3: "어떤 결과가 나왔는지" 저장
→ 변경 시 처음부터 다시 계산

v4: "어떻게 정렬되어 있는지" 저장
→ 변경 시 점수만 조정
```

**면접 포인트:**
> "어떻게 저장할까가 아니라, 어떻게 갱신하고 조회할까를 먼저 분석해야 합니다"

---

## Race Condition 시퀀스 다이어그램

### v3의 Lost Update 문제

```
Thread A        Cache        DB           Thread B
   |              |           |              |
   |--read(null)->|           |              |
   |              |<-null-----|              |
   |              |           |--read(null)->|
   |              |           |<----null-----|
   |              |           |              |
   |--------query DB--------->|              |
   |<----100 items------------|              |
   |              |           |              |
   |              |           |--------query DB--------->
   |              |           |<----100 items------------|
   |              |           |              |
   |--write(100)->|           |              |
   |              |           |              |
   |              |           |--write(100)->|  ⚠️ Overwrite!
   |              |           |              |

결과: 200개 주문이 발생했지만 캐시엔 100만 기록됨 (Lost Update)
```

### v4의 원자적 연산

```
Thread A        Redis                     Thread B
   |              |                          |
   |--ZINCRBY 10->|                          |
   |              |<-OK--                    |
   |              |                          |
   |              |                --ZINCRBY 10->
   |              |                <-OK----------
   |              |                          |

결과: 20개 모두 정확히 반영 (Atomic operation)
```

---

## 정합성 보장 전략

### 3-Layer Architecture

```
┌─────────────────────────────────────┐
│   DB (Source of Truth)              │  ← 모든 주문 데이터
│   - order_items 테이블              │
│   - 150K rows                       │
└─────────────────────────────────────┘
              ↑
              │ (1) 주문 저장
              │ (2) 1시간마다 drift 체크
              │
┌─────────────────────────────────────┐
│   Redis (Performance Layer)         │  ← 실시간 랭킹
│   - Sorted Set: ranking:products    │
│   - Top 100 only                    │
└─────────────────────────────────────┘
              ↑
              │ ZINCRBY (실시간 갱신)
              │
┌─────────────────────────────────────┐
│   Application (Business Logic)      │
│   - OrderService                    │
│   - RankingV4Service                │
└─────────────────────────────────────┘
```

### Drift 보정 전략

**시나리오:** Redis 갱신 실패 시
```java
// OrderService.createOrder()
order.save();  // ✅ DB 저장 성공

try {
    rankingV4Service.incrementScore(productId, quantity);
} catch (RedisException e) {
    log.warn("Redis update failed, will be recovered by batch");
    // ⚠️ Redis 갱신 실패 (일시적 불일치 허용)
}
```

**복구:**
```java
@Scheduled(cron = "0 0 * * * *")  // 매시간
public void checkAndRecoverRanking() {
    // 1. DB에서 실제 top 10 조회
    List<Object[]> dbTop10 = orderItemRepository.findTopProductsBySales(10);
    
    // 2. Redis에서 현재 top 10 조회
    Set<TypedTuple<Object>> redisTop10 = redisRepository.getTopN(10);
    
    // 3. 비교: 10% 이상 차이 나면 전체 재구축
    if (hasDrift(dbTop10, redisTop10, 0.1)) {
        rebuildRankingFromDB();
    }
}
```

**정합성 보장:**
- DB = Source of Truth (항상 정확)
- Redis = 캐시 (1시간 이내 정합성 보장)
- 최대 drift: 1시간

---

## 부하 테스트 결과 분석

### 테스트 환경
- k6 load test
- 100 VU (Virtual Users)
- 2분 실행 (30s warmup → 1min load → 30s cooldown)

### 결과 비교

| Version | p50 | p95 | p99 | 성공률 | 처리량 | 총 요청 |
|---------|-----|-----|-----|--------|--------|---------|
| **v1** | 1.29s | 2.81s | - | 77.5% | 37.7/s | 4,527 |
| **v2** | 2.00s | **5.91s** | - | 72.6% | 23.7/s | 2,849 |
| **v3** | 13.7ms | 202ms | - | 100% | 368/s | 44,190 |
| **v4** | **2.6ms** | **16.5ms** | - | **100%** | **519/s** | **62,339** |

### 주요 발견

#### 1. v2의 역설 (Index Contention)
```
v1: 4,527 requests in 2min
v2: 2,849 requests in 2min  ← 37% 감소!

왜? Covering index에 100개 스레드가 동시에 접근
→ Lock contention
→ 대기 시간 증가
→ Timeout 발생
→ 처리량 감소
```

**교훈:**
> "인덱스는 단일 쿼리 최적화엔 유효하지만, 동시성 환경에선 오히려 병목이 될 수 있다"

#### 2. v4의 안정성
```
v3: p50 13.7ms, p95 202ms  (14.7배 차이)
v4: p50 2.6ms,  p95 16.5ms (6.3배 차이)

v4는 p50과 p95 격차가 작음 = 안정적
```

**이유:**
- Redis 메모리 연산 (지연 시간 일정)
- DB 경합 없음
- Network I/O만 변수

---

## 메모리 관리 최적화

### ZREMRANGEBYRANK 전략

**문제:** Sorted Set은 계속 커질 수 있음

**해결:**
```java
public void incrementScore(Long productId, int quantity) {
    // 1. 점수 증가
    redisTemplate.opsForZSet()
        .incrementScore("ranking:products", productId.toString(), quantity);
    
    // 2. Top 100만 유지 (나머지 삭제)
    redisTemplate.opsForZSet()
        .removeRange("ranking:products", 0, -101);
        // 0번째부터 -101번째까지 제거
        // = 하위 모두 제거, Top 100만 남김
}
```

**메모리 효율:**
```bash
# 확인
redis-cli ZCARD ranking:products
# 결과: 100 (항상 유지)

redis-cli INFO memory | grep used_memory_human
# 결과: 1.28M (고정)
```

**스케일:**
- 1M 사용자 동시 접속해도 1.28MB
- Scale-out 불필요

---

## 면접 대비 Q&A

### Q1. "왜 Redis를 선택했나요?"

**답변:**
```
3가지 이유입니다:

1. 성능: 메모리 기반이라 DB 대비 100배 빠릅니다.
2. 자료구조: Sorted Set이 랭킹에 최적화되어 있습니다.
3. 원자성: ZINCRBY 같은 원자적 연산으로 동시성 문제를 해결합니다.

특히 Sorted Set의 ZREVRANGE는 이미 정렬된 상태로 저장하므로
ORDER BY 연산이 불필요하고, 시간복잡도가 O(log N + M)입니다.
```

### Q2. "Redis가 죽으면 어떻게 하나요?"

**답변:**
```
3단계 대응 전략이 있습니다:

1. Fallback: v1/v2 엔드포인트로 자동 전환
   - DB에서 직접 조회 (느리지만 동작)
   
2. Recovery: RankingInitializer가 재시작 시 자동 복구
   - DB에서 top 100 로드
   
3. Monitoring: 1시간마다 drift 체크
   - DB와 Redis 비교
   - 10% 이상 차이 시 재구축

DB가 Source of Truth이므로 데이터 유실은 없습니다.
```

### Q3. "실시간 정합성을 어떻게 보장하나요?"

**답변:**
```
완벽한 실시간 정합성은 trade-off입니다.

현재 전략:
- 주문 시 즉시 ZINCRBY (99.9% 반영)
- Redis 장애 시 1시간 이내 복구
- 비즈니스적으로 허용 가능한 drift

완벽한 정합성이 필요하다면:
1. 2PC (Two-Phase Commit)
2. Saga Pattern
3. Event Sourcing

하지만 랭킹은 "대략적인 순위"로 충분하므로
eventual consistency 접근이 적절합니다.
```

### Q4. "v2가 v1보다 느린 게 이상한데요?"

**답변:**
```
나: "처음엔 저도 의아했습니다. 그런데 JSON 로그를 보니
     v2의 총 요청 수가 2,849개, v1은 4,527개였습니다.
     
     같은 2분 동안 v2가 37% 적게 처리했다는 건,
     covering index의 lock contention 때문에
     오히려 병목이 심해진 겁니다.
     
     실제로 p95를 보면:
     - v1: 2.8초
     - v2: 5.9초 (2배 악화)
     
     이게 바로 '인덱스 최적화만으론 부족하다'는
     증거입니다."
면접관: "오... 실측 데이터가 확실하네요."
```
```
제가 처음 본 결과도 의외였습니다.

원인을 분석한 결과:
- 단일 요청: v2가 빠름 (index 효과)
- 100 VU 부하: v2가 느림 (lock contention)

covering index에 100개 스레드가 동시 접근하면
MySQL의 index lock이 병목이 됩니다.

실제 로그를 보면:
- v1: 4,527 requests (처리량 높음)
- v2: 2,849 requests (37% 감소)

더 적게 처리 = 더 느림을 의미합니다.

이 경험으로 "인덱스만으론 부족하다"는 교훈을 얻었습니다.
```

### Q5. "왜 String cache 대신 Sorted Set을 쓰나요?"

**답변:**
```
핵심은 "갱신 패턴"의 차이입니다:

String cache (v3):
- 저장: 전체 결과 (JSON)
- 갱신: DB 재조회 → 덮어쓰기
- 문제: Race condition 발생

Sorted Set (v4):
- 저장: 정렬 구조 (score + member)
- 갱신: ZINCRBY로 증분 업데이트
- 장점: 원자적 연산

비유하자면:
- v3: 매번 전체 성적표를 다시 만듦
- v4: 점수만 수정하고 자동 정렬

v4가 구조적으로 우월합니다.
```

### Q6. "100개만 저장하는 이유는?"

**답변:**
```
3가지 이유입니다:

1. 비즈니스: 사용자는 top 100만 봄
   - 101위 이하는 의미 없음
   
2. 메모리: 1.28MB로 고정
   - 무한정 커지지 않음
   
3. 성능: ZREVRANGE O(log N + M)
   - N이 작을수록 빠름

만약 전체 저장하면:
- 100K products × 20 bytes = 2MB
- 조회 시간도 증가
- 메모리 낭비

ZREMRANGEBYRANK로 자동 관리하므로
운영 부담도 없습니다.
```

---

## 기술 스택 & 핵심 명령어

### Redis 명령어

```bash
# 점수 증가 (원자적)
ZINCRBY ranking:products 10 "product:1"

# Top 100 조회
ZREVRANGE ranking:products 0 99 WITHSCORES

# 특정 상품 점수 조회
ZSCORE ranking:products "product:1"

# 하위 제거 (top 100만 유지)
ZREMRANGEBYRANK ranking:products 0 -101

# 현재 개수 확인
ZCARD ranking:products

# 메모리 사용량
INFO memory
```

### Spring Boot 구현

```java
// RedisTemplate 설정
@Bean
public RedisTemplate<String, Object> redisTemplate() {
    RedisTemplate<String, Object> template = new RedisTemplate<>();
    template.setConnectionFactory(redisConnectionFactory());
    template.setKeySerializer(new StringRedisSerializer());
    template.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    return template;
}

// Sorted Set 연산
public void incrementScore(Long productId, double delta) {
    redisTemplate.opsForZSet()
        .incrementScore(RANKING_KEY, productId.toString(), delta);
}

public Set<TypedTuple<Object>> getTopN(int n) {
    return redisTemplate.opsForZSet()
        .reverseRangeWithScores(RANKING_KEY, 0, n - 1);
}
```

---

## 실무 적용 시 고려사항

### 1. Cache Warming
```java
@Component
public class RankingInitializer implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        // 서버 시작 시 Redis 초기화
        List<Object[]> top100 = orderItemRepository.findTopProductsBySales(100);
        
        for (Object[] row : top100) {
            Long productId = (Long) row[0];
            Long salesCount = (Long) row[1];
            redisRepository.incrementScore(productId, salesCount);
        }
        
        log.info("Ranking initialized: {} products", top100.size());
    }
}
```

### 2. Monitoring & Alerting
```java
@Scheduled(cron = "0 */10 * * * *")  // 10분마다
public void healthCheck() {
    try {
        Long zcard = redisTemplate.opsForZSet().zCard(RANKING_KEY);
        
        if (zcard == null || zcard == 0) {
            alert("Redis ranking is empty!");
            rebuildRankingFromDB();
        }
        
        if (zcard > 150) {
            alert("Redis ranking size exceeded: " + zcard);
        }
    } catch (Exception e) {
        alert("Redis health check failed: " + e.getMessage());
    }
}
```

### 3. 트래픽 패턴별 전략

| 시나리오 | 전략 | 이유 |
|----------|------|------|
| **평시** | v4 (Sorted Set) | 안정적 성능 |
| **플래시 세일** | v4 + Read Replica | 읽기 분산 |
| **Redis 장애** | Fallback to v1 | 가용성 보장 |
| **새벽 시간** | Batch rebuild | 정합성 체크 |

---

## 마무리: 프로젝트에서 얻은 것

### 기술적 성장
1. ✅ **Redis 실전 활용**: Sorted Set으로 실시간 랭킹 구현
2. ✅ **동시성 문제 해결**: Race condition 재현 및 해결
3. ✅ **성능 측정 methodology**: k6 부하 테스트로 정량적 증명
4. ✅ **Trade-off 분석**: Index vs Cache vs Structure

### 면접 준비
1. ✅ **실측 데이터**: "99.7% 개선" (5906ms → 16.5ms)
2. ✅ **문제 해결 과정**: v1 → v2 → v3 → v4 진화
3. ✅ **예상치 못한 결과**: v2의 index contention 발견
4. ✅ **시스템 설계 능력**: 3-layer architecture로 정합성 보장

### 핵심 메시지
> "Redis Sorted Set은 단순한 캐싱이 아니라, 
> 데이터 구조 자체를 저장하는 '구조 캐싱'입니다.
> 이 차이를 이해하면 실시간 랭킹뿐 아니라
> 리더보드, 타임라인, 추천 시스템 등 다양한 문제를 해결할 수 있습니다."

---

## 참고 자료

- [Redis Sorted Set 공식 문서](https://redis.io/docs/data-types/sorted-sets/)
- [Spring Data Redis 레퍼런스](https://docs.spring.io/spring-data/redis/docs/current/reference/html/)
- k6 Load Testing: `results/k6/phase3-2-v1~v4.json`
- Race Condition Test: `src/test/java/com/project/race/RankingRaceConditionTest.java`

---

**작성일:** 2026-02-09  
**테스트 환경:** MacBook Air M1, Docker (MySQL 8.0, Redis 7), Java 17, Spring Boot 3.5.10
