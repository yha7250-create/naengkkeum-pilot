import { useState } from 'react'
import type { AdminManagedArea, ResidenceProfile } from '../../model'

interface Props {
  onNext: (screen: string) => void
  onBack: () => void
  residence: ResidenceProfile
  managedAreas: AdminManagedArea[]
  onSave: (patch: Partial<ResidenceProfile>) => void
  onSaveAreas: (areas: Omit<AdminManagedArea, 'id'>[]) => void
}

type DormItem = { dorm: string; building: string; floors: number[] }

const dorms = ['무악학사', '송도학사', '법현학사', '제중학사', 'SK국제학사']

const buildings: Record<string, string[] | null> = {
  '무악학사':   ['1관', '2관', '3관', '4관', '6관(우정관)'],
  '송도학사':   ['A동', 'B동', 'C동', 'D동', 'E동', 'F동', 'G동'],
  '법현학사':   null,
  '제중학사':   null,
  'SK국제학사': ['SK글로벌하우스', '인터내셔널하우스'],
}

const floorRange: Record<string, { min: number; max: number }> = {
  '무악학사':   { min: -2, max: 6 },
  '송도학사':   { min: 3,  max: 13 },
  '법현학사':   { min: -3, max: 7 },
  '제중학사':   { min: -3, max: 7 },
  'SK국제학사': { min: -3, max: 7 },
}

function getFloors(dorm: string) {
  const { min, max } = floorRange[dorm] ?? { min: 1, max: 8 }
  return Array.from({ length: max - min + 1 }, (_, i) => min + i).filter(f => f !== 0)
}
function floorLabel(f: number) { return f < 0 ? `B${Math.abs(f)}` : `${f}F` }

function groupAreas(areas: AdminManagedArea[]): DormItem[] {
  return areas.reduce<DormItem[]>((groups, area) => {
    const match = groups.find(item => item.dorm === area.dorm && item.building === area.building)
    if (match) match.floors.push(area.floor)
    else groups.push({ dorm: area.dorm, building: area.building, floors: [area.floor] })
    return groups
  }, []).map(item => ({ ...item, floors: [...item.floors].sort((a, b) => a - b) }))
}

