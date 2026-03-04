"""
================================================================================
거리 계산 공식별 오차 측정 실험
================================================================================

[ 실험 목적 ]
위치 기반 반경 조회에서 사용되는 3가지 거리 계산 방식의 정확도를 비교한다.
- 방식 1: BETWEEN (사각형 필터링)
- 방식 2: 유클리드 거리 (평면 근사)
- 방식 3: Haversine 공식 (구면 기하학)

[ Ground Truth ]
Vincenty 공식 (WGS-84 타원체 기반, 오차 0.5mm 이하)을 정답으로 사용한다.
500m 스케일에서 Haversine과 Vincenty의 차이는 수 cm 이하이므로,
Haversine의 개선 효과를 더 엄밀하게 확인하기 위해 Vincenty를 기준으로 삼는다.

[ 측정 기준 정의 ]

1. 절대 오차 (Absolute Error)
   정의: |계산된 거리 - 실제 거리|
   단위: m (미터)
   의미: 계산값이 실제값에서 얼마나 벗어나는지의 절대적 크기

2. 오차율 (Error Rate)
   정의: (절대 오차 / 실제 거리) × 100%
   단위: %
   의미: 실제 거리 대비 오차의 비율. 거리 규모에 무관하게 정확도를 비교 가능

3. 초과 조회 면적 (Excess Query Area)
   정의: 각 방식의 조회 영역 면적 - 실제 원형 반경의 면적
   단위: m²
   의미: BETWEEN(사각형)이 원형 반경 대비 얼마나 넓은 영역을 불필요하게 조회하는지

[ 실험 설계 ]

- 기준점: 서울 광화문 (위도 37.5759, 경도 126.9769)
- 반경: 500m
- 측정 방향: 8방향 (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
  → 방향에 따른 오차 변화를 관찰하기 위함 (경도 방향 vs 위도 방향)
- 목표 지점 생성: Vincenty 공식의 direct problem으로 정확히 500m 떨어진 좌표 생성
- 각 목표 지점에 대해 유클리드/Haversine 거리를 계산하여 Vincenty 값과 비교

================================================================================
"""

import math

# ============================================================================
# 상수
# ============================================================================

EARTH_RADIUS_M = 6_371_000  # 지구 평균 반지름 (m)

# WGS-84 타원체 파라미터
WGS84_A = 6_378_137.0        # 장반경 (m)
WGS84_F = 1 / 298.257223563  # 편평률
WGS84_B = WGS84_A * (1 - WGS84_F)  # 단반경 (m)


# ============================================================================
# 거리 계산 함수들
# ============================================================================

def euclidean_distance(lat1, lon1, lat2, lon2):
    """
    유클리드 거리 (평면 근사)
    
    위도·경도를 단순 숫자로 취급하여 피타고라스 정리로 거리 계산.
    위도 1도와 경도 1도의 실제 거리 차이를 무시한다.
    
    실제 SQL: SQRT(POWER(lat2-lat1, 2) + POWER(lon2-lon1, 2))
    이 값에 "도 → m" 변환을 위해 위도 1도 ≈ 111,320m 를 곱한다.
    """
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    degree_distance = math.sqrt(dlat**2 + dlon**2)
    # 위도 1도 ≈ 111,320m 로 단순 변환 (유클리드의 핵심 오류: 경도 1도도 같은 값으로 취급)
    return degree_distance * 111_320


