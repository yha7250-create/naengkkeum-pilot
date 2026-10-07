import { useState } from "react"
import EagleMascot from "../../components/EagleMascot"

interface Props {
  onBack: () => void
  onNext: (screen: string) => void
}

export default function AdminMenuScreen({ onBack, onNext }: Props) {
  const [expiryAlert, setExpiryAlert] = useState(true)
  const [chatAlert, setChatAlert] = useState(true)
  const [countAlert, setCountAlert] = useState(false)

  const alerts = [
    { label: "소비기한 초과", sub: "기한이 지난 음식 발생 시", value: expiryAlert, set: setExpiryAlert },
    { label: "공간 과다 사용", sub: "냉장고 점유율이 85%를 넘을 때", value: countAlert, set: setCountAlert },
    { label: "학생·신고 채팅", sub: "새 메시지와 위생 제보 수신", value: chatAlert, set: setChatAlert },
  ]

  const menuItems = [
    { icon: "⌂", label: "관리 대시보드", sub: "오늘 확인할 음식과 운영 지표", screen: "adminDashboard", featured: true },
    { icon: "❄", label: "관리 냉장고 선택", sub: "여러 냉장고 중 확인할 곳을 변경", screen: "adminFridgeSelect", featured: true },
    { icon: "▦", label: "냉장고 구조 등록", sub: "선반·냉동실·서랍·도어를 RA가 설정", screen: "adminFridgeConfig", featured: true },
    { icon: "↗", label: "운영 통계", sub: "등록·소비·폐기와 이용률 확인", screen: "adminStats" },
    { icon: "📦", label: "개인 보관 한도", sub: "총량·냉장·냉동·선반별 제한 설정", screen: "adminStoragePolicy" },
    { icon: "!", label: "정리 운영센터", sub: "신고와 정리 우선순위 확인", screen: "adminOperations" },
    { icon: "＋", label: "RA 코드 발행", sub: "승인된 다른 RA의 로그인 코드", screen: "adminCodeIssue" },
    { icon: "💬", label: "커뮤니티 관리", sub: "학생 대화방과 공지 확인", screen: "adminOperations" },
  ]

  return <div className="dm-screen ra-menu-screen">
    <header className="ra-menu-header"><div className="dm-row between"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div className="ra-logo-sticker"><EagleMascot size={48} /></div></div><span>RA CONTROL ROOM</span><h2>관리자 메뉴</h2><p>냉장고 구조와 위생 상태를 RA가 관리해요.</p></header>
    <main className="dm-stack">
      <section><div className="dm-section-title"><div><span className="dm-eyebrow">RA TOOLS</span><h3>관리 도구</h3></div><span className="dm-badge green">RA 전용</span></div><div className="ra-tool-grid">{menuItems.map(item => <button key={item.label} className={item.featured ? "featured" : ""} onClick={() => onNext(item.screen)}><span>{item.icon}</span><strong>{item.label}</strong><small>{item.sub}</small><b>→</b></button>)}</div></section>
      <section><span className="dm-eyebrow">ALERTS</span><div className="notification-list ra-alerts">{alerts.map(item => <label key={item.label}><div><strong>{item.label}</strong><small>{item.sub}</small></div><button type="button" role="switch" aria-checked={item.value} className={`toggle-switch ${item.value ? "on" : ""}`} onClick={() => item.set(!item.value)}><i /></button></label>)}</div></section>
      <p className="menu-version">냉큼 RA · 연세대학교 시범 운영</p>
    </main>
  </div>
}
