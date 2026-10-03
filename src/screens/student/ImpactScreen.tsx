import type { FoodItem, ImpactStats } from "../../model"
import MascotBadge, { type MascotBadgeVariant } from "../../components/MascotBadge"

interface Props {
  onBack: () => void
  foods: FoodItem[]
  impact: ImpactStats
}

const badgeRules: { name: string; variant: MascotBadgeVariant; threshold: number; text: string }[] = [
  { name: "첫 정리 새싹", variant: "sprout", threshold: 1, text: "음식 1개 처리" },
  { name: "냉장고 지킴이", variant: "guardian", threshold: 100, text: "100포인트 달성" },
  { name: "탄소 절감 요리사", variant: "carbon", threshold: 200, text: "200포인트 달성" },
  { name: "공동체 대장", variant: "leader", threshold: 350, text: "350포인트 달성" },
]

export default function ImpactScreen({ onBack, foods, impact }: Props) {
  const next = badgeRules.find(item => impact.points < item.threshold)
  const nextPercent = next ? Math.min(100, Math.round(impact.points / next.threshold * 100)) : 100

  return (
    <div className="dm-screen impact-screen">
      <header className="dm-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>나의 실천 기록</p><h2>절감 리포트</h2></div><span className="dm-step">{impact.points}P</span></header>
      <main className="dm-stack">
        <section className="impact-hero"><span>이번 학기 나의 절감 효과</span><h3>작은 정리가 만든 변화</h3><div className="impact-metrics"><div><b>{impact.foodSavedKg.toFixed(1)}</b><small>kg</small><span>음식물 쓰레기 절감</span></div><div><b>{impact.carbonSavedKg.toFixed(1)}</b><small>kgCO₂e</small><span>탄소 배출 절감</span></div><div><b>{impact.moneySaved.toLocaleString()}</b><small>원</small><span>예상 비용 절약</span></div></div></section>
        <section className="report-explanation"><strong>어떻게 계산했나요?</strong><p>‘먹었어요’로 처리한 음식의 보관 크기를 중량으로 환산하고, 음식물 폐기 평균 탄소계수 2.5kgCO₂e/kg를 적용한 시뮬레이션 값입니다. 실제 측정값은 아닙니다.</p></section>
        <section className="point-card"><div><span className="dm-eyebrow">POINT</span><h3>{impact.points} 포인트</h3><p>등록 +5P · 소비 완료 +15P · 폐기 기록 +2P</p></div><div className="point-orbit">P</div></section>
        {next && <section className="next-badge"><div className="dm-row between"><div><span>다음 배지</span><strong>{next.name}</strong></div><b>{impact.points}/{next.threshold}P</b></div><div className="dm-progress"><span style={{ width: `${nextPercent}%` }} /></div></section>}
        <section><div className="dm-section-title"><div><span className="dm-eyebrow">BADGES</span><h3>획득 배지</h3></div><span className="dm-badge green">{badgeRules.filter(item => impact.points >= item.threshold).length}/{badgeRules.length}</span></div><div className="badge-grid mascot-badge-grid">{badgeRules.map(item => { const unlocked = impact.points >= item.threshold; return <article className={unlocked ? "badge-card unlocked" : "badge-card"} key={item.name}><MascotBadge variant={item.variant} locked={!unlocked} /><strong>{item.name}</strong><small>{unlocked ? "획득 완료" : item.text}</small></article> })}</div></section>
        <section className="activity-card"><div><strong>완료한 정리 행동</strong><b>{impact.completedActions}회</b></div><div><strong>현재 보관 음식</strong><b>{foods.length}개</b></div></section>
      </main>
    </div>
  )
}
