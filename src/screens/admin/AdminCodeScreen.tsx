import { useState } from "react"
import EagleMascot from "../../components/EagleMascot"

interface Props {
  onBack: () => void
  onSuccess: () => void
  verify: (code: string, adminName: string) => boolean
}

export default function AdminCodeScreen({ onBack, onSuccess, verify }: Props) {
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  function submit() {
    if (!name.trim()) return setError("RA 이름을 입력해 주세요.")
    if (!code.trim()) return setError("발급받은 코드를 입력해 주세요.")
    if (!verify(code, name)) return setError("사용할 수 없는 코드입니다. 이미 사용됐거나 코드가 올바르지 않습니다.")
    setError("")
    onSuccess()
  }

  return (
    <div className="dm-screen admin-login-screen">
      <header className="dm-header admin-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>승인된 RA 전용</p><h2>RA 로그인</h2></div><span className="dm-step admin">RA</span></header>
      <main className="dm-stack admin-code-page">
        <section className="admin-login-brand"><div><EagleMascot size={60} /></div><span><b>냉큼</b><small>Residence Assistant</small></span></section>
        <section className="admin-lock-card"><div>🔐</div><h3>RA 일회용 코드를 확인해요</h3><p>발행된 코드는 한 번만 사용할 수 있고, 사용한 사람의 이름과 시간이 기록됩니다.</p></section>
        <section className="dm-card">
          <label className="dm-label" htmlFor="admin-name">RA 이름</label>
          <input id="admin-name" className="dm-input" value={name} onChange={event => setName(event.target.value)} placeholder="예: 김관리 RA" />
          <label className="dm-label spaced" htmlFor="admin-code">접근 코드</label>
          <input id="admin-code" className="dm-input code-input" value={code} onChange={event => setCode(event.target.value.toUpperCase())} placeholder="RA-XXXX-000" autoCapitalize="characters" />
          <p className="dm-help demo-code">프로토타입 확인용 최초 코드: <b>RA-2026</b></p>
        </section>
        {error && <p className="dm-error">{error}</p>}
        <button className="dm-primary" onClick={submit}>RA 인증하고 관리 시작</button>
      </main>
    </div>
  )
}
