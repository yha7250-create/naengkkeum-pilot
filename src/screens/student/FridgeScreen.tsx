import { useMemo, useState } from "react"
import DynamicFridge, { getFridgeSlots, type FridgeZone } from "../../components/DynamicFridge"
import FoodIcon from "../../components/FoodIcon"
import { foodTargetDate, type CommunityGoal, type FoodItem, type FridgeAnnouncement, type FridgeLayout, type ImpactStats, type ResidenceProfile, type UserProfile } from "../../model"

interface Props {
  onNext: (screen: string) => void
  foods: FoodItem[]
  layout: FridgeLayout
  residence: ResidenceProfile
  profile: UserProfile
  impact: ImpactStats
  personalLimit: number
  onComplete: (id: string, outcome: "consumed" | "discarded") => void
  announcements: FridgeAnnouncement[]
  fridgeId: string
  communityGoal: CommunityGoal
}

type FoodState = { level: "expired" | "urgent" | "warn" | "safe"; label: string; order: number }

function foodState(food: FoodItem): FoodState {
  const target = foodTargetDate(food)
  const diff = Math.ceil((target.getTime() - Date.now()) / 86400000)
  if (diff < 0) return { level: "expired", label: `${Math.abs(diff)}일 지남`, order: diff }
  if (diff === 0) return { level: "urgent", label: "오늘 확인", order: 0 }
  if (diff <= 2) return { level: "urgent", label: `D-${diff}`, order: diff }
  if (diff <= 7) return { level: "warn", label: `D-${diff}`, order: diff }
  return { level: "safe", label: `D-${diff}`, order: diff }
}

