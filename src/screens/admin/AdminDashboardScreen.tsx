import { useEffect, useState } from "react"
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
  onUpdateGoal: (fridgeId: string, title: string, target: number, resetCompleted?: boolean) => boolean
}

function daysUntil(food: FoodItem) {
  const target = foodTargetDate(food)
  return Math.ceil((target.getTime() - Date.now()) / 86400000)
}

export default function AdminDashboardScreen({ onNext, foods, fridges, reports, rooms, residence, adminName, storagePolicy, activeFridge, communityGoal, onUpdateGoal }: Props) {
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalTitle, setGoalTitle] = useState(communityGoal.title ?? "방치 음식 함께 정리하기")
  const [goalTarget, setGoalTarget] = useState(communityGoal.target)
  const [resetGoalProgress, setResetGoalProgress] = useState(false)
  const [goalSaved, setGoalSaved] = useState(false)

  useEffect(() => {
    setGoalTitle(communityGoal.title ?? "방치 음식 함께 정리하기")
    setGoalTarget(communityGoal.target)
    setResetGoalProgress(false)
    setEditingGoal(false)
  }, [activeFridge.id, communityGoal.title, communityGoal.target])

  function saveGoal() {
    if (!onUpdateGoal(activeFridge.id, goalTitle, goalTarget, resetGoalProgress)) return
    setGoalSaved(true)
    setEditingGoal(false)
    setResetGoalProgress(false)
    window.setTimeout(() => setGoalSaved(false), 1800)
  }
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
      <header className="admin-dashboard-header"><span>ADMIN</span><div className="dm-row between"><div><h2>관리 대시보드</h2><p>{adminName} · {residence.building} {residence.floor}층 관리 중</p></div><div className="dashboard-mascot"><EagleMascot size={60} /></div></div></header>
      <main className="admin-dashboard-content">
        <section className="admin-today-head"><div><span className="dm-eyebrow">TODAY</span><h3>무엇을 관리할까요?</h3><p>자주 쓰는 기능을 먼저 배치했어요.</p></div><b>{openReports + cleanToday}</b></section>
        <button className="admin-current-fridge" onClick={() => onNext("adminFridgeSelect")}>
          <span className="cute-fridge-icon">❄</span>
          <div><small>지금 확인 중 · {activeFridge.dorm ?? residence.dorm}</small><strong>{activeFridge.label}</strong><p>{activeFridge.building} {activeFridge.floor} · 점유 {usage}% · 신고 {activeFridge.reports}건</p></div>
          <b>변경 ›</b>
        </button>
        <section className="admin-quick-actions"><button onClick={() => onNext("adminFridge")}><span>▦</span><strong>냉장고 현황</strong><small>칸별 음식 확인</small></button><button onClick={() => onNext("adminOperations")}><span>📣</span><strong>공지·신고</strong><small>사용자에게 발송</small></button><button onClick={() => onNext("adminFridgeConfig")}><span>⚙</span><strong>이름·구조</strong><small>냉장고 수정</small></button></section>
        <section className="dashboard-alerts">{alerts.map(alert => <button className={`dashboard-alert ${alert.tone}`} key={alert.title} onClick={() => onNext(alert.screen)}><span>{alert.icon}</span><div><strong>{alert.title}</strong><small>{alert.sub}</small></div><b>{alert.count}<i>개</i></b></button>)}</section>
        <section className="dashboard-kpi-grid"><div><span>전체 음식</span><strong>{foods.length}<small>개</small></strong></div><div><span>현재 이용률</span><strong className="green">{usage}<small>%</small></strong><p>{activeFridge.used}/{activeFridge.capacity}칸 사용</p></div><div><span>관리 냉장고</span><strong>{fridges.length}<small>개</small></strong></div><div><span>미처리 신고</span><strong className={openReports ? "red" : ""}>{openReports}<small>건</small></strong></div></section>
        <section className="admin-weekly-goal">
          <div className="goal-mascot"><EagleMascot size={52} /></div>
          <div className="grow"><small>{communityGoal.weekLabel} 공동 목표</small><strong>{communityGoal.title ?? "방치 음식 함께 정리하기"} · {communityGoal.target}개</strong><div className="goal-progress"><i style={{ width: `${Math.min(100, communityGoal.completed / Math.max(1, communityGoal.target) * 100)}%` }} /></div><p>{communityGoal.completed}개 완료 · {Math.max(0, communityGoal.target - communityGoal.completed)}개 남음</p></div>
          <button className="goal-edit-button" onClick={() => setEditingGoal(current => !current)}>{editingGoal ? "닫기" : "수정"}</button>
        </section>
        {editingGoal && <section className="goal-editor-card">
          <div><span className="dm-eyebrow">WEEKLY GOAL</span><h3>이번 주 공동 목표 수정</h3><p>{activeFridge.label}을 사용하는 사용자 화면에 바로 반영됩니다.</p></div>
          <label><span>목표 문구</span><input className="dm-input" value={goalTitle} onChange={event => setGoalTitle(event.target.value)} maxLength={32} placeholder="예: 기한 임박 음식 확인하기" /></label>
          <label><span>목표 수량</span><div className="goal-target-input"><button onClick={() => setGoalTarget(value => Math.max(1, value - 1))}>−</button><input type="number" min="1" max="50" value={goalTarget} onChange={event => setGoalTarget(Math.max(1, Math.min(50, Number(event.target.value) || 1)))} /><button onClick={() => setGoalTarget(value => Math.min(50, value + 1))}>＋</button><b>개</b></div></label>
          <label className="goal-reset-check"><input type="checkbox" checked={resetGoalProgress} onChange={event => setResetGoalProgress(event.target.checked)} /><span><strong>새 주로 시작하기</strong><small>현재 완료 수 {communityGoal.completed}개를 0개로 초기화합니다.</small></span></label>
          <div className="goal-editor-actions"><button onClick={() => setEditingGoal(false)}>취소</button><button onClick={saveGoal} disabled={!goalTitle.trim()}>목표 저장</button></div>
        </section>}
        {goalSaved && <p className="dm-success goal-save-message">공동 목표가 사용자 화면에 반영됐습니다.</p>}
        <button className="dashboard-wide-card" onClick={() => onNext("adminOperations")}><span>🚨</span><div><strong>공동구매 미입금·신고</strong><small>미입금 {unpaid}건 · 미처리 신고 {openReports}건</small></div><b>›</b></button>
        <button className="dashboard-policy-card" onClick={() => onNext("adminStoragePolicy")}><div><span>공간 독점 방지 정책</span><strong>1인 총 {storagePolicy.totalUnits}칸 · 냉장 {storagePolicy.fridgeUnits} · 냉동 {storagePolicy.freezerUnits}</strong><small>같은 선반 최대 {storagePolicy.perSlotUnits}칸</small></div><b>설정 ›</b></button>
      </main>
      <nav className="admin-bottom-nav five"><button className="active"><span>⌂</span>대시보드</button><button onClick={() => onNext("adminFridge")}><span>▦</span>현황</button><button onClick={() => onNext("adminOperations")}><span>!</span>운영</button><button onClick={() => onNext("adminStats")}><span>↗</span>통계</button><button onClick={() => onNext("adminMenu")}><span>☰</span>메뉴</button></nav>
    </div>
  )
}
