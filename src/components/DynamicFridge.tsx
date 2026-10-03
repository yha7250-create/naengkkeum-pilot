import type { FoodItem, FridgeLayout } from "../model"

export type FridgeZone = "냉장실" | "냉동고"
type SlotState = "safe" | "warn" | "urgent" | "expired" | "empty"

export interface FridgeSlot {
  id: string
  label: string
  zone: FridgeZone
  kind: "shelf" | "drawer" | "door" | "freezer"
}

export function getFridgeSlots(layout: FridgeLayout): FridgeSlot[] {
  return [
    ...Array.from({ length: layout.freezerShelves }, (_, index) => ({ id: `F${index + 1}`, label: `냉동 선반 ${index + 1}`, zone: "냉동고" as const, kind: "freezer" as const })),
    ...Array.from({ length: layout.freezerDoorPockets ?? 3 }, (_, index) => ({ id: `FP${index + 1}`, label: `냉동 도어 포켓 ${index + 1}`, zone: "냉동고" as const, kind: "door" as const })),
    ...Array.from({ length: layout.fridgeShelves }, (_, index) => ({ id: `R${index + 1}`, label: `냉장 선반 ${index + 1}`, zone: "냉장실" as const, kind: "shelf" as const })),
    ...Array.from({ length: layout.drawers }, (_, index) => ({ id: `D${index + 1}`, label: `보관 서랍 ${index + 1}`, zone: "냉장실" as const, kind: "drawer" as const })),
    ...Array.from({ length: layout.doorPockets }, (_, index) => ({ id: `P${index + 1}`, label: `도어 포켓 ${index + 1}`, zone: "냉장실" as const, kind: "door" as const })),
  ]
}

function getFoodState(food: FoodItem): Exclude<SlotState, "empty"> {
  const target = new Date(food.expiry ? `${food.expiry}T23:59:59` : food.reminderAt)
  const diff = Math.ceil((target.getTime() - Date.now()) / 86400000)
  if (diff < 0) return "expired"
  if (diff <= 2) return "urgent"
  if (diff <= 7) return "warn"
  return "safe"
}

function getSlotState(foods: FoodItem[]): SlotState {
  if (foods.length === 0) return "empty"
  const priority: Exclude<SlotState, "empty">[] = ["expired", "urgent", "warn", "safe"]
  return priority.find(state => foods.some(food => getFoodState(food) === state)) ?? "safe"
}

const stateLabel: Record<SlotState, string> = {
  safe: "안전",
  warn: "주의",
  urgent: "임박",
  expired: "기한 초과",
  empty: "비어 있음",
}

interface Props {
  layout: FridgeLayout
  zoneView?: FridgeZone
  selected?: string
  onSelect?: (slot: FridgeSlot) => void
  foods?: FoodItem[]
  compact?: boolean
}

export default function DynamicFridge({ layout, zoneView = "냉장실", selected, onSelect, foods = [], compact = false }: Props) {
  const slots = getFridgeSlots(layout).filter(slot => slot.zone === zoneView)
  const mainSlots = slots.filter(slot => slot.kind !== "door")
  const doorSlots = slots.filter(slot => slot.kind === "door")

  function renderSlot(slot: FridgeSlot) {
    const slotFoods = foods.filter(food => food.shelfId === slot.id)
    const state = getSlotState(slotFoods)
    const interactive = Boolean(onSelect)
    const roomFoods = new Map<string, FoodItem[]>()
    slotFoods.forEach(food => (food.coOwners?.length ? food.coOwners : ["등록자"]).forEach(room => roomFoods.set(room, [...(roomFoods.get(room) ?? []), food])))
    const occupants = [...roomFoods.entries()]
    return (
      <button
        type="button"
        key={slot.id}
        className={`fridge-slot ${slot.kind} state-${state} ${selected === slot.id ? "selected" : ""}`}
        onClick={() => onSelect?.(slot)}
        aria-pressed={interactive ? selected === slot.id : undefined}
        disabled={!interactive}
      >
        <span className="slot-content shelf-room-content">
          <span className="slot-heading"><small>{compact ? slot.label.replace(/ (선반|문칸|서랍)/, "") : slot.label}</small><b>{slot.id}</b></span>
          <span className="slot-room-boxes">
            {occupants.slice(0, 6).map(([room, roomItems]) => { const roomState = getSlotState(roomItems); return <span className={`visual-room-box ${roomState}`} key={room}><strong>{room.replace(/호$/, "")}</strong><small>{roomItems.length}개</small></span> })}
            {occupants.length === 0 && <span className="slot-empty-label">비어있음</span>}
            {occupants.length > 6 && <span className="more-rooms">+{occupants.length - 6}</span>}
          </span>
          {slotFoods.length > 0 && <span className="slot-state-caption">{stateLabel[state]}</span>}
        </span>
      </button>
    )
  }

  return (
    <div className={`dynamic-fridge zone-fridge ${compact ? "compact" : ""} ${zoneView === "냉동고" ? "freezer-view" : "fridge-view"}`}>
      <div className="fridge-handle" />
      <div className="zone-fridge-label"><span>{zoneView === "냉동고" ? "🧊" : "❄️"}</span><strong>{zoneView}</strong><small>{zoneView === "냉동고" ? "FREEZER" : "REFRIGERATOR"}</small></div>
      <div className="fridge-body zone-body">
        <div className="fridge-main zone-main">
          <em>{zoneView === "냉동고" ? "FREEZER" : "REFRIGERATOR"}</em>
          {mainSlots.map(renderSlot)}
        </div>
        <div className="door-zone zone-door">
          <em>DOOR</em>
          {doorSlots.map(renderSlot)}
          {doorSlots.length === 0 && <span className="no-door">문칸 없음</span>}
        </div>
      </div>
    </div>
  )
}