def haversine_distance(lat1, lon1, lat2, lon2):
    """
    Haversine 공식 (구면 기하학)
    
    지구를 완전한 구로 가정하고, 두 점 사이의 대원 거리(great-circle distance)를 계산.
    공식: d = R × c
    여기서 c = 2 × atan2(√a, √(1-a))
          a = sin²(Δφ/2) + cos(φ₁) × cos(φ₂) × sin²(Δλ/2)
    """
    lat1_r, lat2_r = math.radians(lat1), math.radians(lat2)
    dlat_r = math.radians(lat2 - lat1)
    dlon_r = math.radians(lon2 - lon1)

    a = (math.sin(dlat_r / 2) ** 2 +
         math.cos(lat1_r) * math.cos(lat2_r) * math.sin(dlon_r / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return EARTH_RADIUS_M * c


def vincenty_distance(lat1, lon1, lat2, lon2):
    """
    Vincenty 공식 (타원체 기하학) - Inverse Problem
    
    WGS-84 타원체 기반으로 두 점 사이의 측지선 거리를 반복 계산.
    오차 0.5mm 이하. Ground Truth로 사용.
    """
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    L = math.radians(lon2 - lon1)

    U1 = math.atan((1 - WGS84_F) * math.tan(phi1))
    U2 = math.atan((1 - WGS84_F) * math.tan(phi2))
    sin_U1, cos_U1 = math.sin(U1), math.cos(U1)
    sin_U2, cos_U2 = math.sin(U2), math.cos(U2)

    lam = L
    for _ in range(100):
        sin_lam = math.sin(lam)
        cos_lam = math.cos(lam)
        sin_sigma = math.sqrt(
            (cos_U2 * sin_lam) ** 2 +
            (cos_U1 * sin_U2 - sin_U1 * cos_U2 * cos_lam) ** 2
        )
        if sin_sigma == 0:
            return 0.0

        cos_sigma = sin_U1 * sin_U2 + cos_U1 * cos_U2 * cos_lam
        sigma = math.atan2(sin_sigma, cos_sigma)
        sin_alpha = cos_U1 * cos_U2 * sin_lam / sin_sigma
        cos2_alpha = 1 - sin_alpha ** 2
        cos_2sigma_m = cos_sigma - 2 * sin_U1 * sin_U2 / cos2_alpha if cos2_alpha != 0 else 0

        C = WGS84_F / 16 * cos2_alpha * (4 + WGS84_F * (4 - 3 * cos2_alpha))
        lam_prev = lam
        lam = L + (1 - C) * WGS84_F * sin_alpha * (
            sigma + C * sin_sigma * (
                cos_2sigma_m + C * cos_sigma * (-1 + 2 * cos_2sigma_m ** 2)
            )
        )
        if abs(lam - lam_prev) < 1e-12:
            break

    u2 = cos2_alpha * (WGS84_A ** 2 - WGS84_B ** 2) / WGS84_B ** 2
    A_coeff = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
    B_coeff = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))
    delta_sigma = B_coeff * sin_sigma * (
        cos_2sigma_m + B_coeff / 4 * (
            cos_sigma * (-1 + 2 * cos_2sigma_m ** 2) -
            B_coeff / 6 * cos_2sigma_m * (-3 + 4 * sin_sigma ** 2) *
            (-3 + 4 * cos_2sigma_m ** 2)
        )
    )

    return WGS84_B * A_coeff * (sigma - delta_sigma)


def vincenty_direct(lat1, lon1, bearing_deg, distance_m):
    """
    Vincenty Direct Problem
    
    기준점에서 특정 방위각(bearing)으로 특정 거리만큼 떨어진 좌표를 계산.
    목표 지점 생성에 사용. 정확히 500m 떨어진 좌표를 만든다.
    """
    phi1 = math.radians(lat1)
    alpha1 = math.radians(bearing_deg)
    s = distance_m

    U1 = math.atan((1 - WGS84_F) * math.tan(phi1))
    sin_U1, cos_U1 = math.sin(U1), math.cos(U1)
    sigma1 = math.atan2(math.tan(U1), math.cos(alpha1))
    sin_alpha = cos_U1 * math.sin(alpha1)
    cos2_alpha = 1 - sin_alpha ** 2
    u2 = cos2_alpha * (WGS84_A ** 2 - WGS84_B ** 2) / WGS84_B ** 2
    A_coeff = 1 + u2 / 16384 * (4096 + u2 * (-768 + u2 * (320 - 175 * u2)))
    B_coeff = u2 / 1024 * (256 + u2 * (-128 + u2 * (74 - 47 * u2)))

    sigma = s / (WGS84_B * A_coeff)
    for _ in range(100):
        cos_2sigma_m = math.cos(2 * sigma1 + sigma)
        sin_sigma = math.sin(sigma)
        cos_sigma = math.cos(sigma)
        delta_sigma = B_coeff * sin_sigma * (
            cos_2sigma_m + B_coeff / 4 * (
                cos_sigma * (-1 + 2 * cos_2sigma_m ** 2) -
                B_coeff / 6 * cos_2sigma_m * (-3 + 4 * sin_sigma ** 2) *
                (-3 + 4 * cos_2sigma_m ** 2)
            )
        )
        sigma_prev = sigma
        sigma = s / (WGS84_B * A_coeff) + delta_sigma
        if abs(sigma - sigma_prev) < 1e-12:
            break

    sin_sigma = math.sin(sigma)
    cos_sigma = math.cos(sigma)
    cos_2sigma_m = math.cos(2 * sigma1 + sigma)

    phi2 = math.atan2(
        sin_U1 * cos_sigma + cos_U1 * sin_sigma * math.cos(alpha1),
        (1 - WGS84_F) * math.sqrt(
            sin_alpha ** 2 +
            (sin_U1 * sin_sigma - cos_U1 * cos_sigma * math.cos(alpha1)) ** 2
        )
    )
    lam = math.atan2(
        sin_sigma * math.sin(alpha1),
        cos_U1 * cos_sigma - sin_U1 * sin_sigma * math.cos(alpha1)
    )
    C = WGS84_F / 16 * cos2_alpha * (4 + WGS84_F * (4 - 3 * cos2_alpha))
    L = lam - (1 - C) * WGS84_F * sin_alpha * (
        sigma + C * sin_sigma * (
            cos_2sigma_m + C * cos_sigma * (-1 + 2 * cos_2sigma_m ** 2)
        )
    )

    lat2 = math.degrees(phi2)
    lon2 = lon1 + math.degrees(L)
    return lat2, lon2


