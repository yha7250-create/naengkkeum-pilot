import { useEffect, useMemo, useState } from "react"
import type { FridgeMetric, ResidenceProfile, UserProfile } from "../../model"
import { buildings, dorms, floorNumber } from "./DormSelectScreen"

interface Props {
  onBack: () => void
  profile: UserProfile
  residence: ResidenceProfile
  fridges: FridgeMetric[]
  activeFoodCount: number
  onSaveProfile: (patch: Partial<UserProfile>) => void
  onSaveResidence: (patch: Partial<ResidenceProfile>) => void
}

function normalizeRoom(value: string) {
  const number = value.trim().replace(/호$/, "")
  return number ? `${number}호` : ""
}

export default function ProfileEditScreen({ onBack, profile, residence, fridges, activeFoodCount, onSaveProfile, onSaveResidence }: Props) {
  const [form, setForm] = useState<UserProfile>(profile)
  const [dorm, setDorm] = useState(residence.dorm)
  const [building, setBuilding] = useState(residence.building)
  const [floor, setFloor] = useState(residence.floor)
  const [fridgeId, setFridgeId] = useState(residence.fridgeId ?? "")
  const [error, setError] = useState("")

  const availableFridges = useMemo(() => fridges.filter(fridge => !fridge.archivedAt
    && (fridge.dorm ?? "무악학사") === dorm
    && fridge.building === building
    && floorNumber(fridge.floor) === floor), [fridges, dorm, building, floor])
  const selectedFridge = availableFridges.find(fridge => fridge.id === fridgeId) ?? availableFridges[0]

  useEffect(() => {
    if (availableFridges.some(fridge => fridge.id === fridgeId)) return
    setFridgeId(availableFridges[0]?.id ?? "")
  }, [availableFridges, fridgeId])

  const normalizedRoom = normalizeRoom(form.room)
  const storageChanged = dorm !== residence.dorm
    || building !== residence.building
    || floor !== residence.floor
    || selectedFridge?.id !== residence.fridgeId
    || normalizedRoom !== normalizeRoom(profile.room)

  function updateProfile(key: keyof UserProfile, value: string) {
    setForm(current => ({ ...current, [key]: value }))
    setError("")
  }

  function chooseDorm(value: string) {
    setDorm(value)
    setBuilding(buildings[value][0])
    setError("")
  }

  function save() {
    const roomNumber = form.room.trim().replace(/호$/, "")
    if (!form.name.trim()) return setError("이름 또는 닉네임을 입력해 주세요.")
    if (!/^\d{3,4}$/.test(roomNumber)) return setError("호수는 302처럼 숫자 3~4자리로 입력해 주세요.")
    if (!selectedFridge) return setError("이 위치에는 RA가 등록한 냉장고가 없습니다.")
    if (storageChanged && activeFoodCount > 0) return setError(`등록된 음식 ${activeFoodCount}개를 먼저 소비 또는 폐기 처리한 뒤 거주 정보를 변경해 주세요.`)

    onSaveProfile({ ...form, name: form.name.trim(), studentId: form.studentId.trim(), phone: form.phone.trim(), room: `${roomNumber}호` })
    onSaveResidence({ school: "연세대학교", dorm, building, floor, fridgeId: selectedFridge.id, fridgeName: selectedFridge.label })
    onBack()
  }

  return (
    <div className="dm-screen onboarding-screen profile-edit-screen">
      <header className="simple-header"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div><span>MY PROFILE</span><h2>내 정보 수정</h2></div></header>
      <main className="onboarding-content compact-form">
        <div className="profile-edit-guide"><span>🏠</span><div><strong>학기마다 새 거주지로 변경할 수 있어요</strong><small>보관 중인 음식이 있다면 먼저 처리해야 냉장고 연결이 안전하게 바뀝니다.</small></div></div>

        <section><label className="dm-label" htmlFor="edit-name">이름 또는 닉네임</label><input id="edit-name" className="dm-input" value={form.name} onChange={event => updateProfile("name", event.target.value)} maxLength={20} /></section>
        <section><label className="dm-label" htmlFor="edit-student-id">학번 (선택)</label><input id="edit-student-id" className="dm-input" value={form.studentId} onChange={event => updateProfile("studentId", event.target.value)} /></section>
        <section><label className="dm-label" htmlFor="edit-phone">전화번호 (선택)</label><input id="edit-phone" className="dm-input" type="tel" value={form.phone} onChange={event => updateProfile("phone", event.target.value)} /></section>
        <section><label className="dm-label" htmlFor="edit-room">호수</label><input id="edit-room" className="dm-input" inputMode="numeric" value={form.room} onChange={event => updateProfile("room", event.target.value)} placeholder="302호" /></section>

        <div className="profile-edit-divider"><span>거주지와 사용할 냉장고</span></div>
        <section><label className="dm-label">기숙사</label><div className="select-cards">{dorms.map(item => <button type="button" key={item} className={dorm === item ? "active" : ""} onClick={() => chooseDorm(item)}>{item}</button>)}</div></section>
        <section><label className="dm-label">동·관</label><div className="select-cards">{buildings[dorm].map(item => <button type="button" key={item} className={building === item ? "active" : ""} onClick={() => { setBuilding(item); setError("") }}>{item}</button>)}</div></section>
        <section><label className="dm-label">층</label><select className="dm-input" value={floor} onChange={event => { setFloor(Number(event.target.value)); setError("") }}>{Array.from({ length: 13 }, (_, index) => index + 1).map(item => <option key={item} value={item}>{item}층</option>)}</select></section>
        <section><label className="dm-label">RA가 등록한 냉장고</label>{availableFridges.length ? <select className="dm-input" value={selectedFridge?.id ?? ""} onChange={event => { setFridgeId(event.target.value); setError("") }}>{availableFridges.map(fridge => <option key={fridge.id} value={fridge.id}>{fridge.label}</option>)}</select> : <div className="dm-notice"><strong>등록된 냉장고 없음</strong><span>담당 RA가 냉장고를 등록한 뒤 선택할 수 있습니다.</span></div>}</section>

        {storageChanged && activeFoodCount > 0 && <div className="profile-food-warning"><strong>⚠️ 거주지 변경 잠김</strong><span>현재 내 음식 {activeFoodCount}개가 기존 냉장고에 연결되어 있어요.</span></div>}
        {error && <p className="dm-error">{error}</p>}
        <button className="dm-primary" onClick={save} disabled={!selectedFridge}>변경 내용 저장</button>
      </main>
    </div>
  )
}
