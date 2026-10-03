import type { ResidenceProfile } from "../../model"

interface Props {
  onNext: (screen: string) => void
  onBack: () => void
  nextScreen?: string
  residence?: ResidenceProfile
  onSave?: (patch: Partial<ResidenceProfile>) => void
}

export default function SchoolSelectScreen({ onNext, onBack, nextScreen = "dormSelect", onSave }: Props) {
  function select() {
    onSave?.({ school: "연세대학교" })
    onNext(nextScreen)
  }

  return (
    <div className="dm-screen onboarding-screen">
      <header className="simple-header"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div><span>STEP 1</span><h2>학교 확인</h2></div></header>
      <main className="onboarding-content">
        <div className="yonsei-mark">Y</div>
        <h3>연세대학교</h3>
        <p>현재 냉큼 시범 운영 대상은 연세대학교 기숙사입니다.</p>
        <div className="school-confirm-card"><div><strong>연세대학교</strong><small>신촌·국제캠퍼스 기숙사</small></div><span>운영 중</span></div>
        <div className="dm-notice"><strong>학교 선택을 단순화했어요</strong><span>다른 학교 검색과 선택 기능은 시범 운영 이후 추가됩니다.</span></div>
        <button className="dm-primary" onClick={select}>연세대학교로 계속하기</button>
      </main>
    </div>
  )
}