# ============================================================================
# 초과 조회 면적 계산
# ============================================================================

def calc_area_comparison(radius_m):
    """
    각 방식의 조회 영역 면적을 비교한다.
    
    - BETWEEN: 한 변이 2r인 정사각형 → (2r)²
    - 유클리드/Haversine: 반지름 r인 원 → πr²
    - 초과 면적: 정사각형 - 원 (BETWEEN이 원 대비 얼마나 넓은지)
    
    참고: 500m 스케일에서 구면 원과 평면 원의 면적 차이는 0.001% 미만으로 무시 가능
    """
    square_area = (2 * radius_m) ** 2
    circle_area = math.pi * radius_m ** 2
    excess = square_area - circle_area
    excess_rate = (excess / circle_area) * 100
    return square_area, circle_area, excess, excess_rate


# ============================================================================
# 실험 실행
# ============================================================================

def run_experiment():
    # 실험 파라미터
    origin_lat = 37.5759   # 서울 광화문
    origin_lon = 126.9769
    radius = 1000           # 1000m (1km)
    bearings = [0, 45, 90, 135, 180, 225, 270, 315]  # 8방향
    direction_names = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']

    print("=" * 80)
    print("거리 계산 공식별 오차 측정 실험 결과")
    print("=" * 80)
    print(f"\n기준점: 서울 광화문 ({origin_lat}, {origin_lon})")
    print(f"반  경: {radius}m")
    print(f"Ground Truth: Vincenty 공식 (WGS-84 타원체, 오차 < 0.5mm)")
    print(f"측정 방향: {len(bearings)}방향 ({', '.join(direction_names)})")

    # ── 1. 방향별 거리 계산 ──
    print("\n" + "-" * 80)
    print("1. 방향별 거리 계산 결과")
    print("-" * 80)
    print(f"{'방향':>4}  {'Vincenty(GT)':>12}  {'유클리드':>10}  {'Haversine':>10}  "
          f"{'유클리드 오차':>12}  {'Haversine 오차':>14}")
    print(f"{'':>4}  {'(m)':>12}  {'(m)':>10}  {'(m)':>10}  "
          f"{'(m)':>12}  {'(m)':>14}")
    print("·" * 80)

    euclidean_errors = []
    haversine_errors = []
    euclidean_abs_errors = []
    haversine_abs_errors = []

    for bearing, name in zip(bearings, direction_names):
        # Vincenty direct로 정확히 500m 떨어진 좌표 생성
        target_lat, target_lon = vincenty_direct(origin_lat, origin_lon, bearing, radius)

        # 각 방식으로 거리 계산
        d_vincenty = vincenty_distance(origin_lat, origin_lon, target_lat, target_lon)
        d_euclidean = euclidean_distance(origin_lat, origin_lon, target_lat, target_lon)
        d_haversine = haversine_distance(origin_lat, origin_lon, target_lat, target_lon)

        # 오차 계산
        err_euclidean = d_euclidean - d_vincenty
        err_haversine = d_haversine - d_vincenty
        abs_err_euclidean = abs(err_euclidean)
        abs_err_haversine = abs(err_haversine)
        rate_euclidean = (abs_err_euclidean / d_vincenty) * 100
        rate_haversine = (abs_err_haversine / d_vincenty) * 100

        euclidean_errors.append(rate_euclidean)
        haversine_errors.append(rate_haversine)
        euclidean_abs_errors.append(abs_err_euclidean)
        haversine_abs_errors.append(abs_err_haversine)

        print(f"{name:>4}  {d_vincenty:>12.3f}  {d_euclidean:>10.3f}  {d_haversine:>10.3f}  "
              f"{err_euclidean:>+10.3f}m  {err_haversine:>+12.6f}m")

    # ── 2. 오차 통계 요약 ──
    print("\n" + "-" * 80)
    print("2. 오차 통계 요약")
    print("-" * 80)

    print("\n[ 유클리드 거리 vs Vincenty (Ground Truth) ]")
    print(f"  평균 절대 오차:  {sum(euclidean_abs_errors)/len(euclidean_abs_errors):>10.3f} m")
    print(f"  최대 절대 오차:  {max(euclidean_abs_errors):>10.3f} m")
    print(f"  최소 절대 오차:  {min(euclidean_abs_errors):>10.3f} m")
    print(f"  평균 오차율:     {sum(euclidean_errors)/len(euclidean_errors):>10.3f} %")
    print(f"  최대 오차율:     {max(euclidean_errors):>10.3f} %")

    print("\n[ Haversine 공식 vs Vincenty (Ground Truth) ]")
    print(f"  평균 절대 오차:  {sum(haversine_abs_errors)/len(haversine_abs_errors):>10.6f} m")
    print(f"  최대 절대 오차:  {max(haversine_abs_errors):>10.6f} m")
    print(f"  최소 절대 오차:  {min(haversine_abs_errors):>10.6f} m")
    print(f"  평균 오차율:     {sum(haversine_errors)/len(haversine_errors):>10.6f} %")
    print(f"  최대 오차율:     {max(haversine_errors):>10.6f} %")

    # ── 3. 개선율 ──
    print("\n" + "-" * 80)
    print("3. 개선율 (유클리드 → Haversine)")
    print("-" * 80)

    avg_euc = sum(euclidean_abs_errors) / len(euclidean_abs_errors)
    avg_hav = sum(haversine_abs_errors) / len(haversine_abs_errors)
    improvement_abs = avg_euc - avg_hav
    improvement_rate = (improvement_abs / avg_euc) * 100

    avg_euc_rate = sum(euclidean_errors) / len(euclidean_errors)
    avg_hav_rate = sum(haversine_errors) / len(haversine_errors)

    print(f"\n  절대 오차 개선:  {avg_euc:.3f}m → {avg_hav:.6f}m ({improvement_rate:.2f}% 개선)")
    print(f"  오차율 개선:     {avg_euc_rate:.3f}% → {avg_hav_rate:.6f}%")

    # ── 4. 초과 조회 면적 (BETWEEN vs 원형) ──
    print("\n" + "-" * 80)
    print("4. 초과 조회 면적 (BETWEEN 사각형 vs 원형 반경)")
    print("-" * 80)

    sq_area, ci_area, excess, excess_rate = calc_area_comparison(radius)

    print(f"\n  BETWEEN (정사각형):  {sq_area:>12,.0f} m²  (한 변 {radius*2}m)")
    print(f"  원형 반경:           {ci_area:>12,.0f} m²  (반지름 {radius}m)")
    print(f"  초과 면적:           {excess:>12,.0f} m²")
    print(f"  초과 비율:           {excess_rate:>11.2f} %  (원 대비)")

    # ── 5. 포트폴리오용 요약 ──
    print("\n" + "=" * 80)
    print("5. 포트폴리오용 요약 수치")
    print("=" * 80)
    print(f"""
  ┌─────────────────────────────────────────────────────────┐
  │  측정 기준         유클리드          Haversine           │
  ├─────────────────────────────────────────────────────────┤
  │  평균 절대 오차    {avg_euc:>7.1f}m         {avg_hav:>8.4f}m         │
  │  평균 오차율       {avg_euc_rate:>7.3f}%        {avg_hav_rate:>8.6f}%      │
  │  개선율            {improvement_rate:.2f}% (절대 오차 기준)            │
  └─────────────────────────────────────────────────────────┘

  ※ BETWEEN(사각형)은 거리 계산이 아닌 영역 필터링 방식이므로
    거리 오차율이 아닌 초과 면적({excess_rate:.1f}%)으로 별도 표기
""")


if __name__ == "__main__":
    run_experiment()
