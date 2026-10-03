import { useState } from "react"
import type { UserProfile } from "../../model"

interface Props {
  onNext: (screen: string) => void
  onBack: () => void
  nextScreen?: string
  initial?: UserProfile
  onSave?: (patch: Partial<UserProfile>) => void
}

export default function ProfileRegisterScreen({ onNext, onBack, nextScreen = "fridge", initial, onSave }: Props) {
  const [form, setForm] = useState<UserProfile>(initial ?? { name: "", studentId: "", phone: "", room: "" })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState("")

  function change(key: keyof UserProfile, value: string) {
    setForm(current => ({ ...current, [key]: value }))
  }

  function submit() {
    if (!form.name.trim() || !form.room.trim()) {
      setError("이름(또는 닉네임)과 호수는 반드시 입력해 주세요.")
      return
    }
    if (!agreed) {
      setError("필수 개인정보 이용에 동의해야 합니다.")
      return
    }
    onSave?.(form)
    onNext(nextScreen)
  }

  return (
    <div className="dm-screen onboarding-screen">
      <header className="simple-header"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div><span>STEP 3</span><h2>내 정보 등록</h2></div></header>
      <main className="onboarding-content compact-form">
        {([
          ["name", "이름 또는 닉네임", "연세냉큼이", "text"],
          ["studentId", "학번 (선택)", "입력하지 않아도 돼요", "text"],
          ["phone", "전화번호 (선택)", "입력하지 않아도 돼요", "tel"],
          ["room", "호수", "302호", "text"],
        ] as const).map(([key, label, placeholder, type]) => <section key={key}><label className="dm-label" htmlFor={key}>{label}</label><input id={key} className="dm-input" type={type} value={form[key]} onChange={event => change(key, event.target.value)} placeholder={placeholder} /></section>)}
        <label className="consent-card"><input type="checkbox" checked={agreed} onChange={event => setAgreed(event.target.checked)} /><div><strong>파일럿 정보 저장 동의</strong><small>냉장고 소유권 구분과 테스트 기록에만 사용됩니다.</small></div></label>
        {error && <p className="dm-error">{error}</p>}
        <button className="dm-primary" onClick={submit}>내 정보 저장하고 시작하기</button>
      </main>
    </div>
  )
}
