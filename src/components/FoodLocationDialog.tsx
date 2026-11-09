import { useMemo, useState } from "react"
import DynamicFridge, { getFridgeSlots, type FridgeSlot, type FridgeZone } from "./DynamicFridge"
import { shelfPositionLabels, type FoodItem, type FridgeLayout, type ShelfPosition } from "../model"

interface Props {
  food: FoodItem
  foods: FoodItem[]
  layout: FridgeLayout
  isOwner: boolean
  onClose: () => void
  onMove: (foodId: string, slot: FridgeSlot, subPosition: ShelfPosition) => string | null
}

const positions = Object.entries(shelfPositionLabels) as [ShelfPosition, string][]

export default function FoodLocationDialog({ food, foods, layout, isOwner, onClose, onMove }: Props) {
  const allSlots = useMemo(() => getFridgeSlots(layout), [layout])
  const currentSlot = allSlots.find(slot => slot.id === food.shelfId)
  const [zone, setZone] = useState<FridgeZone>(food.zone)
  const [slot, setSlot] = useState<FridgeSlot | null>(currentSlot ?? null)
  const [subPosition, setSubPosition] = useState<ShelfPosition>(food.subPosition ?? "center")
  const [error, setError] = useState("")

  function changeZone(next: FridgeZone) {
    setZone(next)
    setSlot(null)
    setError("")
  }

  function save() {
    if (!slot) return setError("이동한 선반이나 문칸을 선택해 주세요.")
    const message = onMove(food.id, slot, subPosition)
    if (message) return setError(message)
    onClose()
  }

  return (
    <div className="location-dialog-backdrop" role="presentation" onClick={onClose}>
      <section className="location-dialog" role="dialog" aria-modal="true" aria-label={`${food.name} 보관 위치 변경`} onClick={event => event.stopPropagation()}>
        <header><div><small>보관 위치 변경</small><h3>{food.name}</h3></div><button type="button" onClick={onClose} aria-label="닫기">×</button></header>
        {!isOwner && <div className="location-warning"><span>!</span><div><strong>다른 사용자의 음식입니다</strong><p>실제 음식을 옮긴 경우에만 위치를 변경해 주세요. 변경한 사용자와 시간이 기록됩니다.</p></div></div>}
        <div className="current-location"><span>현재 위치</span><strong>{currentSlot?.label ?? food.position} · {shelfPositionLabels[food.subPosition ?? "center"]}</strong></div>
        <div className="fridge-zone-switch selector-zone-switch">
          <button type="button" className={zone === "냉장실" ? "active fridge" : ""} onClick={() => changeZone("냉장실")}><span>❄️</span><strong>냉장실</strong></button>
          <button type="button" className={zone === "냉동고" ? "active freezer" : ""} onClick={() => changeZone("냉동고")}><span>🧊</span><strong>냉동고</strong></button>
        </div>
        <p className="location-help">실제로 옮긴 칸을 누른 뒤 칸 안의 위치를 선택해 주세요.</p>
        <DynamicFridge layout={layout} zoneView={zone} selected={slot?.id} onSelect={selected => { setSlot(selected); setError("") }} foods={foods} compact />
        <div className="sub-position-picker"><span>칸 안의 위치</span><div>{positions.map(([key, label]) => <button type="button" key={key} className={subPosition === key ? "active" : ""} onClick={() => setSubPosition(key)}>{label}</button>)}</div></div>
        {slot && <div className="location-result"><span>{slot.id}</span><strong>{slot.label} · {shelfPositionLabels[subPosition]}</strong></div>}
        {error && <p className="dm-error">{error}</p>}
        <footer><button type="button" onClick={onClose}>취소</button><button type="button" onClick={save}>위치 변경하기</button></footer>
      </section>
    </div>
  )
}
