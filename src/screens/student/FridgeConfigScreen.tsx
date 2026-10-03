import { useState } from "react"
import DynamicFridge, { type FridgeZone } from "../../components/DynamicFridge"
import type { FridgeLayout, ResidenceProfile } from "../../model"

interface Props {
  initial: FridgeLayout
  residence: ResidenceProfile
  onBack: () => void
  onSave: (layout: FridgeLayout) => void
  onNext: () => void
  adminMode?: boolean
  fridgeId?: string
  onSaveName?: (id: string, name: string) => boolean
}

const controls: { key: keyof FridgeLayout; zone: FridgeZone; icon: string; label: string; help: string; min: number; max: number }[] = [
  { key: "fridgeShelves", zone: "냉장실", icon: "🥬", label: "냉장 선반", help: "큰 공용 냉장고 선반", min: 3, max: 10 },
  { key: "drawers", zone: "냉장실", icon: "🥕", label: "신선 서랍", help: "채소·과일 보관칸", min: 0, max: 4 },
  { key: "doorPockets", zone: "냉장실", icon: "🥛", label: "냉장 문칸", help: "문 안쪽 수납칸", min: 0, max: 8 },
  { key: "freezerShelves", zone: "냉동고", icon: "🧊", label: "냉동 선반", help: "냉동고 내부 선반", min: 2, max: 8 },
  { key: "freezerDoorPockets", zone: "냉동고", icon: "🍨", label: "냉동 문칸", help: "냉동고 문 안쪽 수납칸", min: 0, max: 6 },
]

export default function FridgeConfigScreen({ initial, residence, onBack, onSave, onNext, adminMode = false, fridgeId, onSaveName }: Props) {
  const [layout, setLayout] = useState(initial)
  const [zone, setZone] = useState<FridgeZone>("냉장실")
  const [fridgeName, setFridgeName] = useState(residence.fridgeName.replace(/^공용\s*/, ""))
  const [error, setError] = useState("")

  function change(key: keyof FridgeLayout, amount: number, min: number, max: number) {
    setLayout(current => ({ ...current, [key]: Math.max(min, Math.min(max, current[key] + amount)) }))
  }

  function save() {
    if (adminMode && !fridgeName.trim()) return setError("냉장고 이름을 입력해 주세요.")
    onSave(layout)
    if (adminMode && fridgeId && onSaveName && !onSaveName(fridgeId, fridgeName)) return setError("냉장고 이름을 저장하지 못했습니다.")
    onNext()
  }

  return (
    <div className={`dm-screen ${adminMode ? "ra-config-screen" : ""}`}>
      <header className="dm-header admin-header">
        <button className="dm-icon-button dark" onClick={onBack} aria-label="뒤로 가기">‹</button>
        <div><p>{residence.dorm} {residence.building} {residence.floor}층 · RA 전용</p><h2>냉장고 구조 등록</h2></div>
        <span className="dm-step admin">RA ONLY</span>
      </header>
      <main className="dm-stack">
        <div className="dm-notice ra-only-notice"><strong>승인된 RA만 구조를 등록·수정할 수 있어요</strong><span>실제 냉장고를 확인해 선반·냉동실·서랍·도어 수를 맞춰주세요. 학생은 등록된 구조에서 위치만 선택합니다.</span></div>
        {adminMode && <section className="fridge-name-editor"><div><span className="dm-eyebrow">FRIDGE NAME</span><h3>냉장고 이름</h3><p>학생 화면과 공지에 표시되는 이름이에요.</p></div><input className="dm-input large" value={fridgeName} onChange={event => { setFridgeName(event.target.value); setError("") }} placeholder="예: 중앙 냉장고 A" maxLength={24} /></section>}
        <div className="fridge-zone-switch config-zone-switch">
          <button className={zone === "냉장실" ? "active fridge" : ""} onClick={() => setZone("냉장실")}><span>❄️</span><strong>냉장실</strong><small>{layout.fridgeShelves + layout.drawers + layout.doorPockets}칸</small></button>
          <button className={zone === "냉동고" ? "active freezer" : ""} onClick={() => setZone("냉동고")}><span>🧊</span><strong>냉동고</strong><small>{layout.freezerShelves + (layout.freezerDoorPockets ?? 0)}칸</small></button>
        </div>
        <section className="layout-builder">
          {controls.filter(control => control.zone === zone).map(control => (
            <div className="layout-control" key={control.key}>
              <span className="layout-control-icon">{control.icon}</span>
              <div className="grow"><strong>{control.label}</strong><small>{control.help}</small></div>
              <div className="stepper"><button onClick={() => change(control.key, -1, control.min, control.max)} disabled={layout[control.key] <= control.min}>−</button><b>{layout[control.key]}</b><button onClick={() => change(control.key, 1, control.min, control.max)} disabled={layout[control.key] >= control.max}>＋</button></div>
            </div>
          ))}
        </section>
        <section className="fridge-preview-card">
          <div className="dm-section-title"><div><span className="dm-eyebrow">LIVE PREVIEW</span><h3>공용 냉장고 도식</h3></div><span className="dm-badge green">RA 설정</span></div>
          <DynamicFridge layout={layout} zoneView={zone} />
          <p>저장하면 학생 화면에도 같은 구조가 읽기 전용으로 표시됩니다. 냉장실과 냉동고를 각각 확인해 주세요.</p>
        </section>
        {error && <p className="dm-error">{error}</p>}
        <button className="dm-primary" onClick={save}>{adminMode ? "이름과 구조 저장하기" : "이 구조로 저장하기"}</button>
      </main>
    </div>
  )
}
