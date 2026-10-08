import { useMemo, useState } from "react"
import { foodTargetDate, type FoodItem, type FridgeLayout, type ResidenceProfile, type UserProfile } from "../../model"

interface Props {
  onNext: (screen: string) => void
  foods: FoodItem[]
  layout: FridgeLayout
  residence: ResidenceProfile
  profile: UserProfile
}

type Zone = "냉장실" | "냉동실"
type StorageStatus = "safe" | "warn" | "urgent" | "expired"

interface InventoryItem {
  id: string
  room: string
  name: string
  zone: Zone
  slot: string
  size: string
  registeredAt: string
  expiry: string
  longStay: boolean
}

interface StorageSlot {
  id: string
  label: string
}

const statusText: Record<StorageStatus, string> = {
  safe: "안전",
  warn: "주의",
  urgent: "임박",
  expired: "기한 초과",
}

function getStatus(item: InventoryItem): StorageStatus {
  const diff = Math.ceil((new Date(item.expiry).getTime() - Date.now()) / 86400000)
  if (diff < 0) return "expired"
  if (diff <= 2) return "urgent"
  if (diff <= 7) return "warn"
  return "safe"
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "short", day: "numeric" }).format(new Date(value))
}

function roomNumber(room: string) {
  return room.replace(/호$/, "")
}

