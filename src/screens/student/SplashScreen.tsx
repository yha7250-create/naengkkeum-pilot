import EagleMascot from "../../components/EagleMascot"

interface Props { onNext: (screen: string) => void }

export default function SplashScreen({ onNext }: Props) {
  return <div className="dm-screen cute-splash">
    <span className="splash-doodle one">✦</span><span className="splash-doodle two">●</span><span className="splash-doodle three">⌁</span>
    <div className="splash-logo-card"><EagleMascot size={112} /><i>fresh!</i></div>
    <div className="splash-wordmark"><span>냉</span><b>큼</b></div>
    <p className="splash-subtitle">기숙사 냉장고를<br /><strong>냉큼, 깔끔하게</strong> 같이 관리해요</p>
    <div className="splash-mini-icons"><span>🍱</span><span>❄</span><span>🌱</span><span>🏠</span></div>
    <div className="splash-actions"><button onClick={() => onNext("schoolSelect")}>학생으로 시작하기 <b>→</b></button><small>연세대학교 기숙사 입주생 전용</small></div>
  </div>
}
