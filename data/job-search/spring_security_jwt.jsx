import React, { useState } from "react";

const Tab = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap ${
      active ? "bg-slate-800 text-white" : "bg-slate-200 text-slate-600 hover:bg-slate-300"
    }`}
  >
    {label}
  </button>
);

/* ─── SVG: Spring Security 내부 동작 구조 ─── */
const SecurityInternalFlowSVG = () => (
  <svg viewBox="0 0 820 520" className="w-full" style={{ maxHeight: 540 }}>
    <defs>
      <marker id="arrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="#64748b" />
      </marker>
      <marker id="arrow-green" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="#059669" />
      </marker>
      <marker id="arrow-red" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="#dc2626" />
      </marker>
    </defs>

    {/* Background */}
    <rect x="0" y="0" width="820" height="520" rx="12" fill="#f8fafc" />

    {/* Title */}
    <text x="410" y="30" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#1e293b">Spring Security 내부 동작 구조</text>

    {/* Red box - Security Filter area */}
    <rect x="30" y="45" width="480" height="460" rx="8" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="6,3" />
    <text x="50" y="68" fontSize="11" fill="#ef4444" fontWeight="600">Security Filter Chain</text>

    {/* HTTP Request */}
    <rect x="560" y="80" width="130" height="40" rx="6" fill="#e2e8f0" stroke="#94a3b8" />
    <text x="625" y="105" textAnchor="middle" fontSize="12" fontWeight="600" fill="#475569">HTTP Request</text>

    {/* Arrow: Request → AuthFilter */}
    <line x1="560" y1="100" x2="430" y2="100" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />

    {/* 1. AuthenticationFilter */}
    <rect x="200" y="80" width="220" height="42" rx="6" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1.5" />
    <text x="310" y="98" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1e40af">①</text>
    <text x="310" y="113" textAnchor="middle" fontSize="12" fontWeight="600" fill="#1e40af">AuthenticationFilter</text>

    {/* Arrow down to AuthManager */}
    <line x1="310" y1="122" x2="310" y2="160" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <text x="320" y="148" fontSize="9" fill="#64748b">Authentication 객체</text>

    {/* 2. AuthenticationManager */}
    <rect x="200" y="165" width="220" height="42" rx="6" fill="#fef3c7" stroke="#f59e0b" strokeWidth="1.5" />
    <text x="310" y="183" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">②</text>
    <text x="310" y="198" textAnchor="middle" fontSize="12" fontWeight="600" fill="#92400e">AuthenticationManager</text>

    {/* Arrow down to AuthProvider */}
    <line x1="310" y1="207" x2="310" y2="245" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <text x="320" y="233" fontSize="9" fill="#64748b">인증 위임</text>

    {/* 3. AuthenticationProvider */}
    <rect x="200" y="250" width="220" height="42" rx="6" fill="#ffedd5" stroke="#f97316" strokeWidth="1.5" />
    <text x="310" y="268" textAnchor="middle" fontSize="11" fontWeight="700" fill="#9a3412">③</text>
    <text x="310" y="283" textAnchor="middle" fontSize="12" fontWeight="600" fill="#9a3412">AuthenticationProvider</text>

    {/* Arrow down to UserDetailsService */}
    <line x1="310" y1="292" x2="310" y2="330" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />

    {/* 4. UserDetailsService */}
    <rect x="200" y="335" width="220" height="42" rx="6" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
    <text x="310" y="353" textAnchor="middle" fontSize="11" fontWeight="700" fill="#065f46">④</text>
    <text x="310" y="368" textAnchor="middle" fontSize="12" fontWeight="600" fill="#065f46">UserDetailsService</text>

    {/* DB */}
    <ellipse cx="560" cy="356" rx="50" ry="18" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
    <rect x="510" y="338" width="100" height="18" fill="#e0e7ff" stroke="#e0e7ff" />
    <ellipse cx="560" cy="338" rx="50" ry="18" fill="#e0e7ff" stroke="#6366f1" strokeWidth="1.5" />
    <text x="560" y="352" textAnchor="middle" fontSize="12" fontWeight="600" fill="#4338ca">DB</text>

    {/* Arrow: UDS → DB */}
    <line x1="420" y1="356" x2="505" y2="356" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <text x="462" y="348" textAnchor="middle" fontSize="9" fill="#64748b">조회</text>

    {/* Arrow: DB → UDS (return) */}
    <line x1="505" y1="370" x2="420" y2="370" stroke="#059669" strokeWidth="1.5" markerEnd="url(#arrow-green)" strokeDasharray="4,2" />
    <text x="462" y="385" textAnchor="middle" fontSize="9" fill="#059669">UserDetails</text>

    {/* Return arrows (up) - dashed */}
    <line x1="195" y1="356" x2="195" y2="292" stroke="#059669" strokeWidth="1.2" markerEnd="url(#arrow-green)" strokeDasharray="4,2" />
    <line x1="195" y1="270" x2="195" y2="207" stroke="#059669" strokeWidth="1.2" markerEnd="url(#arrow-green)" strokeDasharray="4,2" />
    <line x1="195" y1="185" x2="195" y2="122" stroke="#059669" strokeWidth="1.2" markerEnd="url(#arrow-green)" strokeDasharray="4,2" />
    <text x="140" y="250" fontSize="9" fill="#059669" textAnchor="middle">검증 결과</text>
    <text x="140" y="262" fontSize="9" fill="#059669" textAnchor="middle">반환 ↑</text>

    {/* SecurityContextHolder */}
    <rect x="560" y="170" width="180" height="40" rx="6" fill="#fce7f3" stroke="#ec4899" strokeWidth="1.5" />
    <text x="650" y="195" textAnchor="middle" fontSize="11" fontWeight="600" fill="#9d174d">SecurityContextHolder</text>

    {/* Arrow: AuthFilter → SCH */}
    <line x1="420" y1="95" x2="480" y2="95" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="480" y1="95" x2="480" y2="185" stroke="#64748b" strokeWidth="1" strokeDasharray="3,2" />
    <line x1="480" y1="185" x2="555" y2="185" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" strokeDasharray="3,2" />
    <text x="530" y="155" fontSize="9" fill="#64748b" textAnchor="middle">인증 정보</text>
    <text x="530" y="167" fontSize="9" fill="#64748b" textAnchor="middle">저장</text>

    {/* Success / Failure boxes */}
    <rect x="560" y="240" width="120" height="36" rx="6" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
    <text x="620" y="263" textAnchor="middle" fontSize="11" fontWeight="600" fill="#166534">✓ 인증 성공</text>

    <rect x="560" y="290" width="120" height="36" rx="6" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
    <text x="620" y="313" textAnchor="middle" fontSize="11" fontWeight="600" fill="#991b1b">✗ 인증 실패</text>

    {/* Success path */}
    <rect x="700" y="240" width="100" height="36" rx="6" fill="#d1fae5" stroke="#059669" />
    <text x="750" y="258" textAnchor="middle" fontSize="10" fill="#065f46">→ Controller</text>
    <text x="750" y="270" textAnchor="middle" fontSize="10" fill="#065f46">로직 실행</text>

    <line x1="680" y1="258" x2="695" y2="258" stroke="#059669" strokeWidth="1.5" markerEnd="url(#arrow-green)" />

    {/* Failure path */}
    <rect x="700" y="290" width="100" height="36" rx="6" fill="#fef2f2" stroke="#dc2626" />
    <text x="750" y="308" textAnchor="middle" fontSize="10" fill="#991b1b">401</text>
    <text x="750" y="320" textAnchor="middle" fontSize="10" fill="#991b1b">Unauthorized</text>

    <line x1="680" y1="308" x2="695" y2="308" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#arrow-red)" />

    {/* Legend */}
    <rect x="560" y="430" width="230" height="70" rx="6" fill="#f1f5f9" stroke="#cbd5e1" />
    <text x="575" y="448" fontSize="10" fontWeight="600" fill="#475569">범례</text>
    <line x1="575" y1="460" x2="605" y2="460" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arrow)" />
    <text x="615" y="464" fontSize="9" fill="#64748b">요청 흐름</text>
    <line x1="575" y1="478" x2="605" y2="478" stroke="#059669" strokeWidth="1.5" strokeDasharray="4,2" markerEnd="url(#arrow-green)" />
    <text x="615" y="482" fontSize="9" fill="#059669">응답/반환 흐름</text>
    <rect x="575" y="488" width="30" height="8" rx="2" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,2" />
    <text x="615" y="497" fontSize="9" fill="#ef4444">Security 영역</text>
  </svg>
);

/* ─── SVG: 로그인 시퀀스 다이어그램 ─── */
const LoginSequenceSVG = () => (
  <svg viewBox="0 0 820 680" className="w-full" style={{ maxHeight: 700 }}>
    <defs>
      <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="#475569" />
      </marker>
      <marker id="arr-back" markerWidth="8" markerHeight="6" refX="0" refY="3" orient="auto">
        <path d="M8,0 L0,3 L8,6" fill="#059669" />
      </marker>
    </defs>

    <rect x="0" y="0" width="820" height="680" rx="12" fill="#f8fafc" />

    {/* Participants */}
    {[
      { x: 80, label: "Client", color: "#e2e8f0", border: "#94a3b8" },
      { x: 230, label: "JwtAuth\nFilter", color: "#dbeafe", border: "#3b82f6" },
      { x: 380, label: "Auth\nManager", color: "#fef3c7", border: "#f59e0b" },
      { x: 530, label: "UserDetails\nService", color: "#d1fae5", border: "#059669" },
      { x: 650, label: "JwtToken\nProvider", color: "#e0e7ff", border: "#6366f1" },
      { x: 770, label: "DB/Redis", color: "#fce7f3", border: "#ec4899" },
    ].map((p, i) => (
      <g key={i}>
        <rect x={p.x - 45} y="40" width="90" height="40" rx="6" fill={p.color} stroke={p.border} strokeWidth="1.5" />
        {p.label.split("\n").map((line, j) => (
          <text key={j} x={p.x} y={57 + j * 13} textAnchor="middle" fontSize="10" fontWeight="600" fill="#1e293b">{line}</text>
        ))}
        {/* Lifeline */}
        <line x1={p.x} y1="80" x2={p.x} y2="670" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4,3" />
      </g>
    ))}

    {/* Section 1: Login */}
    <rect x="10" y="90" width="800" height="15" rx="3" fill="#d1fae5" opacity="0.5" />
    <text x="410" y="101" textAnchor="middle" fontSize="10" fontWeight="700" fill="#065f46">1. 로그인 (토큰 발급)</text>

    {/* Login flow arrows */}
    {[
      { y: 125, x1: 80, x2: 230, text: "POST /login (username, pw)", color: "#475569" },
      { y: 155, x1: 230, x2: 380, text: "Authentication 객체 전달", color: "#475569" },
      { y: 185, x1: 380, x2: 530, text: "loadUserByUsername()", color: "#475569" },
      { y: 215, x1: 530, x2: 770, text: "SELECT user", color: "#475569" },
      { y: 245, x1: 770, x2: 530, text: "User 엔티티", color: "#059669", dash: true },
      { y: 275, x1: 530, x2: 380, text: "UserDetails 반환", color: "#059669", dash: true },
      { y: 305, x1: 380, x2: 230, text: "인증 성공", color: "#059669", dash: true },
      { y: 335, x1: 230, x2: 650, text: "토큰 생성 요청", color: "#475569" },
      { y: 365, x1: 650, x2: 230, text: "Access(30분) + Refresh(7일)", color: "#059669", dash: true },
      { y: 395, x1: 230, x2: 770, text: "Refresh Token 저장", color: "#475569" },
      { y: 425, x1: 230, x2: 80, text: "토큰 반환", color: "#059669", dash: true },
    ].map((a, i) => (
      <g key={i}>
        <line x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} stroke={a.color} strokeWidth="1.5"
          strokeDasharray={a.dash ? "4,2" : "none"}
          markerEnd={a.x1 < a.x2 ? "url(#arr)" : "url(#arr-back)"} />
        <text x={(a.x1 + a.x2) / 2} y={a.y - 6} textAnchor="middle" fontSize="9" fill={a.color}>{a.text}</text>
      </g>
    ))}

    {/* Section 2: API Request */}
    <rect x="10" y="445" width="800" height="15" rx="3" fill="#dbeafe" opacity="0.5" />
    <text x="410" y="456" textAnchor="middle" fontSize="10" fontWeight="700" fill="#1e40af">2. API 요청 (토큰 검증)</text>

    {[
      { y: 480, x1: 80, x2: 230, text: "Bearer <Access Token>", color: "#475569" },
      { y: 510, x1: 230, x2: 650, text: "토큰 파싱 & 서명 검증", color: "#475569" },
      { y: 540, x1: 650, x2: 230, text: "Claims (userId, role)", color: "#059669", dash: true },
      { y: 570, x1: 230, x2: 80, text: "→ SecurityContext 설정 → Controller → 응답", color: "#059669", dash: true },
    ].map((a, i) => (
      <g key={`api-${i}`}>
        <line x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} stroke={a.color} strokeWidth="1.5"
          strokeDasharray={a.dash ? "4,2" : "none"}
          markerEnd={a.x1 < a.x2 ? "url(#arr)" : "url(#arr-back)"} />
        <text x={(a.x1 + a.x2) / 2} y={a.y - 6} textAnchor="middle" fontSize="9" fill={a.color}>{a.text}</text>
      </g>
    ))}

    {/* Section 3: Token Refresh */}
    <rect x="10" y="590" width="800" height="15" rx="3" fill="#fef3c7" opacity="0.5" />
    <text x="410" y="601" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400e">3. 토큰 갱신 (Access Token 만료 시)</text>

    {[
      { y: 625, x1: 80, x2: 230, text: "POST /refresh (Refresh Token)", color: "#475569" },
      { y: 645, x1: 230, x2: 770, text: "Refresh Token 유효성 확인", color: "#475569" },
      { y: 660, x1: 230, x2: 80, text: "새 Access Token 반환", color: "#059669", dash: true },
    ].map((a, i) => (
      <g key={`ref-${i}`}>
        <line x1={a.x1} y1={a.y} x2={a.x2} y2={a.y} stroke={a.color} strokeWidth="1.5"
          strokeDasharray={a.dash ? "4,2" : "none"}
          markerEnd={a.x1 < a.x2 ? "url(#arr)" : "url(#arr-back)"} />
        <text x={(a.x1 + a.x2) / 2} y={a.y - 6} textAnchor="middle" fontSize="9" fill={a.color}>{a.text}</text>
      </g>
    ))}
  </svg>
);

/* ─── SVG: API 요청 흐름 (간단) ─── */
const ApiRequestSVG = () => (
  <svg viewBox="0 0 820 180" className="w-full" style={{ maxHeight: 200 }}>
    <rect x="0" y="0" width="820" height="180" rx="12" fill="#f8fafc" />
    <text x="410" y="25" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#1e293b">API 요청 시 토큰 검증 흐름</text>

    {[
      { x: 60, label: "Client", bg: "#e2e8f0", border: "#94a3b8" },
      { x: 220, label: "JwtAuthFilter", bg: "#dbeafe", border: "#3b82f6" },
      { x: 390, label: "JwtTokenProvider", bg: "#e0e7ff", border: "#6366f1" },
      { x: 560, label: "SecurityContext", bg: "#fce7f3", border: "#ec4899" },
      { x: 720, label: "Controller", bg: "#d1fae5", border: "#059669" },
    ].map((item, i) => (
      <g key={i}>
        <rect x={item.x - 55} y="50" width="110" height="36" rx="6" fill={item.bg} stroke={item.border} strokeWidth="1.5" />
        <text x={item.x} y="73" textAnchor="middle" fontSize="11" fontWeight="600" fill="#1e293b">{item.label}</text>
        {i < 4 && (
          <>
            <line x1={item.x + 55} y1="68" x2={[220, 390, 560, 720][i] - 55} y2="68" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#arr)" />
          </>
        )}
      </g>
    ))}

    {/* Labels */}
    <text x="140" y="48" textAnchor="middle" fontSize="9" fill="#64748b">Bearer Token</text>
    <text x="305" y="48" textAnchor="middle" fontSize="9" fill="#64748b">파싱 & 검증</text>
    <text x="475" y="48" textAnchor="middle" fontSize="9" fill="#64748b">인증 정보 설정</text>
    <text x="640" y="48" textAnchor="middle" fontSize="9" fill="#64748b">권한 확인</text>

    {/* Bottom descriptions */}
    <text x="60" y="115" textAnchor="middle" fontSize="9" fill="#64748b">Authorization 헤더에</text>
    <text x="60" y="127" textAnchor="middle" fontSize="9" fill="#64748b">Access Token 담아 요청</text>
    <text x="220" y="115" textAnchor="middle" fontSize="9" fill="#64748b">토큰 추출 후</text>
    <text x="220" y="127" textAnchor="middle" fontSize="9" fill="#64748b">Provider에 검증 위임</text>
    <text x="390" y="115" textAnchor="middle" fontSize="9" fill="#64748b">서명 검증 &</text>
    <text x="390" y="127" textAnchor="middle" fontSize="9" fill="#64748b">Claims 추출</text>
    <text x="560" y="115" textAnchor="middle" fontSize="9" fill="#64748b">userId, role 등</text>
    <text x="560" y="127" textAnchor="middle" fontSize="9" fill="#64748b">ThreadLocal에 저장</text>
    <text x="720" y="115" textAnchor="middle" fontSize="9" fill="#64748b">@PreAuthorize로</text>
    <text x="720" y="127" textAnchor="middle" fontSize="9" fill="#64748b">권한 확인 후 실행</text>

    <defs>
      <marker id="arr" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
        <path d="M0,0 L8,3 L0,6" fill="#64748b" />
      </marker>
    </defs>
  </svg>
);

/* ─────────────────────────────────────────────
   PAGE 1: Spring Security
   ───────────────────────────────────────────── */
const SecurityArchitecture = () => (
  <div className="p-6 space-y-8">
    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-3">Spring Security란?</h2>
      <div className="bg-slate-50 rounded-xl p-5 text-sm text-slate-700 leading-relaxed">
        <p>Spring 기반 애플리케이션의 <strong>인증(Authentication)</strong>과 <strong>인가(Authorization)</strong>를 처리하는 보안 프레임워크.</p>
        <p className="mt-2">서블릿 필터 체인을 기반으로 동작하며, 요청이 Controller에 도달하기 전에 보안 검증을 수행한다.</p>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-3">아키텍처 개요</h2>
      <div className="bg-slate-50 rounded-xl p-5">
        <p className="text-xs text-slate-500 mb-4">Spring의 요청 처리 과정에서 Security가 어디에 위치하는지</p>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { name: "HTTP\nRequest", bg: "bg-slate-200 border-slate-400" },
            { name: "Security\nFilterChain", bg: "bg-red-100 border-red-300", highlight: true },
            { name: "Dispatcher\nServlet", bg: "bg-blue-100 border-blue-300" },
            { name: "Handler\nMapping", bg: "bg-blue-50 border-blue-200" },
            { name: "Controller", bg: "bg-emerald-100 border-emerald-300" },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <div className={`${item.bg} border rounded-lg px-4 py-3 text-xs text-center min-w-fit whitespace-pre-line font-medium ${item.highlight ? "ring-2 ring-red-400" : ""}`}>
                {item.name}
              </div>
              {i < 4 && <span className="text-slate-400 font-bold flex-shrink-0">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">* 빨간 테두리: Spring Security가 적용되는 영역</p>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-3">Filter Chain 구조 (MMT 기준)</h2>
      <div className="bg-slate-50 rounded-xl p-5">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {[
            { name: "HTTP 요청", color: "bg-slate-200 border-slate-400" },
            { name: "JwtAuth\nFilter", color: "bg-blue-100 border-blue-300", highlight: true },
            { name: "Username\nPwFilter", color: "bg-purple-50 border-purple-200" },
            { name: "Exception\nFilter", color: "bg-purple-50 border-purple-200" },
            { name: "Authorization\nFilter", color: "bg-orange-100 border-orange-300", highlight: true },
            { name: "Controller", color: "bg-emerald-100 border-emerald-300" },
          ].map((item, i) => (
            <React.Fragment key={i}>
              <div className={`${item.color} border rounded-lg px-3 py-3 text-xs text-center min-w-fit whitespace-pre-line ${item.highlight ? "ring-2 ring-blue-400 font-medium" : ""}`}>
                {item.name}
              </div>
              {i < 5 && <span className="text-slate-400 font-bold flex-shrink-0">→</span>}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-slate-500 mt-3">* 파란 테두리: MMT에서 직접 구현/설정한 부분</p>
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-3">내부 동작 구조</h2>
      <div className="bg-white rounded-xl border border-slate-200 p-2">
        <SecurityInternalFlowSVG />
      </div>
    </section>

    <section>
      <h2 className="text-lg font-bold text-slate-800 mb-3">핵심 컴포넌트 (MMT 기준)</h2>
      <div className="space-y-2">
        {[
          { name: "SecurityFilterChain", desc: "URL별 접근 권한 설정 (permitAll, hasRole 등)", color: "border-purple-400" },
          { name: "JwtAuthenticationFilter", desc: "매 요청마다 토큰을 파싱하고 SecurityContext에 인증 정보 설정", color: "border-blue-400" },
          { name: "JwtTokenProvider", desc: "토큰 생성, 파싱, 검증 담당", color: "border-emerald-400" },
          { name: "UserDetailsService", desc: "DB에서 사용자 정보를 로드 (JPA 엔티티 → UserDetails 변환)", color: "border-amber-400" },
          { name: "AuthenticationManager", desc: "인증 처리를 AuthenticationProvider에 위임하는 중간 관리자", color: "border-orange-400" },
          { name: "SecurityContextHolder", desc: "현재 요청의 인증 정보를 스레드 로컬에 보관", color: "border-red-400" },
        ].map((item, i) => (
          <div key={i} className={`bg-slate-50 rounded-lg p-3 border-l-4 ${item.color} flex items-start gap-3`}>
            <span className="font-mono font-medium text-slate-800 min-w-fit text-xs">{item.name}</span>
            <span className="text-slate-600 text-xs">{item.desc}</span>
          </div>
        ))}
      </div>
    </section>
  </div>
);

/* ─────────────────────────────────────────────
   PAGE 2: 로그인 & 인증 흐름
   ───────────────────────────────────────────── */
const LoginFlow = () => {
  const mermaidCode = `sequenceDiagram
    participant C as Client
    participant F as JwtAuthenticationFilter
    participant AM as AuthenticationManager
    participant AP as AuthenticationProvider
    participant UDS as UserDetailsService
    participant JP as JwtTokenProvider
    participant DB as DB / Redis

    Note over C,DB: 1. 로그인 (토큰 발급)
    C->>F: POST /login (username, password)
    F->>AM: Authentication 객체 전달
    AM->>AP: 인증 위임
    AP->>UDS: loadUserByUsername()
    UDS->>DB: SELECT user WHERE username=?
    DB-->>UDS: User 엔티티
    UDS-->>AP: UserDetails 반환
    AP-->>AM: 비밀번호 검증 → 인증 성공
    AM-->>F: Authentication (인증 완료)
    F->>JP: 토큰 생성 요청
    JP-->>F: Access Token (30분) + Refresh Token (7일)
    F->>DB: Refresh Token 저장 (Redis/DB)
    F-->>C: 토큰 반환

    Note over C,DB: 2. API 요청 (토큰 검증)
    C->>F: GET /api/data (Authorization: Bearer AT)
    F->>JP: 토큰 파싱 & 서명 검증
    JP-->>F: Claims (userId, role)
    F->>F: SecurityContext에 인증 정보 설정
    F-->>C: Controller → 응답

    Note over C,DB: 3. 토큰 갱신 (Access Token 만료 시)
    C->>F: POST /refresh (Refresh Token)
    F->>DB: Refresh Token 존재 여부 확인
    DB-->>F: 유효함
    F->>JP: 새 Access Token 생성
    JP-->>F: 새 Access Token (30분)
    F-->>C: 새 Access Token 반환`;

  const archMermaid = `graph TD
    A[HTTP Request] --> B[AuthenticationFilter]
    B -->|Authentication 객체| C[AuthenticationManager]
    C -->|인증 위임| D[AuthenticationProvider]
    D -->|loadUserByUsername| E[UserDetailsService]
    E -->|DB 조회| F[(DB)]
    F -->|User 엔티티| E
    E -->|UserDetails| D
    D -->|검증 결과| C
    C -->|인증 성공| B
    B -->|인증 정보 저장| G[SecurityContextHolder]
    B -->|성공| H[다음 필터 → Controller]
    B -->|실패| I[401 Unauthorized]`;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-lg font-bold text-slate-800">로그인 & 인증 흐름</h2>
      <p className="text-sm text-slate-500">MMT 프로젝트의 JWT 인증 전체 흐름</p>

      <div className="bg-white rounded-xl border border-slate-200 p-2">
        <LoginSequenceSVG />
      </div>

      <h3 className="text-base font-bold text-slate-800 mt-6">API 요청 시 토큰 검증 흐름</h3>
      <div className="bg-white rounded-xl border border-slate-200 p-2">
        <ApiRequestSVG />
      </div>

      {/* Mermaid codes */}
      <details className="bg-slate-50 rounded-xl border border-slate-200">
        <summary className="px-5 py-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 rounded-xl">
          Mermaid 코드 보기 - 내부 동작 구조 (복사용)
        </summary>
        <pre className="px-5 pb-5 text-xs font-mono text-slate-600 overflow-x-auto whitespace-pre leading-relaxed">{archMermaid}</pre>
      </details>

      <details className="bg-slate-50 rounded-xl border border-slate-200">
        <summary className="px-5 py-3 text-sm font-medium text-slate-700 cursor-pointer hover:bg-slate-100 rounded-xl">
          Mermaid 코드 보기 - 시퀀스 다이어그램 (복사용)
        </summary>
        <pre className="px-5 pb-5 text-xs font-mono text-slate-600 overflow-x-auto whitespace-pre leading-relaxed">{mermaidCode}</pre>
      </details>
    </div>
  );
};

/* ─────────────────────────────────────────────
   PAGE 3: 개념 정리
   ───────────────────────────────────────────── */
const ConceptSummary = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-lg font-bold text-slate-800 mb-4">개념 정리</h2>

    <section>
      <h3 className="font-bold text-slate-700 mb-3">인증 vs 인가</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
          <p className="font-bold text-blue-700 mb-1">인증 (Authentication) = "너 누구야?"</p>
          <p className="text-slate-600">사용자가 누구인지 확인하는 과정</p>
          <p className="text-slate-500 text-xs mt-2">예: 로그인 (ID/PW → JWT 발급)</p>
        </div>
        <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
          <p className="font-bold text-orange-700 mb-1">인가 (Authorization) = "너 이거 해도 돼?"</p>
          <p className="text-slate-600">인증된 사용자가 특정 리소스에 접근할 권한이 있는지 확인</p>
          <p className="text-slate-500 text-xs mt-2">예: 학생은 관리자 API 접근 불가</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="font-bold text-slate-700 mb-3">JWT (JSON Web Token) 구조</h3>
      <div className="bg-white rounded-lg p-4 border border-slate-200">
        <div className="flex flex-wrap items-center gap-1 mb-4">
          <span className="bg-red-100 text-red-700 px-3 py-1.5 rounded font-mono text-sm">Header</span>
          <span className="text-slate-400 font-bold text-lg">.</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded font-mono text-sm">Payload</span>
          <span className="text-slate-400 font-bold text-lg">.</span>
          <span className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded font-mono text-sm">Signature</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex gap-3"><span className="text-red-600 font-medium w-24">Header</span><span className="text-slate-600">알고리즘, 토큰 타입 (HS256, JWT)</span></div>
          <div className="flex gap-3"><span className="text-purple-600 font-medium w-24">Payload</span><span className="text-slate-600">사용자 정보, 권한, 만료시간 (Claims)</span></div>
          <div className="flex gap-3"><span className="text-blue-600 font-medium w-24">Signature</span><span className="text-slate-600">Header + Payload를 비밀키로 서명 → 위변조 방지</span></div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="font-bold text-slate-700 mb-3">Access Token vs Refresh Token</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h4 className="font-bold text-blue-800 mb-3">Access Token</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">목적</span><span className="font-medium">API 인증</span></div>
            <div className="flex justify-between"><span className="text-slate-600">만료</span><span className="font-medium">30분</span></div>
            <div className="flex justify-between"><span className="text-slate-600">저장 위치</span><span className="font-medium">클라이언트만</span></div>
            <div className="flex justify-between"><span className="text-slate-600">서버 저장</span><span className="font-medium text-slate-400">없음 (Stateless)</span></div>
            <div className="flex justify-between"><span className="text-slate-600">탈취 시</span><span className="font-medium text-amber-600">30분 후 자동 만료</span></div>
          </div>
        </div>
        <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
          <h4 className="font-bold text-amber-800 mb-3">Refresh Token</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-slate-600">목적</span><span className="font-medium">Access Token 재발급</span></div>
            <div className="flex justify-between"><span className="text-slate-600">만료</span><span className="font-medium">7일</span></div>
            <div className="flex justify-between"><span className="text-slate-600">저장 위치</span><span className="font-medium">클라이언트 + 서버</span></div>
            <div className="flex justify-between"><span className="text-slate-600">서버 저장</span><span className="font-medium text-emerald-600">Redis / DB</span></div>
            <div className="flex justify-between"><span className="text-slate-600">탈취 시</span><span className="font-medium text-emerald-600">서버에서 즉시 무효화 가능</span></div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h3 className="font-bold text-slate-700 mb-3">왜 토큰을 2개로 나누는가?</h3>
      <div className="bg-slate-50 rounded-xl p-5 text-sm space-y-3">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="font-medium text-slate-700 mb-2">핵심 딜레마:</p>
          <p className="text-slate-600">• 만료를 길게 → 편하지만 탈취 시 오래 악용됨</p>
          <p className="text-slate-600">• 만료를 짧게 → 안전하지만 자주 로그인해야 함</p>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="font-medium text-slate-700 mb-2">해결:</p>
          <p className="text-slate-600">• Access Token 짧게 (30분) → 탈취돼도 금방 만료</p>
          <p className="text-slate-600">• Refresh Token 길게 (7일) → 자주 로그인 안 해도 됨</p>
          <p className="text-slate-600">• Refresh Token 서버 저장 → 탈취 시 즉시 무효화</p>
        </div>
      </div>
    </section>

    <section>
      <h3 className="font-bold text-slate-700 mb-3">왜 JWT인가? (Session vs JWT)</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="font-bold text-slate-700 mb-2">Session (Stateful)</p>
          <div className="space-y-1 text-slate-600 text-xs">
            <p>• 서버가 세션 저장소에 상태 유지</p>
            <p>• 서버 확장 시 세션 공유 문제</p>
            <p>• 서버 메모리 사용</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <p className="font-bold text-slate-700 mb-2">JWT (Stateless)</p>
          <div className="space-y-1 text-slate-600 text-xs">
            <p>• 서버가 상태 저장 안 함</p>
            <p>• 토큰 자체에 정보 → 서버 확장 용이</p>
            <p>• 단, 즉시 무효화 어려움 → Refresh Token 보완</p>
          </div>
        </div>
      </div>
      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200 mt-3">
        <p className="text-sm text-slate-700"><strong>MMT:</strong> Spring Boot API + Vue 3 SPA 구조라 Stateless 적합</p>
      </div>
    </section>

    <section>
      <h3 className="font-bold text-slate-700 mb-3">인가 방식</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h4 className="font-bold text-sm text-slate-700 mb-2">URL 패턴 기반</h4>
          <div className="font-mono text-xs bg-slate-100 rounded p-3 space-y-1">
            <div>/api/admin/** → <span className="text-red-600">ROLE_ADMIN</span></div>
            <div>/api/student/** → <span className="text-blue-600">ROLE_STUDENT</span></div>
            <div>/api/auth/** → <span className="text-emerald-600">permitAll</span></div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-slate-200">
          <h4 className="font-bold text-sm text-slate-700 mb-2">메서드 기반</h4>
          <div className="font-mono text-xs bg-slate-100 rounded p-3 space-y-1">
            <div>@PreAuthorize("hasRole('ADMIN')")</div>
            <div>public void deleteUser() {"{...}"}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
);

/* ─────────────────────────────────────────────
   PAGE 4: 면접 멘트
   ───────────────────────────────────────────── */
const InterviewScript = () => (
  <div className="p-6 space-y-6">
    <h2 className="text-lg font-bold text-slate-800 mb-4">면접 멘트</h2>

    <div className="bg-slate-50 rounded-xl p-5">
      <h3 className="font-bold text-slate-700 mb-1">Q. Spring Security로 인증/인가를 어떻게 구현했는지?</h3>
      <h3 className="font-bold text-slate-700 mb-4">JWT 토큰의 만료/갱신 전략은?</h3>
      <div className="bg-white rounded-lg p-5 text-sm leading-relaxed space-y-3 border border-slate-200">
        <p className="text-slate-800">Spring Security 6 + JWT 기반으로 Stateless 인증을 구현했습니다.</p>
        <p className="text-slate-700">로그인 시 username/password를 검증하고 Access Token 30분, Refresh Token 7일로 발급합니다. Access Token은 짧게 설정해서 탈취 시 피해를 최소화하고, Refresh Token은 서버에 저장해서 필요 시 즉시 무효화할 수 있도록 했습니다.</p>
        <p className="text-slate-700">매 API 요청 시에는 JwtAuthenticationFilter에서 토큰을 파싱하고 SecurityContext에 인증 정보를 설정합니다. 인가는 SecurityFilterChain에서 URL 패턴별로 접근 권한을 설정하고, 학생/관리자 역할에 따라 접근 가능한 API를 분리했습니다.</p>
        <p className="text-slate-700">Access Token이 만료되면 클라이언트가 Refresh Token으로 재발급을 요청하고, 서버에서 유효성을 확인한 뒤 새 Access Token을 발급합니다.</p>
        <p className="text-slate-600 italic">돌아보면 Refresh Token을 Redis에 저장했으면 TTL로 자동 만료도 가능하고 조회 속도도 빨라서 더 나았을 것 같습니다.</p>
      </div>
    </div>

    <div className="bg-amber-50 rounded-xl p-5">
      <h3 className="font-bold text-amber-800 mb-4">예상 꼬리질문</h3>
      <div className="space-y-4">
        {[
          { q: "Q. Refresh Token이 탈취되면?", a: "서버에 저장되어 있으므로 해당 토큰을 삭제하면 즉시 무효화됩니다. 추가로 Refresh Token Rotation을 적용하면, 재발급 시 이전 토큰도 폐기하여 탈취 감지가 가능합니다." },
          { q: "Q. JWT의 단점은?", a: "발급된 Access Token을 서버에서 즉시 무효화할 수 없습니다. 만료 시간을 짧게 설정하는 것으로 보완하고, 즉시 차단이 필요하면 블랙리스트를 Redis에 관리하는 방법이 있습니다." },
          { q: "Q. Session 대신 JWT를 선택한 이유는?", a: "MMT는 Spring Boot API + Vue 3 구조라 Stateless 방식이 적합했습니다. 서버 확장 시에도 세션 공유 문제 없이 토큰만으로 인증이 가능합니다." },
          { q: "Q. SecurityContext / 스레드 로컬이 뭔가요?", a: "SecurityContext는 현재 인증된 사용자 정보를 담는 객체이고, ThreadLocal에 저장됩니다. 각 스레드가 독립적으로 값을 가져서 동시 요청이 와도 인증 정보가 섞이지 않습니다." },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-lg p-4 border border-amber-200">
            <p className="font-medium text-slate-700 text-sm mb-2">{item.q}</p>
            <p className="text-sm text-slate-600">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────
   MAIN
   ───────────────────────────────────────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState("architecture");
  const tabs = [
    { id: "architecture", label: "1. Spring Security" },
    { id: "login", label: "2. 로그인 흐름" },
    { id: "concepts", label: "3. 개념 정리" },
    { id: "interview", label: "4. 면접 멘트" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-1">
          <h1 className="text-xl font-bold text-slate-800">Spring Security + JWT 인증/인가</h1>
          <p className="text-sm text-slate-500">MMT 프로젝트 기준 정리</p>
        </div>
        <div className="flex gap-1 mb-0 overflow-x-auto">
          {tabs.map((tab) => (
            <Tab key={tab.id} label={tab.label} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
          ))}
        </div>
        <div className="bg-white rounded-b-xl rounded-tr-xl shadow-sm border border-slate-200 overflow-auto">
          {activeTab === "architecture" && <SecurityArchitecture />}
          {activeTab === "login" && <LoginFlow />}
          {activeTab === "concepts" && <ConceptSummary />}
          {activeTab === "interview" && <InterviewScript />}
        </div>
      </div>
    </div>
  );
}
