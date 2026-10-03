import EagleMascot from "../../components/EagleMascot"
import type { ResidenceProfile, UserProfile } from "../../model"

interface Props {
  onBack: () => void
  onNext: (screen: string) => void
  profile: UserProfile
  residence: ResidenceProfile
}

export default function MenuScreen({ onBack, onNext, profile, residence }: Props) {
  const items = [
    { icon: "▣", label: "내 음식", sub: "내 음식과 공동 등록 음식 모아보기", screen: "myFoods" },
    { icon: "🍱", label: "음식 등록", sub: "사진과 보관 위치를 등록해요", screen: "addFood" },
    { icon: "🛒", label: "공동구매·정산", sub: "계좌 공지와 입금 체크리스트", screen: "groupBuy" },
    { icon: "◎", label: "절감 리포트·배지", sub: "탄소·음식물 절감과 포인트", screen: "impact" },
    { icon: "!", label: "문제 신고", sub: "도난·기한·악취·오염 신고", screen: "report" },
    { icon: "💬", label: "층 커뮤니티", sub: "정리 요청과 공동구매", screen: "community" },
    { icon: "🔔", label: "알림 설정", sub: "소비기한·채팅·위생 알림 관리", screen: "notificationSettings" },
  ]

  return (
    <div className="dm-screen menu-screen">
      <header className="menu-profile">
        <div className="dm-row between"><button onClick={onBack} aria-label="뒤로 가기">‹</button><div className="menu-mascot"><EagleMascot size={38} /></div></div>
        <span>안녕하세요 👋</span><h2>{profile.name} 님</h2><p>{residence.dorm} {residence.building} {residence.floor}층 · {profile.room}</p>
      </header>
      <main className="dm-stack">
        <section><span className="dm-eyebrow">MENU</span><div className="menu-list">{items.map(item => <button key={item.label} onClick={() => onNext(item.screen)}><span>{item.icon}</span><div><strong>{item.label}</strong><small>{item.sub}</small></div><b>›</b></button>)}</div></section>
        <p className="menu-version">냉큼 prototype · 연세대학교 전용</p>
      </main>
    </div>
  )
}
