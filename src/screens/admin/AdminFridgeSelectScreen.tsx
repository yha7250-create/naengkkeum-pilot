import { useState } from "react"
import EagleMascot from "../../components/EagleMascot"
import type { AdminManagedArea, FridgeMetric } from "../../model"

interface Props {
  fridges: FridgeMetric[]
  archivedFridges: FridgeMetric[]
  managedAreas: AdminManagedArea[]
  selectedId: string
  onSelect: (id: string) => void
  onAdd: (areaId: string, name: string) => string
  onArchive: (id: string) => boolean
  onRestore: (id: string) => boolean
  onBack: () => void
  onNext: (screen: string) => void
}

function areaLabel(area: AdminManagedArea) {
  const floor = area.floor < 0 ? `B${Math.abs(area.floor)}층` : `${area.floor}층`
  return `${area.dorm} · ${area.building} · ${floor}`
}

export default function AdminFridgeSelectScreen({ fridges, archivedFridges, managedAreas, selectedId, onSelect, onAdd, onArchive, onRestore, onBack, onNext }: Props) {
  const [adding, setAdding] = useState(fridges.length === 0)
  const [areaId, setAreaId] = useState(managedAreas[0]?.id ?? "")
  const [name, setName] = useState("")
  const [notice, setNotice] = useState("")
  const [archiveTarget, setArchiveTarget] = useState<FridgeMetric | null>(null)
  const [showArchive, setShowArchive] = useState(false)

  function choose(id: string) {
    onSelect(id)
    onNext("adminDashboard")
  }

  function addFridge() {
    if (!areaId || !name.trim()) return setNotice("설치 위치와 냉장고 이름을 입력해 주세요.")
    const id = onAdd(areaId, name)
    if (!id) return setNotice("같은 위치에 동일한 이름의 냉장고가 이미 있습니다.")
    setNotice("")
    onNext("adminFridgeConfig")
  }

  function archiveFridge() {
    if (!archiveTarget) return
    if (!onArchive(archiveTarget.id)) {
      setNotice("마지막 냉장고는 종료할 수 없어요. 새 냉장고를 먼저 등록해 주세요.")
      setArchiveTarget(null)
      return
    }
    setNotice(`${archiveTarget.label} 운영을 종료했습니다. 기록은 보관함에서 복구할 수 있어요.`)
    setArchiveTarget(null)
  }

  return (
    <div className="dm-screen admin-fridge-select-screen">
      <header className="dm-header admin-header">
        <button className="dm-icon-button dark" onClick={onBack} aria-label="뒤로 가기">‹</button>
        <div><p>관리 구역의 냉장고를 한눈에</p><h2>관리 냉장고</h2></div>
        <EagleMascot size={44} />
      </header>
      <main className="dm-stack">
        <section className="ra-fridge-overview">
          <div><span>등록 냉장고</span><strong>{fridges.length}<small>대</small></strong></div>
          <div><span>관리 구역</span><strong>{managedAreas.length}<small>곳</small></strong></div>
          <button onClick={() => setAdding(value => !value)}>{adding ? "닫기" : "+ 냉장고 등록"}</button>
        </section>

        {adding && <section className="ra-add-fridge-card">
          <div className="dm-section-title"><div><span className="dm-eyebrow">NEW FRIDGE</span><h3>냉장고 이름 등록</h3></div><span className="dm-badge green">RA 전용</span></div>
          <label><span>설치 위치</span><select className="dm-input" value={areaId} onChange={event => setAreaId(event.target.value)}>{managedAreas.map(area => <option key={area.id} value={area.id}>{areaLabel(area)}</option>)}</select></label>
          <label><span>냉장고 이름</span><input className="dm-input" value={name} onChange={event => setName(event.target.value)} placeholder="예: 중앙 냉장고, 냉장고 B" maxLength={24} /></label>
          <p>이름을 등록한 다음 실제 선반·문칸·냉동실 구조를 설정합니다.</p>
          {notice && <div className="dm-error">{notice}</div>}
          <button className="dm-primary" onClick={addFridge}>이름 저장하고 구조 설정 →</button>
        </section>}

        <div className="dm-notice fridge-select-notice"><strong>냉장고별로 관리 내용이 분리돼요</strong><span>선택한 냉장고를 기준으로 현황, 공지, 공동 목표와 구조 설정이 표시됩니다.</span></div>
        <div className="admin-fridge-list">
          {fridges.map(fridge => {
            const percent = Math.round(fridge.used / fridge.capacity * 100)
            const selected = fridge.id === selectedId
            return (
              <article className={`admin-fridge-select-card ${selected ? "selected" : ""}`} key={fridge.id}>
                <button className="fridge-card-main" onClick={() => choose(fridge.id)}>
                  <span className={`fridge-status-dot ${percent >= 90 ? "danger" : percent >= 75 ? "warn" : "safe"}`} />
                  <div className="grow"><small>{fridge.dorm ? `${fridge.dorm} · ` : ""}{fridge.building} · {fridge.floor}</small><strong>{fridge.label}</strong><div className="dm-progress"><i style={{ width: `${percent}%` }} /></div><p>{fridge.used}/{fridge.capacity}칸 · 신고 {fridge.reports}건 · 기한 경과 {fridge.expired}개</p></div>
                  <div className="fridge-select-percent"><b>{percent}%</b><span>{selected ? "선택 중" : "확인"}</span></div>
                </button>
                <div className="fridge-card-actions">
                  <button className="fridge-card-config" onClick={() => { onSelect(fridge.id); onNext("adminFridgeConfig") }}>이름·구조 수정</button>
                  <button className="fridge-card-archive" onClick={() => setArchiveTarget(fridge)}>운영 종료</button>
                </div>
              </article>
            )
          })}
          {!fridges.length && <div className="ra-empty-fridge"><span>🧊</span><strong>등록된 냉장고가 없어요</strong><p>위에서 이름과 위치를 등록해 주세요.</p></div>}
        </div>

        {archivedFridges.length > 0 && <section className="archived-fridges">
          <button className="archived-fridges-toggle" onClick={() => setShowArchive(value => !value)}><span>종료된 냉장고 {archivedFridges.length}대</span><b>{showArchive ? "접기" : "보기"}</b></button>
          {showArchive && <div>{archivedFridges.map(fridge => <article key={fridge.id}><span><small>{fridge.dorm} · {fridge.building} · {fridge.floor}</small><strong>{fridge.label}</strong></span><button onClick={() => { onRestore(fridge.id); setNotice(`${fridge.label} 운영을 다시 시작했습니다.`) }}>복구</button></article>)}</div>}
        </section>}
      </main>
      {archiveTarget && <div className="dm-modal-backdrop" role="presentation" onClick={() => setArchiveTarget(null)}><section className="dm-modal archive-confirm" role="dialog" aria-modal="true" aria-label="냉장고 운영 종료 확인" onClick={event => event.stopPropagation()}><span className="archive-illustration">🧊</span><h3>{archiveTarget.label} 운영을 종료할까요?</h3><p>학생 화면에서는 즉시 숨겨지고 새 음식 등록도 막힙니다. 기존 음식·신고·통계 기록은 지우지 않고 보관하며 나중에 복구할 수 있어요.</p><div><button onClick={() => setArchiveTarget(null)}>취소</button><button className="danger" onClick={archiveFridge}>운영 종료</button></div></section></div>}
    </div>
  )
}
