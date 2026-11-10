import { useMemo, useState } from "react"
import { uid, type ChatRoom, type FridgeMetric, type ResidenceProfile } from "../../model"

interface Props {
  onBack: () => void
  rooms: ChatRoom[]
  onAddRoom: (room: ChatRoom) => void
  onSend: (roomId: string, text: string) => void
  residence: ResidenceProfile
  adminMode?: boolean
  adminName?: string
  fridges?: FridgeMetric[]
  selectedFridgeId?: string
  onSelectFridge?: (id: string) => void
}

export default function CommunityScreen({ onBack, rooms, onAddRoom, onSend, residence, adminMode = false, adminName = "관리자", fridges = [], selectedFridgeId, onSelectFridge }: Props) {
  const adminLabel = adminName.startsWith("관리자") ? adminName : `관리자 ${adminName}`
  const [tab, setTab] = useState<"care" | "groupbuy">("care")
  const activeFridgeId = adminMode ? selectedFridgeId : residence.fridgeId
  const selectedFridge = fridges.find(fridge => fridge.id === activeFridgeId)
  const scopedRooms = useMemo(() => rooms.filter(room => {
    if (!activeFridgeId) return true
    if (room.fridgeId) return room.fridgeId === activeFridgeId
    if (!adminMode) return room.location.includes(residence.building) && room.location.includes(`${residence.floor}층`)
    const legacyOwner = fridges.find(fridge => room.location.includes(fridge.building) && room.location.includes(fridge.floor))
    return legacyOwner?.id === activeFridgeId
  }), [rooms, activeFridgeId, adminMode, residence.building, residence.floor, fridges])
  const filtered = useMemo(() => scopedRooms.filter(room => room.type === tab), [scopedRooms, tab])
  const [roomId, setRoomId] = useState(filtered[0]?.id ?? "")
  const active = scopedRooms.find(room => room.id === roomId && room.type === tab) ?? filtered[0]
  const [message, setMessage] = useState("")
  const [creating, setCreating] = useState(false)
  const [title, setTitle] = useState("")
  const [pickup, setPickup] = useState("")
  const [settlement, setSettlement] = useState("")

  function changeTab(next: "care" | "groupbuy") {
    setTab(next)
    setRoomId(scopedRooms.find(room => room.type === next)?.id ?? "")
    setCreating(false)
  }

  function selectFridge(id: string) {
    onSelectFridge?.(id)
    setRoomId("")
    setCreating(false)
  }

  function createRoom() {
    if (!title.trim()) return
    const room: ChatRoom = {
      id: uid(tab), fridgeId: activeFridgeId, type: tab, title: title.trim(),
      location: selectedFridge ? `${selectedFridge.dorm ?? residence.dorm} ${selectedFridge.building} ${selectedFridge.floor} · ${selectedFridge.label}` : `${residence.dorm} ${residence.building} ${residence.floor}층 · ${residence.fridgeName}`,
      adminPresent: true, participants: 1,
      pickupPlace: tab === "groupbuy" ? pickup.trim() || "미정" : undefined,
      settlement: tab === "groupbuy" ? settlement.trim() || "미정" : undefined,
      messages: [{ id: uid("message"), author: adminMode ? adminLabel : "관리자", role: "admin", text: "관리자가 참여했습니다. 개인정보와 계좌정보 공개에 주의해 주세요.", sentAt: "지금" }],
    }
    onAddRoom(room)
    setRoomId(room.id)
    setTitle("")
    setPickup("")
    setSettlement("")
    setCreating(false)
  }

  function send() {
    if (!active || !message.trim()) return
    onSend(active.id, message)
    setMessage("")
  }

  return (
    <div className="dm-screen chat-screen">
      <header className="dm-header">
        <button className="dm-icon-button dark" onClick={onBack} aria-label="뒤로 가기">‹</button>
        <div><p>{adminMode ? "관리자 전용 · 대화방 운영" : "같은 층 사용자 · 관리자 동행"}</p><h2>{adminMode ? "커뮤니티 관리" : `${residence.floor}층 커뮤니티`}</h2></div>
        <button className="dm-header-action" onClick={() => setCreating(value => !value)}>+ 방</button>
      </header>

      {adminMode && <section className="community-fridge-picker">
        <label htmlFor="community-fridge">대화방을 확인할 냉장고</label>
        <select id="community-fridge" value={activeFridgeId ?? ""} onChange={event => selectFridge(event.target.value)}>
          {fridges.map(fridge => <option key={fridge.id} value={fridge.id}>{fridge.dorm ? `${fridge.dorm} · ` : ""}{fridge.building} · {fridge.floor} · {fridge.label}</option>)}
        </select>
        <small>선택한 냉장고의 대화방만 표시됩니다.</small>
      </section>}

      <div className="dm-tabbar">
        <button className={tab === "care" ? "active" : ""} onClick={() => changeTab("care")}>방치·도난 대화</button>
        <button className={tab === "groupbuy" ? "active" : ""} onClick={() => changeTab("groupbuy")}>공동구매</button>
      </div>

      {creating && (
        <section className="create-room">
          <input className="dm-input" value={title} onChange={event => setTitle(event.target.value)} placeholder={tab === "care" ? "예: 냉장고 B 정리 요청" : "예: 닭가슴살 공동구매"} />
          {tab === "groupbuy" && <>
            <input className="dm-input" value={pickup} onChange={event => setPickup(event.target.value)} placeholder="수령 장소" />
            <input className="dm-input" value={settlement} onChange={event => setSettlement(event.target.value)} placeholder="1인 금액·정산 방식" />
          </>}
          <p>방을 만들면 담당 관리자 1명이 자동 참여합니다.</p>
          <button className="dm-primary small" onClick={createRoom}>대화방 만들기</button>
        </section>
      )}

      <div className="room-strip">
        {filtered.map(room => <button key={room.id} className={active?.id === room.id ? "active" : ""} onClick={() => setRoomId(room.id)}><strong>{room.title}</strong><small>{room.participants}명 · 관리자 참여</small></button>)}
      </div>

      {active ? (
        <div className="conversation">
          <div className="conversation-head">
            <div><h3>{active.title}</h3><p>{active.location} · <b>{adminMode ? adminLabel : "관리자"} 참여 중</b></p></div>
            <span className="admin-shield">관리</span>
          </div>
          {active.type === "groupbuy" && <div className="groupbuy-meta"><div><span>수령 장소</span><strong>{active.pickupPlace}</strong></div><div><span>정산</span><strong>{active.settlement}</strong></div></div>}
          <div className="messages">
            {active.messages.map(item => (
              <div key={item.id} className={item.role === "admin" ? "message admin" : "message student"}>
                <div><strong>{item.author}</strong><small>{item.sentAt}</small></div><p>{item.text}</p>
              </div>
            ))}
          </div>
          <div className="quick-messages">
            {(tab === "care" ? ["주인분, 확인 부탁드려요", "버려도 될까요?", "관리자 확인 요청"] : ["참여할게요", "정산 완료", "수령 시간 확인"]).map(text => <button key={text} onClick={() => setMessage(text)}>{text}</button>)}
          </div>
          <div className="composer"><input value={message} onChange={event => setMessage(event.target.value)} onKeyDown={event => event.key === "Enter" && send()} placeholder="메시지 입력" /><button onClick={send}>전송</button></div>
        </div>
      ) : <div className="dm-empty">대화방이 없습니다. 새 방을 만들어 보세요.</div>}
    </div>
  )
}
