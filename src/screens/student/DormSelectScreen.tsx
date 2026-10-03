import { useState } from "react"
import type { ResidenceProfile } from "../../model"

interface Props {
  onNext: (screen: string) => void
  onBack: () => void
  initial?: ResidenceProfile
  onSave?: (patch: Partial<ResidenceProfile>) => void
}

const dorms = ["무악학사", "송도학사", "법현학사", "제중학사", "SK국제학사"]
const buildings: Record<string, string[]> = {
  무악학사: ["1관", "2관", "3관", "4관", "6관(우정관)"],
  송도학사: ["A동", "B동", "C동", "D동", "E동", "F동", "G동"],
  법현학사: ["본관"], 제중학사: ["본관"], SK국제학사: ["SK글로벌하우스", "인터내셔널하우스"],
}

export default function DormSelectScreen({ onNext, onBack, initial, onSave }: Props) {
  const [dorm, setDorm] = useState(initial?.dorm ?? "무악학사")
  const [building, setBuilding] = useState(initial?.building ?? "1관")
  const [floor, setFloor] = useState(initial?.floor ?? 3)
  const [fridgeName, setFridgeName] = useState(initial?.fridgeName ?? "공용 냉장고 B")

  function chooseDorm(value: string) {
    setDorm(value)
    setBuilding(buildings[value][0])
  }

  function next() {
    onSave?.({ school: "연세대학교", dorm, building, floor, fridgeName })
    onNext("profileRegister")
  }

  return (
    <div className="dm-screen onboarding-screen">
      <header className="simple-header"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div><span>STEP 2</span><h2>생활 위치 설정</h2></div></header>
      <main className="onboarding-content compact-form">
        <section><label className="dm-label">기숙사</label><div className="select-cards">{dorms.map(item => <button key={item} className={dorm === item ? "active" : ""} onClick={() => chooseDorm(item)}>{item}</button>)}</div></section>
        <section><label className="dm-label">동·관</label><div className="select-cards">{buildings[dorm].map(item => <button key={item} className={building === item ? "active" : ""} onClick={() => setBuilding(item)}>{item}</button>)}</div></section>
        <section><label className="dm-label">층</label><select className="dm-input" value={floor} onChange={event => setFloor(Number(event.target.value))}>{Array.from({ length: 13 }, (_, index) => index + 1).map(item => <option key={item} value={item}>{item}층</option>)}</select></section>
        <section><label className="dm-label">사용할 냉장고 이름</label><input className="dm-input" value={fridgeName} onChange={event => setFridgeName(event.target.value)} placeholder="예: 공용 냉장고 B" /></section>
        <div className="location-summary"><span>선택된 위치</span><strong>연세대학교 · {dorm} {building} {floor}층</strong><small>{fridgeName}</small></div>
        <button className="dm-primary" onClick={next}>이 위치 저장하고 다음</button>
      </main>
    </div>
  )
}
