import { useState } from "react"
import type { AdminAccessCode } from "../../model"

interface Props {
  onBack: () => void
  codes: AdminAccessCode[]
  onIssue: (label: string) => AdminAccessCode
  onDisable: (id: string) => void
}

export default function AdminCodeIssueScreen({ onBack, codes, onIssue, onDisable }: Props) {
  const [label, setLabel] = useState("")
  const [issued, setIssued] = useState<AdminAccessCode | null>(null)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  function issue() {
    if (!label.trim()) return setError("코드 사용 대상을 입력해 주세요.")
    setIssued(onIssue(label))
    setError("")
    setLabel("")
    setCopied(false)
  }

  async function copyCode() {
    if (!issued) return
    try { await navigator.clipboard.writeText(issued.code); setCopied(true) } catch { setError("복사할 수 없습니다. 코드를 직접 선택해 주세요.") }
  }

  return (
    <div className="dm-screen">
      <header className="dm-header admin-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>총괄 RA 전용</p><h2>RA 접근 코드 발행</h2></div><span className="dm-step admin">ISSUE</span></header>
      <main className="dm-stack admin-code-page">
        <section className="dm-card">
          <div className="dm-notice"><strong>로그인한 RA만 발행 가능</strong><span>새 코드는 한 번 사용하면 자동으로 사용 처리됩니다.</span></div>
          <label className="dm-label spaced" htmlFor="code-label">코드 사용 대상</label>
          <input id="code-label" className="dm-input" value={label} onChange={event => setLabel(event.target.value)} placeholder="예: 1관 3층 야간 RA" />
          <button className="dm-primary issue-button" onClick={issue}>일회용 코드 만들기</button>
        </section>
        {error && <p className="dm-error">{error}</p>}
        {issued && <section className="issued-code"><span>새 접근 코드</span><strong>{issued.code}</strong><p>대상: {issued.label}</p><small>이 코드는 로그인 한 번에만 사용할 수 있습니다.</small><button onClick={copyCode}>{copied ? "복사됨 ✓" : "코드 복사"}</button></section>}
        <section><div className="dm-section-title"><div><span className="dm-eyebrow">CODE LOG</span><h3>최근 발행 기록</h3></div></div><div className="dm-list">{codes.slice(0, 5).map(item => <article className="code-log" key={item.id}><div><strong>{item.code}</strong><small>{item.label}</small></div>{item.active && !item.usedAt ? <button onClick={() => onDisable(item.id)}>회수</button> : <span className="used">{item.usedAt ? `${item.usedBy} 사용` : "회수됨"}</span>}</article>)}</div></section>
        <p className="prototype-note">Supabase 파일럿 저장을 연결하면 코드 발행·사용 기록이 두 RA에게 공유됩니다. 정식 운영에서는 학교 계정과 RA 임명 명단을 추가로 연동해야 합니다.</p>
      </main>
    </div>
  )
}
