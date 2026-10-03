import EagleMascot from "../../components/EagleMascot"

interface Props {
  onNext: (screen: string) => void
}

export default function AdminSplashScreen({ onNext }: Props) {
  return (
    <div className="dm-screen admin-entry">
      <div className="admin-entry-logo"><EagleMascot size={76} /></div>
      <div className="admin-entry-wordmark">냉큼</div>
      <span className="dm-eyebrow">냉큼 FOR RA</span>
      <h1>기숙사 냉장고를<br />한눈에 관리하세요</h1>
      <p>승인된 RA 코드가 있어야 운영 화면에 들어갈 수 있습니다.</p>
      <div className="admin-entry-actions">
        <button className="dm-primary" onClick={() => onNext("adminCode")}>RA 코드로 로그인</button>
      </div>
      <small>연세대학교 기숙사 운영 프로토타입</small>
    </div>
  )
}