export default function FridgeScreen({ onNext, foods, layout, residence, profile, impact, personalLimit, onComplete, announcements, fridgeId, communityGoal }: Props) {
  const [zone, setZone] = useState<FridgeZone>("냉장실")
  const [slotId, setSlotId] = useState("")
  const [pending, setPending] = useState<{ id: string; outcome: "consumed" | "discarded" } | null>(null)
  const slots = getFridgeSlots(layout)
  const selectedLabel = slots.find(slot => slot.id === slotId)?.label
  const zoneFoods = foods.filter(food => food.zone === zone)
  const visible = useMemo(() => {
    const filtered = slotId ? foods.filter(food => food.shelfId === slotId) : foods.filter(food => food.zone === zone)
    return [...filtered].sort((a, b) => foodState(a).order - foodState(b).order)
  }, [foods, slotId, zone])
  const attention = foods.filter(food => ["expired", "urgent"].includes(foodState(food).level))
  const used = foods.reduce((sum, item) => sum + item.units, 0)
  const latestAnnouncement = announcements.find(notice => notice.fridgeId === fridgeId)
  const goalPercent = Math.min(100, communityGoal.completed / Math.max(1, communityGoal.target) * 100)

  function confirmAction() {
    if (!pending) return
    onComplete(pending.id, pending.outcome)
    setPending(null)
  }

  return (
    <div className="dm-screen student-home">
      <header className="home-header">
        <div><span>{residence.school}</span><h2>{residence.dorm} {residence.building} {residence.floor}층</h2><p>{profile.name} · {profile.room}</p></div>
        <button onClick={() => onNext("menu")} aria-label="메뉴">☰</button>
      </header>
      <main className="dm-stack home-stack">
        {latestAnnouncement && <section className="student-announcement"><span>📣</span><div><small>{latestAnnouncement.sender} · {new Date(latestAnnouncement.createdAt).toLocaleDateString("ko-KR", { month: "numeric", day: "numeric" })}</small><strong>우리 냉장고 공지</strong><p>{latestAnnouncement.message}</p></div></section>}
        {attention.length > 0 && <button className="attention-banner" onClick={() => setSlotId("")}><span>!</span><div><strong>오늘 확인할 음식 {attention.length}개</strong><small>{attention[0].name}부터 정리해 주세요.</small></div><b>보기 ›</b></button>}
        <section className="home-summary">
          <div><span>내 보관량</span><strong>{used}<small>/{personalLimit}칸</small></strong></div>
          <div><span>절감 포인트</span><strong>{impact.points}<small>P</small></strong></div>
          <div className="storage-progress"><i style={{ width: `${Math.min(100, used / personalLimit * 100)}%` }} /></div>
          <button onClick={() => onNext("impact")}>절감 리포트와 배지 보기 →</button>
          <button onClick={() => onNext("myFoods")}>내 음식 전체 보기 →</button>
        </section>

        <section className="student-weekly-goal">
          <div className="goal-sticker">🍽️</div>
          <div className="grow"><small>{communityGoal.weekLabel} 우리 냉장고 미션</small><strong>방치 음식 {communityGoal.target}개 함께 정리하기</strong><div className="goal-progress"><i style={{ width: `${goalPercent}%` }} /></div><p><b>{communityGoal.completed}개 완료</b> · {Math.max(0, communityGoal.target - communityGoal.completed)}개 남았어요</p></div>
          <span className="goal-percent">{Math.round(goalPercent)}%</span>
        </section>

        <section className="fridge-home-card">
          <div className="dm-section-title"><div><span className="dm-eyebrow">MY FRIDGE</span><h3>{residence.fridgeName}</h3></div><span className="ra-managed-badge">RA 등록 구조</span></div>
          <div className="fridge-zone-switch">
            <button className={zone === "냉장실" ? "active fridge" : ""} onClick={() => { setZone("냉장실"); setSlotId("") }}><span>❄️</span><strong>냉장실</strong><small>{foods.filter(food => food.zone === "냉장실").length}개</small></button>
            <button className={zone === "냉동고" ? "active freezer" : ""} onClick={() => { setZone("냉동고"); setSlotId("") }}><span>🧊</span><strong>냉동고</strong><small>{foods.filter(food => food.zone === "냉동고").length}개</small></button>
          </div>
          <div className="storage-legend student-storage-legend"><span><i className="safe" />안전</span><span><i className="warn" />주의</span><span><i className="urgent" />임박</span><span><i className="expired" />기한 초과</span><span><i className="empty" />비어 있음</span></div>
          <p className="tap-guide color-guide"><b>색만 봐도 상태를 알 수 있어요.</b> 각 칸은 그 안에서 가장 먼저 확인해야 할 음식의 색으로 표시됩니다.</p>
          <DynamicFridge layout={layout} zoneView={zone} selected={slotId} onSelect={slot => setSlotId(current => current === slot.id ? "" : slot.id)} foods={foods} />
          <div className="zone-glance"><span>{zone} 보관 음식 <b>{zoneFoods.length}개</b></span><span>확인 필요 <b>{zoneFoods.filter(food => ["expired", "urgent"].includes(foodState(food).level)).length}개</b></span></div>
        </section>

        <section>
          <div className="dm-section-title"><div><span className="dm-eyebrow">EXPIRY FIRST</span><h3>{selectedLabel ?? "처리 순서대로 보기"}</h3></div><span className="dm-badge neutral">{visible.length}개</span></div>
          <div className="dm-list">
            {visible.map(food => {
              const state = foodState(food)
              const active = pending?.id === food.id
              return (
                <article className={`stored-food-card food-${state.level}`} key={food.id}>
                  {food.photoData ? <img src={food.photoData} alt="" /> : <div className="food-placeholder"><FoodIcon category={food.category} foodId={food.guideId?.replace(/^catalog-/, "")} emoji={food.icon} size="large" /></div>}
                  <div className="grow"><div className="dm-row gap"><strong>{food.name}</strong><span className="slot-chip">{food.shelfId ?? "미지정"}</span></div><small>{food.kind} · {food.units}칸</small><p>{food.reminderRule}</p><span className={`food-status ${state.level}`}>{state.label}</span></div>
                  {!active && <div className="food-actions"><button onClick={() => setPending({ id: food.id, outcome: "consumed" })}>먹었어요</button><button className="muted" onClick={() => setPending({ id: food.id, outcome: "discarded" })}>폐기</button></div>}
                  {active && <div className="food-confirm"><strong>{pending.outcome === "consumed" ? "소비 완료할까요?" : "폐기로 기록할까요?"}</strong><div><button onClick={() => setPending(null)}>취소</button><button onClick={confirmAction}>확인</button></div></div>}
                </article>
              )
            })}
            {visible.length === 0 && <div className="dm-empty">{selectedLabel ? "이 칸에 등록된 음식이 없습니다." : `${zone}에 등록된 음식이 없습니다.`}</div>}
          </div>
        </section>
      </main>
      <nav className="app-bottom-nav">
        <button className="active"><span>▦</span>냉장고</button>
        <button onClick={() => onNext("report")}><span>!</span>신고</button>
        <button className="add" onClick={() => onNext("addFood")}><span>＋</span>등록</button>
        <button onClick={() => onNext("groupBuy")}><span>🛒</span>공동구매</button>
        <button onClick={() => onNext("myFoods")}><span>▣</span>내 음식</button>
      </nav>
    </div>
  )
}
