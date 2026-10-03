import { useState } from "react"
import type { NotificationSettings } from "../../model"

interface Props {
  onBack: () => void
  initial: NotificationSettings
  onSave: (settings: NotificationSettings) => void
}

const toggles: { key: keyof NotificationSettings; title: string; sub: string }[] = [
  { key: "expiryEnabled", title: "소비기한 알림", sub: "3일 전, 1일 전, 당일 등 선택한 시점" },
  { key: "overdueEnabled", title: "기한 경과 알림", sub: "처리할 때까지 매일 한 번 안내" },
  { key: "highRiskEnabled", title: "부패 위험 음식 알림", sub: "배달·개봉 식품을 더 빠르게 확인" },
  { key: "chatEnabled", title: "채팅 알림", sub: "같은 층 커뮤니티와 RA 공지" },
  { key: "groupBuyEnabled", title: "공동구매 알림", sub: "모집 마감·입금 확인·수령 안내" },
  { key: "hygieneEnabled", title: "위생 신고 알림", sub: "내 음식이 있는 구역의 악취·오염 제보" },
]

export default function NotificationSettingsScreen({ onBack, initial, onSave }: Props) {
  const [settings, setSettings] = useState(initial)
  const [saved, setSaved] = useState(false)
  const setToggle = (key: keyof NotificationSettings, value: boolean) => setSettings(current => ({ ...current, [key]: value }))
  const toggleDay = (day: number) => setSettings(current => ({ ...current, reminderDays: current.reminderDays.includes(day) ? current.reminderDays.filter(item => item !== day) : [...current.reminderDays, day].sort((a, b) => b - a) }))

  return <div className="dm-screen notification-screen">
    <header className="dm-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>필요한 안내만 받을 수 있어요</p><h2>알림 설정</h2></div></header>
    <main className="dm-stack">
      <section><span className="dm-label">소비기한 알림 시점</span><div className="reminder-days">{[{ day: 3, label: "3일 전" }, { day: 1, label: "1일 전" }, { day: 0, label: "당일" }].map(item => <button key={item.day} className={settings.reminderDays.includes(item.day) ? "active" : ""} onClick={() => toggleDay(item.day)}>{item.label}</button>)}</div></section>
      <section className="notification-list">{toggles.map(item => <label key={item.key}><div><strong>{item.title}</strong><small>{item.sub}</small></div><button type="button" role="switch" aria-checked={Boolean(settings[item.key])} className={`toggle-switch ${settings[item.key] ? "on" : ""}`} onClick={() => setToggle(item.key, !settings[item.key] as boolean)}><i /></button></label>)}</section>
      <p className="notification-note">현재 버전은 브라우저 안에서 설정을 저장합니다. 실제 문자·푸시 발송은 출시 시 알림 서버와 사용자 동의 절차를 연결해야 합니다.</p>
      {saved && <p className="dm-success">알림 설정이 저장되었습니다.</p>}
      <button className="dm-primary" onClick={() => { onSave(settings); setSaved(true) }}>설정 저장</button>
    </main>
  </div>
}
