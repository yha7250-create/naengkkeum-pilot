import { useState } from "react"
import type { StoragePolicy } from "../../model"

interface Props {
  initial: StoragePolicy
  onBack: () => void
  onSave: (policy: StoragePolicy) => void
}

const controls: { key: keyof StoragePolicy; icon: string; label: string; help: string; min: number; max: number }[] = [
  { key: "totalUnits", icon: "📦", label: "1인 전체 한도", help: "냉장·냉동 합산 최대 공간점수", min: 4, max: 15 },
  { key: "fridgeUnits", icon: "❄️", label: "냉장실 한도", help: "한 사람이 냉장실에서 사용할 수 있는 양", min: 2, max: 10 },
  { key: "freezerUnits", icon: "🧊", label: "냉동고 한도", help: "냉동고 장기 독점을 막는 별도 한도", min: 1, max: 8 },
  { key: "perSlotUnits", icon: "🗂️", label: "같은 선반 한도", help: "한 선반에 몰아서 보관할 수 있는 양", min: 1, max: 4 },
]

export default function AdminStoragePolicyScreen({ initial, onBack, onSave }: Props) {
  const [policy, setPolicy] = useState(initial)
  const [saved, setSaved] = useState(false)
  function change(key: keyof StoragePolicy, amount: number, min: number, max: number) {
    setPolicy(current => ({ ...current, [key]: Math.max(min, Math.min(max, current[key] + amount)) }))
    setSaved(false)
  }
  function save() {
    const normalized = { ...policy, fridgeUnits: Math.min(policy.fridgeUnits, policy.totalUnits), freezerUnits: Math.min(policy.freezerUnits, policy.totalUnits), perSlotUnits: Math.min(policy.perSlotUnits, policy.totalUnits) }
    setPolicy(normalized)
    onSave(normalized)
    setSaved(true)
  }
  return <div className="dm-screen storage-policy-screen"><header className="dm-header admin-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>RA 전용 운영 정책</p><h2>개인 보관 한도</h2></div><span className="dm-step admin">RA</span></header><main className="dm-stack"><section className="policy-explanation"><strong>개수가 아니라 실제 부피로 제한해요</strong><p>소형 1점·중형 2점·대형 3점으로 계산합니다. 공동 등록도 대표 등록자의 공간 사용량에 전부 포함해 이름만 늘려 한도를 피하는 것을 막습니다.</p></section><section className="layout-builder policy-builder">{controls.map(control => <div className="layout-control" key={control.key}><span className="layout-control-icon">{control.icon}</span><div className="grow"><strong>{control.label}</strong><small>{control.help}</small></div><div className="stepper"><button onClick={() => change(control.key, -1, control.min, control.max)} disabled={policy[control.key] <= control.min}>−</button><b>{policy[control.key]}</b><button onClick={() => change(control.key, 1, control.min, control.max)} disabled={policy[control.key] >= control.max}>＋</button></div></div>)}</section><section className="policy-preview"><span>학생에게 적용되는 규칙</span><div><b>전체 {policy.totalUnits}</b><b>냉장 {policy.fridgeUnits}</b><b>냉동 {policy.freezerUnits}</b><b>한 선반 {policy.perSlotUnits}</b></div><p>한도를 넘으면 음식 등록이 차단되고 기존 음식을 소비·폐기하거나 다른 선반을 선택하라는 안내가 표시됩니다.</p></section>{saved && <p className="dm-success">새 보관 한도가 학생 음식 등록 화면에 적용됐습니다.</p>}<button className="dm-primary" onClick={save}>보관 정책 저장하기</button></main></div>
}
