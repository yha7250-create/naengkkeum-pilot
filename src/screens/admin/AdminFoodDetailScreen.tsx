import { useMemo, useState } from "react"
import FoodIcon from "../../components/FoodIcon"
import { foodTargetDate, formatFoodQuantity, type FoodItem, type ResidenceProfile } from "../../model"

interface Props {
  onBack: () => void
  foods: FoodItem[]
  residence: ResidenceProfile
  onRemove: (id: string) => void
}

type Filter = "all" | "urgent" | "expired"

function daysLeft(food: FoodItem) {
  return Math.ceil((foodTargetDate(food).getTime() - Date.now()) / 86400000)
}

function statusOf(food: FoodItem) {
  const days = daysLeft(food)
  if (days < 0) return { key: "expired", label: `${Math.abs(days)}일 초과` }
  if (days <= 2) return { key: "urgent", label: days === 0 ? "오늘 확인" : `D-${days}` }
  if (days <= 7) return { key: "warn", label: `D-${days}` }
  return { key: "safe", label: `D-${days}` }
}

export default function AdminFoodDetailScreen({ onBack, foods, residence, onRemove }: Props) {
  const [filter, setFilter] = useState<Filter>("all")
  const [expandedRoom, setExpandedRoom] = useState("")

  const visibleFoods = useMemo(() => foods
    .filter(food => filter === "all" || statusOf(food).key === filter)
    .sort((a, b) => daysLeft(a) - daysLeft(b)), [foods, filter])

  const byRoom = useMemo(() => {
    const grouped = new Map<string, FoodItem[]>()
    visibleFoods.forEach(food => {
      const owners = food.coOwners?.length ? food.coOwners : ["소유자 미입력"]
      owners.forEach(room => grouped.set(room, [...(grouped.get(room) ?? []), food]))
    })
    return [...grouped.entries()].sort(([a], [b]) => a.localeCompare(b, "ko"))
  }, [visibleFoods])

  function remove(food: FoodItem) {
    if (window.confirm(`‘${food.name}’ 등록을 냉장고에서 삭제할까요? 이 작업은 되돌릴 수 없습니다.`)) onRemove(food.id)
  }

  return <div className="dm-screen admin-food-detail-screen">
    <header className="dm-header admin-header">
      <button className="dm-icon-button dark" onClick={onBack} aria-label="뒤로 가기">‹</button>
      <div><p>{residence.dorm} {residence.building} {residence.floor}층 · {residence.fridgeName}</p><h2>실제 등록 음식</h2></div>
      <span className="dm-step admin">RA</span>
    </header>
    <main className="dm-stack">
      <section className="my-food-summary">
        <div><strong>{foods.length}</strong><span>전체</span></div>
        <div><strong>{foods.filter(food => daysLeft(food) >= 0 && daysLeft(food) <= 2).length}</strong><span>임박</span></div>
        <div><strong>{foods.filter(food => daysLeft(food) < 0).length}</strong><span>기한 초과</span></div>
      </section>
      <div className="dm-segmented three">
        {([["all", "전체"], ["urgent", "임박"], ["expired", "기한 초과"]] as const).map(([key, label]) =>
          <button key={key} className={filter === key ? "active" : ""} onClick={() => setFilter(key)}>{label}</button>)}
      </div>
      {byRoom.map(([room, roomFoods]) => <section className="dm-card" key={room}>
        <button className="fridge-card-main" onClick={() => setExpandedRoom(current => current === room ? "" : room)}>
          <span className="layout-control-icon">🏠</span>
          <span className="grow"><strong>{room}</strong><small>등록 음식 {roomFoods.length}개</small></span>
          <b>{expandedRoom === room ? "−" : "+"}</b>
        </button>
        {expandedRoom === room && <div className="room-detail-list">{roomFoods.map(food => {
          const status = statusOf(food)
          return <article key={food.id}>
            <FoodIcon category={food.category} foodId={food.guideId?.replace(/^catalog-/, "")} emoji={food.icon} size="small" />
            <div><strong>{food.name}</strong><p>{food.zone} · {food.shelfId || food.position} · {formatFoodQuantity(food.quantity, food.quantityUnit)}</p><small>등록 {new Date(food.registeredAt).toLocaleDateString("ko-KR")}</small></div>
            <span className={`detail-status ${status.key}`}>{status.label}</span>
            <button className="dm-danger-text" onClick={() => remove(food)}>삭제</button>
          </article>
        })}</div>}
      </section>)}
      {byRoom.length === 0 && <div className="dm-empty">이 냉장고에 실제로 등록된 음식이 없습니다.</div>}
      <p className="dm-help">예시 음식은 표시하지 않습니다. 학생이 이 냉장고를 선택해 등록한 음식만 나타납니다.</p>
    </main>
  </div>
}
