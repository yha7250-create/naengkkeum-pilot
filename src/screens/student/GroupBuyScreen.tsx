import { useMemo, useState } from "react"
import { foodCategories } from "../../foodGuide"
import { uid, type ChatRoom, type ResidenceProfile, type UserProfile } from "../../model"

interface Props {
  onBack: () => void
  rooms: ChatRoom[]
  profile: UserProfile
  residence: ResidenceProfile
  onAddRoom: (room: ChatRoom) => void
  onJoin: (roomId: string, roomNumber: string) => void
  onTogglePayment: (roomId: string, roomNumber: string) => void
}

const categories = ["전체", ...foodCategories.filter(item => item !== "기타")]

export default function GroupBuyScreen({ onBack, rooms, profile, residence, onAddRoom, onJoin, onTogglePayment }: Props) {
  const [category, setCategory] = useState("전체")
  const [expanded, setExpanded] = useState<string | null>(rooms.find(room => room.type === "groupbuy")?.id ?? null)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ title: "", category: "유제품", max: "4", deadline: "", unitPrice: "", bankName: "", accountNumber: "", accountHolder: "", pickupPlace: "" })
  const [error, setError] = useState("")
  const visible = useMemo(() => rooms.filter(room => room.type === "groupbuy" && (category === "전체" || room.category === category)), [rooms, category])

  function createRoom() {
    if (!form.title.trim() || !form.accountNumber.trim() || !form.accountHolder.trim()) return setError("제목, 계좌번호, 예금주를 입력해 주세요.")
    const room: ChatRoom = {
      id: uid("groupbuy"), type: "groupbuy", title: form.title.trim(),
      location: `${residence.dorm} ${residence.building} ${residence.floor}층`, adminPresent: true, participants: 1,
      pickupPlace: form.pickupPlace.trim() || `${residence.building} 1층 로비`,
      settlement: form.unitPrice ? `1인 ${Number(form.unitPrice).toLocaleString()}원 · 계좌이체` : "금액 협의",
      category: form.category, creatorRoom: profile.room, bankName: form.bankName.trim() || "은행",
      accountNumber: form.accountNumber.trim(), accountHolder: form.accountHolder.trim(), unitPrice: Number(form.unitPrice) || undefined,
      deadline: form.deadline || undefined, maxParticipants: Number(form.max), payments: [{ room: profile.room, paid: true }], messages: [],
    }
    onAddRoom(room)
    setExpanded(room.id)
    setShowCreate(false)
    setError("")
  }

  return <div className="dm-screen groupbuy-screen">
    <header className="dm-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>{residence.dorm} {residence.building} {residence.floor}층</p><h2>공동구매·정산</h2></div><button className="dm-header-action" onClick={() => setShowCreate(value => !value)}>＋ 개설</button></header>
    <main className="dm-stack">
      <div className="category-scroll">{categories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      {showCreate && <section className="groupbuy-create dm-card"><div className="dm-section-title"><h3>새 공동구매</h3><span className="dm-badge green">RA 자동 참여</span></div><label>제목<input className="dm-input" value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} placeholder="예: 우유 4개 공동구매" /></label><div className="form-grid"><label>카테고리<select className="dm-input" value={form.category} onChange={event => setForm({ ...form, category: event.target.value })}>{foodCategories.map(item => <option key={item}>{item}</option>)}</select></label><label>최대 인원<input className="dm-input" type="number" min="2" max="20" value={form.max} onChange={event => setForm({ ...form, max: event.target.value })} /></label><label>마감일<input className="dm-input" type="date" value={form.deadline} onChange={event => setForm({ ...form, deadline: event.target.value })} /></label><label>1인 금액<input className="dm-input" type="number" value={form.unitPrice} onChange={event => setForm({ ...form, unitPrice: event.target.value })} placeholder="3500" /></label></div><div className="form-grid account-grid"><label>은행<input className="dm-input" value={form.bankName} onChange={event => setForm({ ...form, bankName: event.target.value })} placeholder="신한" /></label><label>예금주<input className="dm-input" value={form.accountHolder} onChange={event => setForm({ ...form, accountHolder: event.target.value })} placeholder="홍길동" /></label></div><label>계좌번호<input className="dm-input" inputMode="numeric" value={form.accountNumber} onChange={event => setForm({ ...form, accountNumber: event.target.value })} placeholder="110-123-456789" /></label><label>수령 장소<input className="dm-input" value={form.pickupPlace} onChange={event => setForm({ ...form, pickupPlace: event.target.value })} placeholder="1관 1층 로비" /></label>{error && <p className="dm-error compact">{error}</p>}<button className="dm-primary small" onClick={createRoom}>공동구매 개설</button><p className="dm-help">계좌는 참여자에게만 보여주는 것이 안전합니다. 이 프로토타입에서는 기능 확인을 위해 화면에 표시됩니다.</p></section>}
      <section className="groupbuy-list">{visible.map(room => {
        const payments = room.payments ?? []
        const joined = payments.some(item => item.room === profile.room)
        const isOwner = room.creatorRoom === profile.room
        const full = Boolean(room.maxParticipants && room.participants >= room.maxParticipants)
        return <article key={room.id} className="groupbuy-card"><button className="groupbuy-head" onClick={() => setExpanded(expanded === room.id ? null : room.id)}><div><div><span className={`dm-badge ${full ? "danger" : "green"}`}>{full ? "마감" : "모집중"}</span><span className="dm-badge neutral">{room.category ?? "기타"}</span></div><strong>{room.title}</strong><small>{room.creatorRoom ?? "대표자"} 개설 · {room.participants}/{room.maxParticipants ?? "∞"}명 · {room.deadline ?? "마감일 미정"}</small></div><b>{expanded === room.id ? "⌃" : "⌄"}</b></button>
          {expanded === room.id && <div className="groupbuy-detail"><div className="member-progress">{Array.from({ length: room.maxParticipants ?? Math.max(room.participants, 4) }, (_, index) => <i key={index} className={index < room.participants ? "filled" : ""} />)}</div><div className="account-box"><span>대표자 계좌 · 참여 후 송금</span><strong>{room.bankName} {room.accountNumber}</strong><small>{room.accountHolder} · {room.unitPrice ? `${room.unitPrice.toLocaleString()}원` : room.settlement}</small><button onClick={() => navigator.clipboard?.writeText(room.accountNumber ?? "")}>계좌 복사</button></div><div className="pickup-row"><span>수령 장소</span><strong>{room.pickupPlace ?? "협의 중"}</strong></div><h4>입금 체크리스트 <small>{isOwner ? "칩을 눌러 입금 확인" : "대표자가 확인합니다"}</small></h4><div className="payment-chips">{payments.map(item => <button key={item.room} className={item.paid ? "paid" : "unpaid"} disabled={!isOwner} onClick={() => onTogglePayment(room.id, item.room)}>{item.paid ? "✓" : "○"} {item.room}</button>)}</div><button className="dm-primary small" disabled={joined || full} onClick={() => onJoin(room.id, profile.room)}>{joined ? "참여 중 · 입금 상태를 확인하세요" : full ? "모집이 마감됐어요" : "참여하기"}</button><p className="dm-help">자동 입금 조회가 아니라 대표자가 실제 계좌 입금 내역을 확인한 뒤 수동 체크하는 방식입니다.</p></div>}
        </article>
      })}{visible.length === 0 && <div className="dm-empty">이 카테고리의 공동구매가 없습니다.</div>}</section>
    </main>
  </div>
}