export default function AdminDormSelectScreen({ onNext, onBack, residence, managedAreas, onSave, onSaveAreas }: Props) {
  const [expandedDorm, setExpandedDorm] = useState<string | null>('무악학사')
  const [expandedBuilding, setExpandedBuilding] = useState<string | null>(null)
  const [selections, setSelections] = useState<DormItem[]>(() => groupAreas(managedAreas))
  const [lastSelected, setLastSelected] = useState<Omit<AdminManagedArea, 'id'> | null>(null)

  const toggleFloor = (dorm: string, building: string, floor: number) => {
    const removing = selections.some(item => item.dorm === dorm && item.building === building && item.floors.includes(floor))
    setLastSelected(current => removing
      ? (current?.dorm === dorm && current.building === building && current.floor === floor ? null : current)
      : { dorm, building, floor })
    setSelections(prev => {
      const idx = prev.findIndex(s => s.dorm === dorm && s.building === building)
      if (idx === -1) return [...prev, { dorm, building, floors: [floor] }]
      const sel = prev[idx]
      const newFloors = sel.floors.includes(floor)
        ? sel.floors.filter(f => f !== floor)
        : [...sel.floors, floor].sort((a, b) => a - b)
      if (newFloors.length === 0) return prev.filter((_, i) => i !== idx)
      return prev.map((s, i) => i === idx ? { ...s, floors: newFloors } : s)
    })
  }

  const isFloorSelected = (dorm: string, building: string, floor: number) =>
    selections.some(s => s.dorm === dorm && s.building === building && s.floors.includes(floor))

  const totalFloors = selections.reduce((s, sel) => s + sel.floors.length, 0)

  function continueToLayout() {
    const areas = selections.flatMap(item => item.floors.map(floor => ({ dorm: item.dorm, building: item.building, floor })))
    const selectedPrimary = lastSelected && areas.some(area => area.dorm === lastSelected.dorm && area.building === lastSelected.building && area.floor === lastSelected.floor)
      ? lastSelected
      : areas[0]
    if (!selectedPrimary) return
    const orderedAreas = [selectedPrimary, ...areas.filter(area =>
      area.dorm !== selectedPrimary.dorm || area.building !== selectedPrimary.building || area.floor !== selectedPrimary.floor)]
    onSaveAreas(orderedAreas)
    onSave({ dorm: selectedPrimary.dorm, building: selectedPrimary.building, floor: selectedPrimary.floor, fridgeName: residence.fridgeName || '공용 냉장고 A' })
    onNext('adminFridgeSelect')
  }

  return (
    <div style={{ minHeight: '100%', background: '#F4F7F5', paddingBottom: 32 }}>
      {/* Header */}
      <div style={{ padding: '16px 24px 12px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={onBack} style={{ width: 36, height: 36, border: 'none', background: 'white', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 14L6 9L11 4" stroke="#1A2420" strokeWidth="2" strokeLinecap="round" /></svg>
        </button>
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 2 }}>
            <span style={{ background: '#F5C518', borderRadius: 6, padding: '1px 7px', fontFamily: "'Outfit', sans-serif", fontSize: 10, fontWeight: 700, color: '#1A2420' }}>RA</span>
          </div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 700, color: '#1A2420', margin: 0 }}>관리 구역 설정</h2>
          <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 12, color: '#6B8A7A', margin: '2px 0 0' }}>복수 선택 가능 · 관리할 동/층을 선택해주세요</p>
        </div>
      </div>

      <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {dorms.map(dorm => {
          const dormSels = selections.filter(s => s.dorm === dorm)
          const dormFloorCount = dormSels.reduce((s, d) => s + d.floors.length, 0)
          const isOpen = expandedDorm === dorm
          return (
            <div key={dorm} style={{ background: 'white', borderRadius: 16, border: `1.5px solid ${isOpen ? '#1B5E3B' : '#D4E4DA'}`, overflow: 'hidden' }}>
              {/* Dorm header */}
              <button
                onClick={() => setExpandedDorm(isOpen ? null : dorm)}
                style={{ width: '100%', padding: '14px 16px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}
              >
                <div style={{ width: 36, height: 36, background: isOpen ? '#E8F5EE' : '#F4F7F5', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>🏢</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700, color: '#1A2420', margin: 0 }}>{dorm}</p>
                  <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 11, color: '#6B8A7A', margin: '1px 0 0' }}>
                    {buildings[dorm] === null ? '단일 건물' : `${(buildings[dorm] as string[]).length}개 건물`}
                    {dormFloorCount > 0 && <span style={{ marginLeft: 6, color: '#1B5E3B', fontWeight: 600 }}>· {dormFloorCount}개 층 선택됨</span>}
                  </p>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                  <path d="M5 10L8 7L5 4" stroke="#B0C4BB" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>

              {isOpen && (
                <div style={{ borderTop: '1px solid #F0F4F2', padding: '10px 14px 14px' }}>
                  {buildings[dorm] === null ? (
                    /* 단일 건물: 바로 층 선택 */
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {getFloors(dorm).map(f => {
                        const active = isFloorSelected(dorm, dorm, f)
                        return (
                          <button
                            key={f}
                            onClick={() => toggleFloor(dorm, dorm, f)}
                            style={{
                              width: 42, height: 42,
                              background: active ? '#1B5E3B' : '#F4F7F5',
                              border: active ? '2px solid #1B5E3B' : '1.5px solid #D4E4DA',
                              borderRadius: 10,
                              fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
                              color: active ? 'white' : '#6B8A7A',
                              cursor: 'pointer',
                            }}
                          >
                            {floorLabel(f)}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    /* 복수 건물: 건물 아코디언 → 층 선택 */
                    (buildings[dorm] as string[]).map(bld => {
                      const bldSels = selections.find(s => s.dorm === dorm && s.building === bld)
                      const bldOpen = expandedBuilding === `${dorm}-${bld}`
                      const floors = getFloors(dorm)
                      return (
                        <div key={bld} style={{ marginBottom: 6 }}>
                          <button
                            onClick={() => setExpandedBuilding(bldOpen ? null : `${dorm}-${bld}`)}
                            style={{ width: '100%', padding: '10px 12px', background: bldOpen ? '#F0F7F4' : '#F8FAF9', borderRadius: 10, border: `1px solid ${bldOpen ? '#A8D4B8' : '#E4EDEA'}`, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left' }}
                          >
                            <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A2420', flex: 1 }}>{bld}</span>
                            {bldSels && bldSels.floors.length > 0 && (
                              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#1B5E3B', background: '#E8F5EE', padding: '2px 7px', borderRadius: 6 }}>
                                {bldSels.floors.map(floorLabel).join(', ')}
                              </span>
                            )}
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: bldOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>
                              <path d="M4 8.5L6.5 6L4 3.5" stroke="#B0C4BB" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          </button>
                          {bldOpen && (
                            <div style={{ padding: '10px 4px 4px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                              {floors.map(f => {
                                const active = isFloorSelected(dorm, bld, f)
                                return (
                                  <button
                                    key={f}
                                    onClick={() => toggleFloor(dorm, bld, f)}
                                    style={{
                                      width: 42, height: 42,
                                      background: active ? '#1B5E3B' : '#F4F7F5',
                                      border: active ? '2px solid #1B5E3B' : '1.5px solid #D4E4DA',
                                      borderRadius: 10,
                                      fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700,
                                      color: active ? 'white' : '#6B8A7A',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    {floorLabel(f)}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Summary */}
        {totalFloors > 0 && (
          <div style={{ background: '#E8F5EE', borderRadius: 16, padding: '14px 16px', border: '1.5px solid #B8D8C8', marginTop: 4 }}>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 600, color: '#1B5E3B', margin: '0 0 8px' }}>선택된 관리 구역 ({totalFloors}개 층)</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {selections.map(sel =>
                sel.floors.map(f => (
                  <span key={`${sel.dorm}-${sel.building}-${f}`} style={{ padding: '3px 10px', background: '#1B5E3B', borderRadius: 8, fontFamily: "'DM Mono', monospace", fontSize: 10, color: 'white' }}>
                    {sel.dorm}{buildings[sel.dorm] !== null ? ` ${sel.building}` : ''} {floorLabel(f)}
                  </span>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: '16px 24px 0' }}>
        <button
          onClick={continueToLayout}
          style={{ width: '100%', padding: '16px', background: totalFloors > 0 ? '#1B5E3B' : '#D4E4DA', border: 'none', borderRadius: 16, fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: totalFloors > 0 ? 'white' : '#B0C4BB', cursor: totalFloors > 0 ? 'pointer' : 'default' }}
        >
          냉장고 구조 등록 {totalFloors > 0 ? `(${totalFloors}개 층)` : ''}
        </button>
      </div>
    </div>
  )
}
