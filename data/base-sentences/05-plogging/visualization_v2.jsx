import { useState } from "react";

const COLORS = {
  bg: "#0f1117",
  card: "#1a1d27",
  cardBorder: "#2a2d3a",
  accent: "#4ecdc4",
  accentDim: "rgba(78,205,196,0.15)",
  warn: "#ff6b6b",
  warnDim: "rgba(255,107,107,0.15)",
  success: "#a8e6cf",
  successDim: "rgba(168,230,207,0.15)",
  text: "#e8e8e8",
  textDim: "#8a8d9a",
  grid: "#252838",
  equator: "#f9c74f",
  seoul: "#4ecdc4",
};

// ─── 탭 1: 지구 구면 시각화 ───
function GlobeView() {
  const [hoverLat, setHoverLat] = useState(null);
  const cx = 200, cy = 200, r = 160;

  const latToY = (lat) => cy - r * Math.sin((lat * Math.PI) / 180);
  const latToCircleR = (lat) => r * Math.cos((lat * Math.PI) / 180);

  const latLines = [0, 15, 30, 37.5, 45, 60, 75];
  const activeLat = hoverLat !== null ? hoverLat : 37.5;

  return (
    <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
      <div>
        <svg width={400} height={400} viewBox="0 0 400 400">
          {/* 지구 본체 */}
          <defs>
            <radialGradient id="earthGrad" cx="40%" cy="35%">
              <stop offset="0%" stopColor="#2a4a7f" />
              <stop offset="100%" stopColor="#0d1b3e" />
            </radialGradient>
            <clipPath id="earthClip">
              <ellipse cx={cx} cy={cy} rx={r} ry={r} />
            </clipPath>
          </defs>

          <ellipse cx={cx} cy={cy} rx={r} ry={r} fill="url(#earthGrad)" stroke="#3a5a9f" strokeWidth={1.5} />

          {/* 경도선 (세로) */}
          <g clipPath="url(#earthClip)" opacity={0.2}>
            {[-60, -30, 0, 30, 60].map((lon) => (
              <ellipse key={lon} cx={cx + r * Math.sin((lon * Math.PI) / 180)} cy={cy}
                rx={Math.abs(r * Math.cos((lon * Math.PI) / 180)) * 0.15} ry={r}
                fill="none" stroke="#5a7abf" strokeWidth={0.8} />
            ))}
          </g>

          {/* 위도선들 */}
          {latLines.map((lat) => {
            const y = latToY(lat);
            const rx = latToCircleR(lat);
            const isEquator = lat === 0;
            const isSeoul = lat === 37.5;
            const isActive = Math.abs(lat - activeLat) < 0.1;

            return (
              <g key={lat}>
                <ellipse cx={cx} cy={y} rx={rx} ry={rx * 0.22}
                  fill="none"
                  stroke={isEquator ? COLORS.equator : isSeoul ? COLORS.seoul : isActive ? COLORS.accent : "#4a5a8f"}
                  strokeWidth={isEquator || isSeoul || isActive ? 2.5 : 1}
                  strokeDasharray={isEquator || isSeoul ? "none" : "4 3"}
                  opacity={isEquator || isSeoul || isActive ? 1 : 0.4}
                />
                {/* 라벨 */}
                <text x={cx + rx + 8} y={y + 4}
                  fill={isEquator ? COLORS.equator : isSeoul ? COLORS.seoul : COLORS.textDim}
                  fontSize={isEquator || isSeoul ? 13 : 11}
                  fontFamily="monospace"
                  fontWeight={isEquator || isSeoul ? 700 : 400}>
                  {isSeoul ? "37.5° 서울" : `${lat}°`}
                </text>

                {/* 경도 1도 표시 화살표 */}
                {(isEquator || isSeoul || isActive) && (
                  <g>
                    <line x1={cx - 12} y1={y} x2={cx + 12} y2={y}
                      stroke={isEquator ? COLORS.equator : COLORS.seoul}
                      strokeWidth={3} markerEnd={`url(#arrow-${lat})`} markerStart={`url(#arrow-back-${lat})`} />
                    <defs>
                      <marker id={`arrow-${lat}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6" fill={isEquator ? COLORS.equator : COLORS.seoul} />
                      </marker>
                      <marker id={`arrow-back-${lat}`} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
                        <path d="M6,0 L0,3 L6,6" fill={isEquator ? COLORS.equator : COLORS.seoul} />
                      </marker>
                    </defs>
                  </g>
                )}
              </g>
            );
          })}

          {/* 축 */}
          <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20}
            stroke="#3a4a6f" strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />

          {/* 북극/남극 라벨 */}
          <text x={cx} y={cy - r - 26} textAnchor="middle" fill={COLORS.textDim} fontSize={11} fontFamily="monospace">N</text>
          <text x={cx} y={cy + r + 36} textAnchor="middle" fill={COLORS.textDim} fontSize={11} fontFamily="monospace">S</text>
        </svg>
      </div>

      {/* 설명 패널 */}
      <div style={{ flex: 1, minWidth: 260 }}>
        <h3 style={{ color: COLORS.text, margin: "0 0 16px", fontSize: 18, fontFamily: "'Noto Sans KR', sans-serif" }}>
          왜 경도 1도의 거리가 달라질까?
        </h3>
        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 20,
          border: `1px solid ${COLORS.cardBorder}`, marginBottom: 16
        }}>
          <p style={{ color: COLORS.text, margin: "0 0 12px", lineHeight: 1.7, fontSize: 14 }}>
            지구를 가로로 자르면 <span style={{ color: COLORS.equator, fontWeight: 700 }}>적도</span>에서 원이 가장 크고,
            위로 올라갈수록 원이 작아져요.
          </p>
          <p style={{ color: COLORS.text, margin: "0 0 12px", lineHeight: 1.7, fontSize: 14 }}>
            경도 1도 = 그 원 둘레의 1/360이니까,<br />
            원이 작으면 경도 1도의 실제 거리도 짧아집니다.
          </p>
        </div>

        <div style={{
          background: COLORS.card, borderRadius: 12, padding: 20,
          border: `1px solid ${COLORS.cardBorder}`
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: COLORS.equator, fontWeight: 700, fontSize: 14 }}>적도 (0°)</span>
            <span style={{ color: COLORS.equator, fontFamily: "monospace", fontSize: 14 }}>경도 1도 ≈ 111km</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ color: COLORS.seoul, fontWeight: 700, fontSize: 14 }}>서울 (37.5°)</span>
            <span style={{ color: COLORS.seoul, fontFamily: "monospace", fontSize: 14 }}>경도 1도 ≈ 88km</span>
          </div>
          <div style={{
            marginTop: 16, padding: 12, borderRadius: 8,
            background: COLORS.warnDim, border: `1px solid ${COLORS.warn}40`
          }}>
            <p style={{ color: COLORS.warn, margin: 0, fontSize: 13, lineHeight: 1.6 }}>
              ⚠️ 유클리드 공식은 경도 1도도 111km로 계산<br />
              → 서울에서 동서 방향 거리를 <strong>26% 과대평가</strong>
            </p>
          </div>
        </div>

        <div style={{
          marginTop: 16, padding: 12, borderRadius: 8,
          background: "#1e2030", fontSize: 12, color: COLORS.textDim, fontFamily: "monospace", lineHeight: 1.6
        }}>
          위도 1도 = 항상 약 111km (일정)<br />
          경도 1도 = 111km × cos(위도)<br />
          &nbsp;&nbsp;적도: 111 × cos(0°) = 111km<br />
          &nbsp;&nbsp;서울: 111 × cos(37.5°) ≈ 88km<br />
          &nbsp;&nbsp;북극: 111 × cos(90°) = 0km
        </div>
      </div>
    </div>
  );
}

// ─── 탭 2: 세 방식 비교 시각화 ───
function ComparisonView() {
  const [activeMethod, setActiveMethod] = useState("all");

  const s = 340;
  const cx = s / 2, cy = s / 2;
  const scale = 0.14;

  // 실험 결과 데이터 (반경 1km 기준)
  const directions = [
    { name: "N", angle: 90, eucErr: 2.986, havErr: 1.859 },
    { name: "NE", angle: 45, eucErr: 138.913, havErr: 0.250 },
    { name: "E", angle: 0, eucErr: 260.190, havErr: 2.363 },
    { name: "SE", angle: -45, eucErr: 138.833, havErr: 0.249 },
    { name: "S", angle: -90, eucErr: 2.988, havErr: 1.861 },
    { name: "SW", angle: -135, eucErr: 138.833, havErr: 0.249 },
    { name: "W", angle: 180, eucErr: 260.190, havErr: 2.363 },
    { name: "NW", angle: 135, eucErr: 138.913, havErr: 0.250 },
  ];

  const trueRadius = 1000;
  const sqHalf = 1000;

  const toSvg = (realM, angleDeg) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + realM * scale * Math.cos(rad),
      y: cy - realM * scale * Math.sin(rad),
    };
  };

  // 유클리드가 계산하는 (틀린) 원 → 실제로는 동서로 늘어난 타원
  const eucPoints = directions.map(d => {
    const eucDist = trueRadius + d.eucErr;
    return toSvg(eucDist, d.angle);
  });
  const eucPath = eucPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") + " Z";

  const showBetween = activeMethod === "all" || activeMethod === "between";
  const showEuc = activeMethod === "all" || activeMethod === "euclidean";
  const showHav = activeMethod === "all" || activeMethod === "haversine";
  const showTrue = true;

  return (
    <div>
      {/* 방식 선택 버튼 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {[
          { id: "all", label: "전체 비교" },
          { id: "between", label: "① BETWEEN (사각형)" },
          { id: "euclidean", label: "② 유클리드 (타원)" },
          { id: "haversine", label: "③ Haversine (원)" },
        ].map(({ id, label }) => (
          <button key={id} onClick={() => setActiveMethod(id)}
            style={{
              padding: "8px 16px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: activeMethod === id ? 700 : 400,
              fontFamily: "'Noto Sans KR', sans-serif",
              background: activeMethod === id ? COLORS.accent : COLORS.card,
              color: activeMethod === id ? COLORS.bg : COLORS.textDim,
              transition: "all 0.2s"
            }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
        <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}
          style={{ background: COLORS.bg, borderRadius: 12, border: `1px solid ${COLORS.cardBorder}`, flexShrink: 0 }}>

          {/* 그리드 */}
          {[250, 500, 750, 1000, 1250].map(d => (
            <g key={d}>
              <circle cx={cx} cy={cy} r={d * scale} fill="none" stroke={COLORS.grid} strokeWidth={0.5} />
              {d <= 1250 && <text x={cx + d * scale + 2} y={cy - 3} fill={COLORS.textDim} fontSize={8} fontFamily="monospace">{d}m</text>}
            </g>
          ))}

          {/* 방향 축 */}
          {directions.map(d => {
            const end = toSvg(1350, d.angle);
            return (
              <g key={d.name}>
                <line x1={cx} y1={cy} x2={end.x} y2={end.y} stroke={COLORS.grid} strokeWidth={0.5} />
                <text x={toSvg(1420, d.angle).x} y={toSvg(1420, d.angle).y + 3}
                  textAnchor="middle" fill={COLORS.textDim} fontSize={10} fontFamily="monospace">{d.name}</text>
              </g>
            );
          })}

          {/* ① BETWEEN 사각형 */}
          {showBetween && (
            <g opacity={activeMethod === "between" ? 0.9 : 0.4}>
              {/* 사각형 전체: 연한 빨간 틴트 */}
              <rect x={cx - sqHalf * scale} y={cy - sqHalf * scale}
                width={sqHalf * 2 * scale} height={sqHalf * 2 * scale}
                fill={COLORS.warnDim}
              />
              {/* 초과 영역(모서리): 더 진한 빨간 틴트 덮기 */}
              <path
                d={`M${cx - sqHalf * scale},${cy - sqHalf * scale} h${sqHalf * 2 * scale} v${sqHalf * 2 * scale} h${-sqHalf * 2 * scale} Z M${cx},${cy - trueRadius * scale} A${trueRadius * scale},${trueRadius * scale} 0 1,1 ${cx},${cy + trueRadius * scale} A${trueRadius * scale},${trueRadius * scale} 0 1,1 ${cx},${cy - trueRadius * scale} Z`}
                fill="rgba(255,107,107,0.25)" fillRule="evenodd"
              />
              {/* 사각형 테두리 */}
              <rect x={cx - sqHalf * scale} y={cy - sqHalf * scale}
                width={sqHalf * 2 * scale} height={sqHalf * 2 * scale}
                fill="none" stroke={COLORS.warn} strokeWidth={1.5} strokeDasharray="6 3"
              />
            </g>
          )}

          {/* ② 유클리드 (찌그러진 형태) */}
          {showEuc && (
            <path d={eucPath}
              fill="rgba(255,200,50,0.08)" stroke="#f9c74f" strokeWidth={1.5}
              opacity={activeMethod === "euclidean" ? 0.9 : 0.5} />
          )}

          {/* ③ Haversine ≈ 실제 원 */}
          {showHav && (
            <circle cx={cx} cy={cy} r={trueRadius * scale}
              fill={COLORS.successDim} stroke={COLORS.success} strokeWidth={2}
              opacity={activeMethod === "haversine" ? 0.9 : 0.5} />
          )}

          {/* 실제 반경 1km 원 (기준) */}
          <circle cx={cx} cy={cy} r={trueRadius * scale}
            fill="none" stroke="white" strokeWidth={1} strokeDasharray="2 2" opacity={0.3} />

          {/* 중심점 */}
          <circle cx={cx} cy={cy} r={4} fill="white" />
          <text x={cx + 8} y={cy - 8} fill="white" fontSize={10} fontFamily="monospace">광화문</text>

          {/* 오차 표시 화살표 (유클리드 활성시) */}
          {activeMethod === "euclidean" && directions.filter(d => d.name === "E").map(d => {
            const trueEnd = toSvg(trueRadius, d.angle);
            const eucEnd = toSvg(trueRadius + d.eucErr, d.angle);
            return (
              <g key={`err-${d.name}`}>
                <line x1={trueEnd.x} y1={trueEnd.y - 8} x2={eucEnd.x} y2={eucEnd.y - 8}
                  stroke={COLORS.warn} strokeWidth={2} />
                <text x={(trueEnd.x + eucEnd.x) / 2} y={trueEnd.y - 14}
                  textAnchor="middle" fill={COLORS.warn} fontSize={10} fontWeight={700} fontFamily="monospace">
                  +260m
                </text>
              </g>
            );
          })}
        </svg>

        {/* 우측 데이터 패널 */}
        <div style={{ flex: 1, minWidth: 280 }}>
          {(activeMethod === "all" || activeMethod === "between") && (
            <div style={{
              background: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12,
              border: `1px solid ${COLORS.warn}30`
            }}>
              <h4 style={{ color: COLORS.warn, margin: "0 0 10px", fontSize: 14 }}>① BETWEEN (사각형 필터링)</h4>
              <p style={{ color: COLORS.textDim, fontSize: 12, margin: "0 0 8px", lineHeight: 1.6 }}>
                거리를 계산하지 않음. 위도·경도 범위로 사각형을 만듦
              </p>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.text, lineHeight: 1.8 }}>
                <div>변 중앙 → 중심: <span style={{ color: COLORS.success }}>999m (≈ 정확)</span></div>
                <div>모서리 → 중심: <span style={{ color: COLORS.warn }}>1,413m (+413m, +41.3%)</span></div>
                <div>초과 면적: <span style={{ color: COLORS.warn }}>858,407m² (+27.3%)</span></div>
              </div>
            </div>
          )}

          {(activeMethod === "all" || activeMethod === "euclidean") && (
            <div style={{
              background: COLORS.card, borderRadius: 12, padding: 16, marginBottom: 12,
              border: `1px solid #f9c74f30`
            }}>
              <h4 style={{ color: "#f9c74f", margin: "0 0 10px", fontSize: 14 }}>② 유클리드 (평면 근사)</h4>
              <p style={{ color: COLORS.textDim, fontSize: 12, margin: "0 0 8px", lineHeight: 1.6 }}>
                원형으로 계산하지만, 경도 1도 = 위도 1도로 취급
              </p>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.text, lineHeight: 1.8 }}>
                <div>N/S 방향: <span style={{ color: COLORS.success }}>+3.0m (0.3%)</span> ← 거의 정확</div>
                <div>NE/SE 등: <span style={{ color: "#f9c74f" }}>+139m (13.9%)</span></div>
                <div>E/W 방향: <span style={{ color: COLORS.warn }}>+260m (26.0%)</span> ← 최대 오차</div>
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${COLORS.cardBorder}` }}>
                  최대 오차: <span style={{ color: COLORS.warn }}>+260m (경도 방향)</span>
                </div>
              </div>
            </div>
          )}

          {(activeMethod === "all" || activeMethod === "haversine") && (
            <div style={{
              background: COLORS.card, borderRadius: 12, padding: 16,
              border: `1px solid ${COLORS.success}30`
            }}>
              <h4 style={{ color: COLORS.success, margin: "0 0 10px", fontSize: 14 }}>③ Haversine (구면 기하학)</h4>
              <p style={{ color: COLORS.textDim, fontSize: 12, margin: "0 0 8px", lineHeight: 1.6 }}>
                지구가 구라는 것을 반영하여 대원 거리 계산
              </p>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: COLORS.text, lineHeight: 1.8 }}>
                <div>모든 방향: <span style={{ color: COLORS.success }}>0.2 ~ 2.4m</span></div>
                <div>최대 오차: <span style={{ color: COLORS.success }}>2.4m (0.24%)</span></div>
                <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${COLORS.cardBorder}` }}>
                  개선: <span style={{ color: COLORS.accent }}>최대 오차 260m → 2.4m</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 탭 3: 오차 데이터 테이블 ───
function DataTable() {
  const data = [
    { dir: "N", vincenty: 1000.000, euc: 1002.986, hav: 1001.859, eucErr: "+2.986", eucRate: "0.30%", havErr: "+1.859", havRate: "0.19%" },
    { dir: "NE", vincenty: 1000.000, euc: 1138.913, hav: 999.750, eucErr: "+138.913", eucRate: "13.89%", havErr: "-0.250", havRate: "0.02%" },
    { dir: "E", vincenty: 1000.000, euc: 1260.190, hav: 997.637, eucErr: "+260.190", eucRate: "26.02%", havErr: "-2.363", havRate: "0.24%" },
    { dir: "SE", vincenty: 1000.000, euc: 1138.833, hav: 999.751, eucErr: "+138.833", eucRate: "13.88%", havErr: "-0.249", havRate: "0.02%" },
    { dir: "S", vincenty: 1000.000, euc: 1002.988, hav: 1001.861, eucErr: "+2.988", eucRate: "0.30%", havErr: "+1.861", havRate: "0.19%" },
    { dir: "SW", vincenty: 1000.000, euc: 1138.833, hav: 999.751, eucErr: "+138.833", eucRate: "13.88%", havErr: "-0.249", havRate: "0.02%" },
    { dir: "W", vincenty: 1000.000, euc: 1260.190, hav: 997.637, eucErr: "+260.190", eucRate: "26.02%", havErr: "-2.363", havRate: "0.24%" },
    { dir: "NW", vincenty: 1000.000, euc: 1138.913, hav: 999.750, eucErr: "+138.913", eucRate: "13.89%", havErr: "-0.250", havRate: "0.02%" },
  ];

  const cellStyle = { padding: "10px 12px", borderBottom: `1px solid ${COLORS.cardBorder}`, fontSize: 13, fontFamily: "monospace" };
  const headerStyle = { ...cellStyle, color: COLORS.textDim, fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px" };

  return (
    <div>
      <div style={{
        background: COLORS.card, borderRadius: 12, padding: 20, marginBottom: 16,
        border: `1px solid ${COLORS.cardBorder}`
      }}>
        <h4 style={{ color: COLORS.text, margin: "0 0 8px", fontSize: 14 }}>
          최대 오차 260m은 어디서 나온 숫자?
        </h4>
        <p style={{ color: COLORS.textDim, fontSize: 13, margin: 0, lineHeight: 1.7 }}>
          8방향에서 측정한 유클리드 오차 중 <strong style={{ color: COLORS.warn }}>E/W 방향(경도 방향)</strong>에서 가장 큰 오차가 발생해요.
          경도 1도(서울 88km)를 위도 1도(111km)와 동일하게 취급하기 때문입니다.
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", background: COLORS.card, borderRadius: 12 }}>
          <thead>
            <tr style={{ background: "#1e2030" }}>
              <th style={{ ...headerStyle, textAlign: "center" }}>방향</th>
              <th style={{ ...headerStyle, textAlign: "right" }}>실제 거리</th>
              <th style={{ ...headerStyle, textAlign: "right", color: "#f9c74f" }}>유클리드</th>
              <th style={{ ...headerStyle, textAlign: "right", color: "#f9c74f" }}>오차</th>
              <th style={{ ...headerStyle, textAlign: "right", color: "#f9c74f" }}>오차율</th>
              <th style={{ ...headerStyle, textAlign: "right", color: COLORS.success }}>Haversine</th>
              <th style={{ ...headerStyle, textAlign: "right", color: COLORS.success }}>오차</th>
              <th style={{ ...headerStyle, textAlign: "right", color: COLORS.success }}>오차율</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isHighErr = parseFloat(row.eucRate) > 10;
              return (
                <tr key={row.dir} style={{ background: isHighErr ? "rgba(255,107,107,0.04)" : "transparent" }}>
                  <td style={{ ...cellStyle, textAlign: "center", color: COLORS.text, fontWeight: 700 }}>{row.dir}</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: COLORS.textDim }}>{row.vincenty.toFixed(1)}m</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: isHighErr ? COLORS.warn : COLORS.text }}>{row.euc.toFixed(1)}m</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: isHighErr ? COLORS.warn : COLORS.success }}>{row.eucErr}m</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: isHighErr ? COLORS.warn : COLORS.success, fontWeight: 700 }}>{row.eucRate}</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: COLORS.success }}>{row.hav.toFixed(1)}m</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: COLORS.success }}>{row.havErr}m</td>
                  <td style={{ ...cellStyle, textAlign: "right", color: COLORS.success, fontWeight: 700 }}>{row.havRate}</td>
                </tr>
              );
            })}
            {/* 최대 오차 행 */}
            <tr style={{ background: "#1e2030", borderTop: `2px solid ${COLORS.accent}` }}>
              <td style={{ ...cellStyle, textAlign: "center", color: COLORS.accent, fontWeight: 700 }}>최대</td>
              <td style={{ ...cellStyle, textAlign: "right", color: COLORS.textDim }}>1000.0m</td>
              <td style={cellStyle}></td>
              <td style={{ ...cellStyle, textAlign: "right", color: COLORS.warn, fontWeight: 700 }}>260.2m</td>
              <td style={{ ...cellStyle, textAlign: "right", color: COLORS.warn, fontWeight: 700 }}>26.02%</td>
              <td style={cellStyle}></td>
              <td style={{ ...cellStyle, textAlign: "right", color: COLORS.success, fontWeight: 700 }}>2.4m</td>
              <td style={{ ...cellStyle, textAlign: "right", color: COLORS.success, fontWeight: 700 }}>0.24%</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* BETWEEN 절대 오차 */}
      <div style={{
        background: COLORS.card, borderRadius: 12, padding: 20, marginTop: 16,
        border: `1px solid ${COLORS.warn}30`
      }}>
        <h4 style={{ color: COLORS.warn, margin: "0 0 12px", fontSize: 14 }}>
          BETWEEN의 절대 오차
        </h4>
        <p style={{ color: COLORS.textDim, fontSize: 13, margin: "0 0 12px", lineHeight: 1.7 }}>
          BETWEEN은 거리를 계산하지 않으므로 "거리 오차"가 아니라 "영역 오차"로 봐야 합니다.
        </p>
        <div style={{ fontFamily: "monospace", fontSize: 13, color: COLORS.text, lineHeight: 2 }}>
          <div>변 중앙(N,E,S,W) → 중심까지: <span style={{ color: COLORS.success }}>999m</span> (거의 정확)</div>
          <div>모서리(NE,SE,SW,NW) → 중심까지: <span style={{ color: COLORS.warn }}>1,413m</span> (반경 대비 <span style={{ color: COLORS.warn }}>+413m, +41.3%</span>)</div>
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: `1px solid ${COLORS.cardBorder}` }}>
            초과 면적: 858,407m² → 원 대비 <span style={{ color: COLORS.warn }}>+27.3%</span> 더 넓은 영역 조회
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── 메인 컴포넌트 ───
export default function App() {
  const [tab, setTab] = useState("globe");

  const tabs = [
    { id: "globe", label: "🌍 왜 경도 ≠ 위도?", desc: "지구 구면 이해" },
    { id: "compare", label: "📐 세 방식 비교", desc: "시각적 차이" },
    { id: "data", label: "📊 실험 데이터", desc: "방향별 오차" },
  ];

  return (
    <div style={{
      fontFamily: "'Noto Sans KR', -apple-system, sans-serif",
      background: COLORS.bg, color: COLORS.text,
      minHeight: "100vh", padding: "24px 20px"
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* 헤더 */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: COLORS.text }}>
          좌표계 특성과 거리 계산 오차
        </h1>
        <p style={{ margin: "6px 0 0", color: COLORS.textDim, fontSize: 14 }}>
          위도·경도가 평면이 아닌 구면 좌표라서 생기는 문제를 시각적으로 이해하기
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: "10px 18px", borderRadius: 10, border: "none", cursor: "pointer",
              background: tab === t.id ? COLORS.accent : COLORS.card,
              color: tab === t.id ? COLORS.bg : COLORS.textDim,
              fontWeight: tab === t.id ? 700 : 400,
              fontSize: 14, fontFamily: "'Noto Sans KR', sans-serif",
              transition: "all 0.2s",
              boxShadow: tab === t.id ? `0 2px 12px ${COLORS.accent}40` : "none"
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* 콘텐츠 */}
      <div style={{
        background: COLORS.bg, borderRadius: 16, padding: 4
      }}>
        {tab === "globe" && <GlobeView />}
        {tab === "compare" && <ComparisonView />}
        {tab === "data" && <DataTable />}
      </div>
    </div>
  );
}
