"""
운동 자세 판정 로직 변천사 (추정 재현)
MediaPipe Pose 기반 - 직교좌표 → 구면좌표 → 공통 각도 모듈
"""

import numpy as np

# ============================================================
# STAGE 1: 직교좌표 직접 사용 (최초 시도)
# - MediaPipe가 주는 xyz 좌표를 그대로 활용
# - 운동마다 완전히 다른 판정 로직
# ============================================================

def stage1_check_squat(landmarks):
    """스쿼트: 무릎 y좌표와 엉덩이 y좌표 비교 등 단순 위치 기반"""
    hip = landmarks['hip']
    knee = landmarks['knee']
    ankle = landmarks['ankle']

    # 무릎이 충분히 굽혀졌는지를 y좌표 차이로 판단
    # → 카메라 각도, 사람 키에 따라 기준이 달라지는 문제
    if hip[1] - knee[1] < 0.1:  # y좌표 차이가 작으면 앉은 자세
        return "squat_down"
    return "standing"


def stage1_check_bicep_curl(landmarks):
    """바이셉 컬: 손목과 어깨의 거리로 팔 굽힘 판단"""
    shoulder = landmarks['shoulder']
    wrist = landmarks['wrist']

    # 유클리드 거리로 판단
    # → 팔 길이, 카메라 거리에 따라 기준값이 달라짐
    dist = np.sqrt(sum((a - b) ** 2 for a, b in zip(shoulder, wrist)))
    if dist < 0.3:
        return "curl_up"
    return "curl_down"


# ============================================================
# STAGE 2: 구면좌표계 변환 (개선 1)
# - 관절 중심으로 구면좌표 변환
# - 회전 움직임을 θ, φ로 표현 가능해짐
# - 하지만 운동마다 중심점/축 설정이 달라 매번 별도 구현
# ============================================================

def to_spherical(origin, target):
    """origin을 중심으로 target의 구면좌표 (r, theta, phi) 반환"""
    dx = target[0] - origin[0]
    dy = target[1] - origin[1]
    dz = target[2] - origin[2]

    r = np.sqrt(dx**2 + dy**2 + dz**2)
    theta = np.arccos(dz / r) if r > 0 else 0        # 앙각 (zenith)
    phi = np.arctan2(dy, dx)                           # 방위각 (azimuth)

    return r, np.degrees(theta), np.degrees(phi)


def stage2_check_squat(landmarks):
    """스쿼트: 무릎을 중심으로 발목의 구면좌표 → θ로 굽힘 판단"""
    hip = np.array(landmarks['hip'])
    knee = np.array(landmarks['knee'])
    ankle = np.array(landmarks['ankle'])

    # 무릎을 원점으로, 발목 방향의 구면좌표
    # → 축: 무릎 → 엉덩이 방향이 기준축
    r, theta, phi = to_spherical(knee, ankle)

    if theta < 90:
        return "squat_down"
    return "standing"


def stage2_check_bicep_curl(landmarks):
    """바이셉 컬: 팔꿈치를 중심으로 손목의 구면좌표 → θ로 굽힘 판단"""
    shoulder = np.array(landmarks['shoulder'])
    elbow = np.array(landmarks['elbow'])
    wrist = np.array(landmarks['wrist'])

    # 팔꿈치를 원점으로, 손목 방향의 구면좌표
    # → 축: 팔꿈치 → 어깨 방향이 기준축
    r, theta, phi = to_spherical(elbow, wrist)

    if theta < 45:
        return "curl_up"
    return "curl_down"

# ↑ 문제: to_spherical은 공통이지만,
#   "어디를 중심으로, 어떤 축 기준으로" 변환할지를
#   운동마다 별도로 설정해야 함
#   → 새 운동 추가 시 여전히 개별 구현 필요


# ============================================================
# STAGE 3: 공통 각도 계산 모듈 (개선 2, 최종)
# - 세 관절 좌표를 넣으면 사잇각을 반환
# - 중심점/축 고민 불필요 — 벡터 사잇각으로 통일
# - 운동별 코드는 "어떤 관절 3개 + 임계값"만 정의
# ============================================================

def calculate_angle(point_a, point_b, point_c):
    """
    공통 각도 계산 모듈
    point_b를 꼭짓점으로 한 ∠ABC의 각도를 반환

    Args:
        point_a: 관절 좌표 (x, y, z)
        point_b: 꼭짓점 관절 좌표 (x, y, z)
        point_c: 관절 좌표 (x, y, z)

    Returns:
        float: 각도 (degrees, 0~180)
    """
    a = np.array(point_a)
    b = np.array(point_b)
    c = np.array(point_c)

    ba = a - b  # B → A 벡터
    bc = c - b  # B → C 벡터

    cosine = np.dot(ba, bc) / (np.linalg.norm(ba) * np.linalg.norm(bc) + 1e-8)
    cosine = np.clip(cosine, -1.0, 1.0)
    angle = np.degrees(np.arccos(cosine))

    return angle


# --- 운동별 판정: 관절 조합 + 임계값만 정의 ---

def stage3_check_squat(landmarks):
    """스쿼트: 엉덩이-무릎-발목 각도"""
    angle = calculate_angle(
        landmarks['hip'],
        landmarks['knee'],    # 꼭짓점: 무릎
        landmarks['ankle']
    )
    return "squat_down" if angle < 90 else "standing"


def stage3_check_bicep_curl(landmarks):
    """바이셉 컬: 어깨-팔꿈치-손목 각도"""
    angle = calculate_angle(
        landmarks['shoulder'],
        landmarks['elbow'],   # 꼭짓점: 팔꿈치
        landmarks['wrist']
    )
    return "curl_up" if angle < 45 else "curl_down"


def stage3_check_pushup(landmarks):
    """푸시업: 어깨-팔꿈치-손목 각도 (새 운동 추가 = 이것만 작성)"""
    angle = calculate_angle(
        landmarks['shoulder'],
        landmarks['elbow'],   # 꼭짓점: 팔꿈치
        landmarks['wrist']
    )
    return "pushup_down" if angle < 90 else "pushup_up"


# ============================================================
# 비교 테스트
# ============================================================
if __name__ == "__main__":
    # 테스트용 랜드마크 (가상 데이터)
    test_landmarks = {
        'hip':      (0.5, 0.4, 0.0),
        'knee':     (0.5, 0.6, 0.0),
        'ankle':    (0.5, 0.8, 0.0),
        'shoulder': (0.5, 0.3, 0.0),
        'elbow':    (0.5, 0.5, 0.0),
        'wrist':    (0.4, 0.6, 0.0),
    }

    print("=== Stage 3: 공통 각도 모듈 ===")
    print(f"스쿼트 무릎 각도: {calculate_angle(test_landmarks['hip'], test_landmarks['knee'], test_landmarks['ankle']):.1f}°")
    print(f"바이셉컬 팔꿈치 각도: {calculate_angle(test_landmarks['shoulder'], test_landmarks['elbow'], test_landmarks['wrist']):.1f}°")
    print(f"스쿼트 판정: {stage3_check_squat(test_landmarks)}")
    print(f"바이셉컬 판정: {stage3_check_bicep_curl(test_landmarks)}")
