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

function dateFromToday(days: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return date.toISOString()
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

    const samples: InventoryItem[] = [
      { id: "a1", room: "301호", name: "계란 10구", zone: "냉장실", slot: "R1", size: "중형", registeredAt: dateFromToday(-4), expiry: dateFromToday(9), longStay: false },
      { id: "a2", room: "301호", name: "우유", zone: "냉장실", slot: "P1", size: "소형", registeredAt: dateFromToday(-2), expiry: dateFromToday(5), longStay: false },
      { id: "a3", room: "303호", name: "남은 치킨", zone: "냉장실", slot: "R3", size: "중형", registeredAt: dateFromToday(-2), expiry: dateFromToday(1), longStay: false },
      { id: "a4", room: "305호", name: "샐러드", zone: "냉장실", slot: "P2", size: "소형", registeredAt: dateFromToday(-1), expiry: dateFromToday(4), longStay: false },
      { id: "a5", room: "306호", name: "두부", zone: "냉장실", slot: "R2", size: "소형", registeredAt: dateFromToday(-9), expiry: dateFromToday(-1), longStay: false },
      { id: "a6", room: "307호", name: "김치통", zone: "냉장실", slot: "R3", size: "대형", registeredAt: dateFromToday(-20), expiry: dateFromToday(18), longStay: true },
      { id: "a7", room: "308호", name: "요거트", zone: "냉장실", slot: "D1", size: "소형", registeredAt: dateFromToday(-3), expiry: dateFromToday(6), longStay: false },
      { id: "a8", room: "310호", name: "배달 떡볶이", zone: "냉장실", slot: "R4", size: "중형", registeredAt: dateFromToday(-3), expiry: dateFromToday(0), longStay: false },
      { id: "f1", room: "301호", name: "냉동 만두", zone: "냉동실", slot: "F1", size: "중형", registeredAt: dateFromToday(-8), expiry: dateFromToday(22), longStay: false },
      { id: "f2", room: "302호", name: "아이스크림", zone: "냉동실", slot: "FP2", size: "소형", registeredAt: dateFromToday(-5), expiry: dateFromToday(40), longStay: false },
      { id: "f3", room: "304호", name: "냉동 볶음밥", zone: "냉동실", slot: "F1", size: "중형", registeredAt: dateFromToday(-17), expiry: dateFromToday(30), longStay: true },
      { id: "f4", room: "306호", name: "닭가슴살", zone: "냉동실", slot: "F2", size: "중형", registeredAt: dateFromToday(-6), expiry: dateFromToday(16), longStay: false },
      { id: "f5", room: "311호", name: "냉동 도시락", zone: "냉동실", slot: "F3", size: "중형", registeredAt: dateFromToday(-7), expiry: dateFromToday(2), longStay: false },
      { id: "f6", room: "312호", name: "냉동 블루베리", zone: "냉동실", slot: "F3", size: "소형", registeredAt: dateFromToday(-10), expiry: dateFromToday(25), longStay: false },
      { id: "f7", room: "315호", name: "냉동 피자", zone: "냉동실", slot: "F4", size: "대형", registeredAt: dateFromToday(-18), expiry: dateFromToday(7), longStay: true },
      { id: "f8", room: "310호", name: "얼린 국", zone: "냉동실", slot: "FP1", size: "중형", registeredAt: dateFromToday(-3), expiry: dateFromToday(1), longStay: false },
    ]
    return [...currentUser, ...samples.filter(sample => sample.room !== (profile.room || "302호"))]
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