export default function AdminFridgeOverviewScreen({ onNext, foods, layout, residence, profile }: Props) {
  const [zone, setZone] = useState<Zone>("냉장실")
  const [selectedRoom, setSelectedRoom] = useState("")

  const inventory = useMemo<InventoryItem[]>(() => {
    const currentUser: InventoryItem[] = foods.flatMap((food, index) => (food.coOwners?.length ? food.coOwners : [profile.room || "302호"]).map(room => ({
      id: `${food.id}-${room}`,
      room,
      name: food.registrationMode === "shared" ? `${food.name} · 공동` : food.name,
      zone: food.zone === "냉동고" ? "냉동실" : "냉장실",
      slot: food.shelfId || (food.zone === "냉동고" ? "F1" : `R${index % Math.max(1, layout.fridgeShelves) + 1}`),
      size: food.size === "large" ? "대형" : food.size === "medium" ? "중형" : "소형",
      registeredAt: food.registeredAt,
      expiry: foodTargetDate(food).toISOString(),
      longStay: Date.now() - new Date(food.registeredAt).getTime() >= 14 * 86400000,
    })))

    return currentUser
  }, [foods, layout.fridgeShelves, profile.room])

  const mainSlots: StorageSlot[] = zone === "냉장실"
    ? [
        ...Array.from({ length: layout.fridgeShelves }, (_, index) => ({ id: `R${index + 1}`, label: `냉장 선반 ${index + 1}` })),
        ...Array.from({ length: layout.drawers }, (_, index) => ({ id: `D${index + 1}`, label: `보관 서랍 ${index + 1}` })),
      ]
    : Array.from({ length: layout.freezerShelves }, (_, index) => ({ id: `F${index + 1}`, label: `냉동 선반 ${index + 1}` }))

  const doorSlots: StorageSlot[] = zone === "냉장실"
    ? Array.from({ length: layout.doorPockets }, (_, index) => ({ id: `P${index + 1}`, label: `도어 포켓 ${index + 1}` }))
    : Array.from({ length: layout.freezerDoorPockets ?? 3 }, (_, index) => ({ id: `FP${index + 1}`, label: `냉동 도어 ${index + 1}` }))

  const zoneItems = inventory.filter(item => item.zone === zone)
  const urgentCount = zoneItems.filter(item => ["urgent", "expired"].includes(getStatus(item))).length
  const longCount = zoneItems.filter(item => item.longStay).length
  const detailItems = zoneItems.filter(item => item.room === selectedRoom)

  function roomsForSlot(slotId: string) {
    const grouped = new Map<string, InventoryItem[]>()
    zoneItems.filter(item => item.slot === slotId).forEach(item => grouped.set(item.room, [...(grouped.get(item.room) || []), item]))
    return [...grouped.entries()]
  }

  function roomStatus(items: InventoryItem[]) {
    const levels: StorageStatus[] = ["expired", "urgent", "warn", "safe"]
    return levels.find(level => items.some(item => getStatus(item) === level)) || "safe"
  }

  function Slot({ slot }: { slot: StorageSlot }) {
    const rooms = roomsForSlot(slot.id)
    return (
      <div className="admin-storage-slot">
        <small>{slot.label}</small>
        <div>
          {rooms.map(([room, items]) => {
            const status = roomStatus(items)
            return <button className={`room-box ${status}`} key={room} onClick={() => setSelectedRoom(room)}><strong>{roomNumber(room)}</strong><span>{items.length}개</span></button>
          })}
          {rooms.length === 0 && <span className="empty-slot">비어있음</span>}
        </div>
      </div>
    )
  }

  const mainColumn = <div className="storage-column main-column"><h4>{zone === "냉장실" ? "REFRIGERATOR" : "FREEZER"}</h4>{mainSlots.map(slot => <Slot key={slot.id} slot={slot} />)}</div>
  const doorColumn = <div className="storage-column door-column"><h4>DOOR</h4>{doorSlots.map(slot => <Slot key={slot.id} slot={slot} />)}</div>

  return (
    <div className="dm-screen admin-inventory-screen">
      <header className="admin-inventory-header">
        <div><p>{residence.dorm} {residence.building} {residence.floor}층</p><h2>냉장고 현황</h2></div>
        <button onClick={() => onNext("adminMenu")} aria-label="관리자 메뉴">☰</button>
        <section>
          <div><strong>{zoneItems.length}</strong><span>개</span><small>전체 음식</small></div>
          <div><strong>{urgentCount}</strong><span>구역</span><small>소비기한 임박</small></div>
          <div><strong>{longCount}</strong><span>구역</span><small>장기간 방치</small></div>
        </section>
      </header>

      <main className="admin-inventory-content">
        <button className="inventory-fridge-switch" onClick={() => onNext("adminFridgeSelect")}><span>❄️</span><div><small>현재 냉장고</small><strong>{residence.building} {residence.floor}층 · {residence.fridgeName}</strong></div><b>다른 냉장고 ›</b></button>
        <div className="zone-switch">
          <button className={zone === "냉장실" ? "active fridge" : ""} onClick={() => { setZone("냉장실"); setSelectedRoom("") }}>❄ 냉장실</button>
          <button className={zone === "냉동실" ? "active freezer" : ""} onClick={() => { setZone("냉동실"); setSelectedRoom("") }}>◆ 냉동실</button>
        </div>
        <div className="storage-legend">
          {(["safe", "warn", "urgent", "expired"] as StorageStatus[]).map(status => <span key={status}><i className={status} />{statusText[status]}</span>)}
          <span><i className="empty" />비어있음</span>
        </div>
        <p className="inventory-guide">호수 상자를 누르면 해당 학생이 보관한 음식의 상세정보가 열립니다.</p>
        <section className={`admin-storage-map ${zone === "냉동실" ? "freezer-map" : ""}`}>
          {zone === "냉동실" ? <>{doorColumn}{mainColumn}</> : <>{mainColumn}{doorColumn}</>}
        </section>
      </main>

      <nav className="admin-bottom-nav five">
        <button onClick={() => onNext("adminDashboard")}><span>⌂</span>대시보드</button>
        <button className="active"><span>▦</span>현황</button>
        <button onClick={() => onNext("adminOperations")}><span>!</span>운영</button>
        <button onClick={() => onNext("adminStats")}><span>↗</span>통계</button>
        <button onClick={() => onNext("adminMenu")}><span>☰</span>메뉴</button>
      </nav>

      {selectedRoom && (
        <div className="room-detail-backdrop" onClick={() => setSelectedRoom("")}>
          <section className="room-detail-dialog" role="dialog" aria-modal="true" aria-label={`${selectedRoom} 보관 음식 상세정보`} onClick={event => event.stopPropagation()}>
            <header><div><span>{zone} 보관자</span><h3>{selectedRoom}</h3></div><button onClick={() => setSelectedRoom("")} aria-label="닫기">×</button></header>
            <div className="room-detail-summary"><div><strong>{detailItems.length}</strong><small>등록 음식</small></div><div><strong>{detailItems.reduce((sum, item) => sum + (item.size === "대형" ? 3 : item.size === "중형" ? 2 : 1), 0)}</strong><small>사용 칸</small></div><div><strong>{detailItems.filter(item => ["urgent", "expired"].includes(getStatus(item))).length}</strong><small>확인 필요</small></div></div>
            <div className="room-detail-list">
              {detailItems.map(item => { const status = getStatus(item); return <article key={item.id}><div className={`detail-status ${status}`}>{statusText[status]}</div><div><strong>{item.name}</strong><p>{item.slot} · {item.size}</p><small>등록 {dateLabel(item.registeredAt)} · 확인기한 {dateLabel(item.expiry)}</small></div>{item.longStay && <span className="long-stay">장기보관</span>}</article> })}
            </div>
            <footer><button onClick={() => setSelectedRoom("")}>닫기</button><button onClick={() => { setSelectedRoom(""); onNext("adminOperations") }}>신고·운영센터 확인</button></footer>
          </section>
        </div>
      )}
    </div>
  )
}
