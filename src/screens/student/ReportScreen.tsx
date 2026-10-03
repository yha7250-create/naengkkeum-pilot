import { useState } from "react"
import CameraCapture from "../../components/CameraCapture"
import { uid, type IncidentReport, type ReportCategory, type ResidenceProfile, type UserProfile } from "../../model"

interface Props {
  onBack: () => void
  reports: IncidentReport[]
  onSubmit: (report: IncidentReport) => void
  residence: ResidenceProfile
  profile: UserProfile
}

const categories: { key: ReportCategory; icon: string; text: string }[] = [
  { key: "도난·무단 수거", icon: "🔒", text: "내 음식이 사라졌어요" },
  { key: "소비기한 경과", icon: "⏱", text: "기한이 지났어요" },
  { key: "악취·오염", icon: "🧼", text: "냄새나 오염이 있어요" },
  { key: "기타", icon: "…", text: "다른 불편이 있어요" },
]

export default function ReportScreen({ onBack, reports, onSubmit, residence, profile }: Props) {
  const [category, setCategory] = useState<ReportCategory>("도난·무단 수거")
  const baseLocation = `${residence.dorm} ${residence.building} ${residence.floor}층`
  const [location, setLocation] = useState(`${baseLocation} · ${residence.fridgeName}`)
  const [description, setDescription] = useState("")
  const [photoName, setPhotoName] = useState("")
  const [photoData, setPhotoData] = useState("")
  const [anonymous, setAnonymous] = useState(true)
  const [notice, setNotice] = useState("")

  function submit() {
    if (!description.trim()) {
      setNotice("상황을 한 문장 이상 입력해 주세요.")
      return
    }
    onSubmit({
      id: uid("report"), category, location, description: description.trim(),
      photoName: photoName || undefined,
      photoData: photoData || undefined,
      reporter: anonymous ? `${profile.room} · 익명` : `${profile.room} · ${profile.name}`,
      status: "접수",
      createdAt: new Date().toISOString(),
    })
    setDescription("")
    setPhotoName("")
    setPhotoData("")
    setNotice("신고가 접수되어 RA 운영 화면에 기록되었습니다.")
  }

  return (
    <div className="dm-screen">
      <header className="dm-header alert-header">
        <button className="dm-icon-button dark" onClick={onBack} aria-label="뒤로 가기">‹</button>
        <div><p>사진은 선택 사항입니다</p><h2>냉장고 문제 신고</h2></div>
      </header>
      <main className="dm-stack">
        <section>
          <span className="dm-label">신고 유형</span>
          <div className="report-grid">
            {categories.map(item => (
              <button key={item.key} className={category === item.key ? "report-type active" : "report-type"} onClick={() => setCategory(item.key)}>
                <span>{item.icon}</span><strong>{item.key}</strong><small>{item.text}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="dm-card dm-stack tight">
          <label className="dm-label no-margin">발생 위치</label>
          <select value={location} onChange={event => setLocation(event.target.value)} className="dm-input">
            <option>{baseLocation} · {residence.fridgeName}</option>
            <option>{baseLocation} · 공용 냉장고 A</option>
            <option>{baseLocation} · 기타 구역</option>
          </select>
          <label className="dm-label no-margin" htmlFor="report-description">상황 설명</label>
          <textarea id="report-description" value={description} onChange={event => setDescription(event.target.value)} className="dm-input textarea" placeholder="예: 어제 등록한 닭가슴살이 사라졌습니다." />
          <CameraCapture label="현장 사진" value={photoData} onChange={(data, file) => { setPhotoData(data); setPhotoName(file) }} />
          <label className="dm-check"><input type="checkbox" checked={anonymous} onChange={event => setAnonymous(event.target.checked)} /><span>다른 학생에게는 익명으로 표시</span></label>
        </section>

        <div className="dm-notice amber"><strong>도난 신고 안내</strong><span>앱은 사건을 기록하고 RA에게 전달합니다. CCTV 열람이나 징계는 기숙사 운영 규정에 따라 RA가 처리합니다.</span></div>
        {notice && <p className={notice.startsWith("신고") ? "dm-success" : "dm-error"}>{notice}</p>}
        <button className="dm-primary coral" onClick={submit}>신고 접수</button>

        <section>
          <div className="dm-section-title"><div><span className="dm-eyebrow">MY REPORTS</span><h3>최근 신고 상태</h3></div></div>
          <div className="dm-list">
            {reports.slice(0, 3).map(report => (
              <article className="dm-card report-status" key={report.id}>
                <div><strong>{report.category}</strong><small>{report.location}</small></div>
                <span className={`status ${report.status.replace(" ", "-")}`}>{report.status}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
