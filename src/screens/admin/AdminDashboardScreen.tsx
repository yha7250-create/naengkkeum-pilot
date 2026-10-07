import EagleMascot from "../../components/EagleMascot"
import { foodTargetDate, type ChatRoom, type CommunityGoal, type FoodItem, type FridgeMetric, type IncidentReport, type ResidenceProfile, type StoragePolicy } from "../../model"

interface Props {
  onNext: (screen: string) => void
  foods: FoodItem[]
  fridges: FridgeMetric[]
  reports: IncidentReport[]
  rooms: ChatRoom[]
  residence: ResidenceProfile
  adminName: string
  storagePolicy: StoragePolicy
  activeFridge: FridgeMetric
  communityGoal: CommunityGoal
  onUpdateGoal: (fridgeId: string, target: number) => void
}

function daysUntil(food: FoodItem) {
  const target = foodTargetDate(food)
  return Math.ceil((target.getTime() - Date.now()) / 86400000)
}

export default function AdminDashboardScreen({ onNext, foods, fridges, reports, rooms, residence, adminName, storagePolicy, activeFridge, communityGoal, onUpdateGoal }: Props) {
  const longStay = foods.filter(food => Date.now() - new Date(food.registeredAt).getTime() >= 7 * 86400000 && daysUntil(food) > 0).length
  const cleanToday = foods.filter(food => daysUntil(food) <= 0).length
  const dueThisWeek = foods.filter(food => daysUntil(food) > 0 && daysUntil(food) <= 7).length
  const usage = activeFridge.capacity ? Math.round(activeFridge.used / activeFridge.capacity * 100) : 0
  const unpaid = rooms.reduce((sum, room) => sum + (room.payments?.filter(payment => !payment.paid).length ?? 0), 0)
  const openReports = reports.filter(report => report.status !== "처리 완료").length

  const alerts = [
    { icon: "📦", title: "현재 장기 방치 음식", sub: "보관 7일 이상, 확인기한은 남음", count: longStay, tone: "yellow", screen: "adminFridge" },
    { icon: "🔴", title: "오늘 정리 필요 음식", sub: "기한 초과 또는 오늘 확인", count: cleanToday, tone: "red", screen: "adminOperations" },
    { icon: "⚠️", title: "이번 주 확인 예정", sub: "7일 이내 확인기한 도달", count: dueThisWeek, tone: "orange", screen: "adminFridge" },
  ]

  return (
    <div className="dm-screen admin-dashboard-screen">
      <header className="admin-dashboard-header"><span>RA ADMIN</span><div className="dm-row between"><div><h2>관리 대시보드</h2><p>{adminName} · {residence.building} {residence.floor}층 관리 중</p></div><div className="dashboard-mascot"><EagleMascot size={60} /></div></div></header>
      <main className="admin-dashboard-content">
        <section className="admin-today-head"><div><span className="dm-eyebrow">TODAY</span><h3>무엇을 관리할까요?</h3><p>자주 쓰는 기능을 먼저 배치했어요.</p></div><b>{openReports + cleanToday}</b></section>
        <button className="admin-current-fridge" onClick={() => onNext("adminFridgeSelect")}>
          <span className="cute-fridge-icon">❄</span>
          <div><small>지금 확인 중 · {activeFridge.dorm ?? residence.dorm}</small><strong>{activeFridge.label}</strong><p>{activeFridge.building} {activeFridge.floor} · 점유 {usage}% · 신고 {activeFridge.reports}건</p></div>
          <b>변경 ›</b>
        </button>
        <section className="admin-quick-actions"><button onClick={() => onNext("adminFridge")}><span>▦</span><strong>냉장고 현황</strong><small>칸별 음식 확인</small></button><button onClick={() => onNext("adminOperations")}><span>📣</span><strong>공지·신고</strong><small>학생에게 발송</small></button><button onClick={() => onNext("adminFridgeConfig")}><span>⚙</span><strong>이름·구조</strong><small>냉장고 수정</small></button></section>
        <section className="dashboard-alerts">{alerts.map(alert => <button className={`dashboard-alert ${alert.tone}`} key={alert.title} onClick={() => onNext(alert.screen)}><span>{alert.icon}</span><div><strong>{alert.title}</strong><small>{alert.sub}</small></div><b>{alert.count}<i>개</i></b></button>)}</section>
        <section className="dashboard-kpi-grid"><div><span>전체 음식</span><strong>{foods.length}<small>개</small></strong></div><div><span>현재 이용률</span><strong className="green">{usage}<small>%</small></strong><p>{activeFridge.used}/{activeFridge.capacity}칸 사용</p></div><div><span>관리 냉장고</span><strong>{fridges.length}<small>개</small></strong></div><div><span>미처리 신고</span><strong className={openReports ? "red" : ""}>{openReports}<small>건</small></strong></div></section>
        <section className="admin-weekly-goal">
          <div className="goal-mascot"><EagleMascot size={52} /></div>
          <div className="grow"><small>{communityGoal.weekLabel} 공동 목표</small><strong>방치 음식 {communityGoal.target}개 함께 정리하기</strong><div className="goal-progress"><i style={{ width: `${Math.min(100, communityGoal.completed / communityGoal.target * 100)}%` }} /></div><p>{communityGoal.completed}개 완료 · {Math.max(0, communityGoal.target - communityGoal.completed)}개 남음</p></div>
          <div className="goal-stepper"><button onClick={() => onUpdateGoal(activeFridge.id, communityGoal.target - 1)}>−</button><b>{communityGoal.target}</b><button onClick={() => onUpdateGoal(activeFridge.id, communityGoal.target + 1)}>＋</button></div>
        </section>
        <button className="dashboard-wide-card" onClick={() => onNext("adminOperations")}><span>🚨</span><div><strong>공동구매 미입금·신고</strong><small>미입금 {unpaid}건 · 미처리 신고 {openReports}건</small></div><b>›</b></button>
        <button className="dashboard-policy-card" onClick={() => onNext("adminStoragePolicy")}><div><span>공간 독점 방지 정책</span><strong>1인 총 {storagePolicy.totalUnits}칸 · 냉장 {storagePolicy.fridgeUnits} · 냉동 {storagePolicy.freezerUnits}</strong><small>같은 선반 최대 {storagePolicy.perSlotUnits}칸</small></div><b>설정 ›</b></button>
      </main>
      <nav className="admin-bottom-nav five"><button className="active"><span>⌂</span>대시보드</button><button onClick={() => onNext("adminFridge")}><span>▦</span>현황</button><button onClick={() => onNext("adminOperations")}><span>!</span>운영</button><button onClick={() => onNext("adminStats")}><span>↗</span>통계</button><button onClick={() => onNext("adminMenu")}><span>☰</span>메뉴</button></nav>
    </div>
  )
}
