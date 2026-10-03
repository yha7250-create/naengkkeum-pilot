import { useMemo, useState } from "react"
import MascotBadge from "../../components/MascotBadge"
import type { FoodActivity, FoodItem, FridgeMetric } from "../../model"

interface Props {
  onNext: (screen: string) => void
  activities: FoodActivity[]
  foods: FoodItem[]
  fridges: FridgeMetric[]
}

type Period = 7 | 30 | "all"

export default function AdminStatsScreen({ onNext, activities, foods, fridges }: Props) {
  const [period, setPeriod] = useState<Period>(30)
  const filtered = useMemo(() => activities.filter(activity => period === "all" || Date.now() - new Date(activity.at).getTime() <= period * 86400000), [activities, period])
  const registered = filtered.filter(item => item.type === "registered").length
  const consumed = filtered.filter(item => item.type === "consumed")
  const discarded = filtered.filter(item => item.type === "discarded")
  const savedKg = consumed.reduce((sum, item) => sum + item.units * .22, 0)
  const carbon = savedKg * 2.5
  const processed = consumed.length + discarded.length
  const discardRate = processed ? Math.round(discarded.length / processed * 100) : 0
  const totalUsed = fridges.reduce((sum, fridge) => sum + fridge.used, 0)
  const totalCapacity = fridges.reduce((sum, fridge) => sum + fridge.capacity, 0)
  const usage = totalCapacity ? Math.round(totalUsed / totalCapacity * 100) : 0

  return <div className="dm-screen admin-stats-screen">
    <header className="admin-stats-header"><span>RA ADMIN</span><h2>운영 통계</h2><div>{([7, 30, "all"] as Period[]).map(item => <button key={item} className={period === item ? "active" : ""} onClick={() => setPeriod(item)}>{item === "all" ? "전체" : `최근 ${item}일`}</button>)}</div></header>
    <main className="stats-content">
      <section className="stats-hero"><div><span>{period === "all" ? "전체 기간" : `최근 ${period}일`} 음식물 쓰레기 감소량</span><strong>{savedKg.toFixed(1)}<small>kg</small></strong><p>먹은 것으로 처리한 공간점수를 환산한 추정치예요. 온실가스 {carbon.toFixed(1)}kg CO₂e 절감에 해당합니다.</p></div><MascotBadge variant="carbon" size="small" /></section>
      <section className="stats-grid"><div><span>음식 등록 수</span><strong>{registered}<small>건</small></strong></div><div><span>소비 완료 수</span><strong className="green">{consumed.length}<small>건</small></strong></div><div><span>폐기 수</span><strong className="red">{discarded.length}<small>건</small></strong></div><div><span>현재 보관 음식</span><strong className="blue">{foods.length}<small>개</small></strong></div></section>
      <section className="ratio-card"><h3>처리 비율</h3><div className="ratio-row"><strong>폐기율</strong><b>{processed ? `${discardRate}%` : "기록 없음"}</b></div><div className="ratio-track"><i style={{ width: `${discardRate}%` }} /></div><p>{processed ? `기간 내 처리 ${processed}건 중 폐기 ${discarded.length}건` : "기간 내 처리 기록이 없어요."}</p><div className="ratio-row usage"><strong>관리 냉장고 이용률</strong><b>{usage}%</b></div><div className="ratio-track usage"><i style={{ width: `${usage}%` }} /></div><p>{totalUsed}/{totalCapacity} 공간점수 사용 중</p></section>
    </main>
    <nav className="admin-bottom-nav five"><button onClick={() => onNext("adminDashboard")}><span>⌂</span>대시보드</button><button onClick={() => onNext("adminFridge")}><span>▦</span>현황</button><button onClick={() => onNext("adminOperations")}><span>!</span>운영</button><button className="active"><span>↗</span>통계</button><button onClick={() => onNext("adminMenu")}><span>☰</span>메뉴</button></nav>
  </div>
}
