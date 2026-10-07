import { useEffect, useMemo, useState } from "react"
import type { FridgeMetric, ResidenceProfile } from "../../model"

interface Props {
  onNext: (screen: string) => void
  onBack: () => void
  initial?: ResidenceProfile
  onSave?: (patch: Partial<ResidenceProfile>) => void
  fridges: FridgeMetric[]
}

export const dorms = ["무악학사", "송도학사", "법현학사", "제중학사", "SK국제학사"]
export const buildings: Record<string, string[]> = {
  무악학사: ["1관", "2관", "3관", "4관", "6관(우정관)"],
  송도학사: ["A동", "B동", "C동", "D동", "E동", "F동", "G동"],
  법현학사: ["본관"], 제중학사: ["본관"], SK국제학사: ["SK글로벌하우스", "인터내셔널하우스"],
}

export function floorNumber(label: string) {
  const value = Number(label.replace(/\D/g, "")) || 1
  return label.trim().toUpperCase().startsWith("B") ? -value : value
}

export default function DormSelectScreen({ onNext, onBack, initial, onSave, fridges }: Props) {
  const [dorm, setDorm] = useState(initial?.dorm ?? "무악학사")
  const [building, setBuilding] = useState(initial?.building ?? "1관")
  const [floor, setFloor] = useState(initial?.floor ?? 3)
  const [fridgeId, setFridgeId] = useState(initial?.fridgeId ?? "")
  const [error, setError] = useState("")
  const availableFridges = useMemo(() => fridges.filter(fridge => !fridge.archivedAt
    && (fridge.dorm ?? "무악학사") === dorm
    && fridge.building === building
    && floorNumber(fridge.floor) === floor), [fridges, dorm, building, floor])
  const selectedFridge = availableFridges.find(fridge => fridge.id === fridgeId) ?? availableFridges[0]

  useEffect(() => {
    if (availableFridges.some(fridge => fridge.id === fridgeId)) return
    const legacyMatch = availableFridges.find(fridge => initial?.fridgeName.includes(fridge.label) || fridge.label.includes(initial?.fridgeName ?? ""))
    setFridgeId(legacyMatch?.id ?? availableFridges[0]?.id ?? "")
  }, [availableFridges, fridgeId, initial?.fridgeName])

  function chooseDorm(value: string) {
    setDorm(value)
    setBuilding(buildings[value][0])
    setError("")
  }

  function next() {
    if (!selectedFridge) return setError("이 위치에는 RA가 등록한 냉장고가 없습니다. 담당 RA에게 먼저 등록을 요청해 주세요.")
    onSave?.({ school: "연세대학교", dorm, building, floor, fridgeId: selectedFridge.id, fridgeName: selectedFridge.label })
    onNext("profileRegister")
  }

  return (
    <div className="dm-screen onboarding-screen">
      <header className="simple-header"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div><span>STEP 2</span><h2>생활 위치 설정</h2></div></header>
      <main className="onboarding-content compact-form">
        <section><label className="dm-label">기숙사</label><div className="select-cards">{dorms.map(item => <button key={item} className={dorm === item ? "active" : ""} onClick={() => chooseDorm(item)}>{item}</button>)}</div></section>
        <section><label className="dm-label">동·관</label><div className="select-cards">{buildings[dorm].map(item => <button key={item} className={building === item ? "active" : ""} onClick={() => setBuilding(item)}>{item}</button>)}</div></section>
        <section><label className="dm-label">층</label><select className="dm-input" value={floor} onChange={event => setFloor(Number(event.target.value))}>{Array.from({ length: 13 }, (_, index) => index + 1).map(item => <option key={item} value={item}>{item}층</option>)}</select></section>
        <section><label className="dm-label">RA가 등록한 냉장고</label>{availableFridges.length ? <select className="dm-input" value={selectedFridge?.id ?? ""} onChange={event => { setFridgeId(event.target.value); setError("") }}>{availableFridges.map(fridge => <option key={fridge.id} value={fridge.id}>{fridge.label}</option>)}</select> : <div className="dm-notice"><strong>등록된 냉장고 없음</strong><span>학생은 냉장고 이름이나 구조를 직접 만들 수 없습니다.</span></div>}</section>
        <div className="location-summary"><span>선택된 위치</span><strong>연세대학교 · {dorm} {building} {floor}층</strong><small>{selectedFridge?.label ?? "RA 등록 대기"}</small></div>
        {error && <p className="dm-error">{error}</p>}
        <button className="dm-primary" onClick={next} disabled={!selectedFridge}>이 위치 저장하고 다음</button>
      </main>
    </div>
  )
}
