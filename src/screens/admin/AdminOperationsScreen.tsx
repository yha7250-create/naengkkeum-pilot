import { useMemo, useState } from "react"
import type { FridgeAnnouncement, FridgeMetric, IncidentReport, ReportStatus } from "../../model"

interface Props {
  onBack: () => void
  onNext: (screen: string) => void
  fridges: FridgeMetric[]
  reports: IncidentReport[]
  onUpdateStatus: (id: string, status: ReportStatus) => void
  announcements: FridgeAnnouncement[]
  onSendAnnouncement: (fridgeId: string, message: string) => boolean
}

const nextStatus: Record<ReportStatus, ReportStatus> = { "접수": "확인 중", "확인 중": "처리 완료", "처리 완료": "처리 완료" }

export default function AdminOperationsScreen({ onBack, onNext, fridges, reports, onUpdateStatus, announcements, onSendAnnouncement }: Props) {
  const [filter, setFilter] = useState<"all" | "open">("open")
  const [noticeTarget, setNoticeTarget] = useState<FridgeMetric | null>(null)
  const [noticeText, setNoticeText] = useState("")
  const [sentMessage, setSentMessage] = useState("")
  const ranked = useMemo(() => [...fridges].sort((a, b) => ((b.used / b.capacity) * 100 + b.reports * 8 + b.expired * 4) - ((a.used / a.capacity) * 100 + a.reports * 8 + a.expired * 4)), [fridges])
  const visible = filter === "all" ? reports : reports.filter(report => report.status !== "처리 완료")

  function openNotice(fridge: FridgeMetric) {
    setNoticeTarget(fridge)
    setNoticeText(`${fridge.building} ${fridge.floor} ${fridge.label} 정리가 필요합니다. 기한이 지난 음식과 개인 보관 한도를 확인해 주세요.`)
    setSentMessage("")
  }

  function sendNotice() {
    if (!noticeTarget || !onSendAnnouncement(noticeTarget.id, noticeText)) return
    setSentMessage(`${noticeTarget.label} 이용자에게 공지를 발송했어요.`)
    window.setTimeout(() => { setNoticeTarget(null); setSentMessage("") }, 900)
  }

  return (
    <div className="dm-screen">
      <header className="dm-header admin-header">
        <button className="dm-icon-button dark" onClick={onBack} aria-label="뒤로 가기">‹</button>
        <div><p>RA 운영 화면 · 실시간 우선순위</p><h2>정리 운영센터</h2></div>
        <span className="dm-step admin">RA</span>
      </header>

      <main className="dm-stack">
        <section className="admin-kpis">
          <div><span>미처리 신고</span><strong>{reports.filter(item => item.status !== "처리 완료").length}</strong></div>
          <div><span>90% 이상</span><strong>{fridges.filter(item => item.used / item.capacity >= .9).length}</strong></div>
          <div><span>기한 경과</span><strong>{fridges.reduce((sum, item) => sum + item.expired, 0)}</strong></div>
        </section>

        <section>
          <div className="dm-section-title"><div><span className="dm-eyebrow">PRIORITY</span><h3>관리 우선 냉장고</h3></div></div>
          <div className="priority-list">
            {ranked.map((item, index) => {
              const percent = Math.round(item.used / item.capacity * 100)
              return (
                <article className="dm-card priority" key={item.id}>
                  <span className={index === 0 ? "rank top" : "rank"}>{index + 1}</span>
                  <div className="grow"><strong>{item.building} {item.floor} · {item.label}</strong><div className="dm-progress"><span className={percent >= 90 ? "danger-bar" : "warn-bar"} style={{ width: `${percent}%` }} /></div><small>점유 {percent}% · 신고 {item.reports}건 · 기한 경과 {item.expired}개</small></div>
                  <button className="dm-text-button" onClick={() => openNotice(item)}>공지</button>
                </article>
              )
            })}
          </div>
        </section>

        <section>
          <div className="dm-section-title"><div><span className="dm-eyebrow">REPORT QUEUE</span><h3>신고 처리</h3></div><div className="mini-toggle"><button className={filter === "open" ? "active" : ""} onClick={() => setFilter("open")}>미처리</button><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>전체</button></div></div>
          <div className="dm-list">
            {visible.map(report => (
              <article className="dm-card admin-report" key={report.id}>
                <div className="dm-row between align-start"><div><span className="dm-badge coral">{report.category}</span><h4>{report.location}</h4></div><span className={`status ${report.status.replace(" ", "-")}`}>{report.status}</span></div>
                {report.photoData && <img className="admin-report-photo" src={report.photoData} alt="신고 현장" />}
                <p>{report.description}</p>
                <div className="dm-row between"><small>{report.reporter} · {report.photoName ? "사진 첨부" : "사진 없음"}</small>{report.status !== "처리 완료" && <button className="dm-text-button" onClick={() => onUpdateStatus(report.id, nextStatus[report.status])}>{nextStatus[report.status]}으로</button>}</div>
              </article>
            ))}
            {visible.length === 0 && <div className="dm-empty">처리할 신고가 없습니다.</div>}
          </div>
        </section>

        <section>
          <div className="dm-section-title"><div><span className="dm-eyebrow">SENT NOTICE</span><h3>최근 발송 공지</h3></div><span className="dm-badge neutral">{announcements.length}건</span></div>
          <div className="dm-list announcement-history">
            {announcements.slice(0, 3).map(notice => <article className="dm-card" key={notice.id}><div className="dm-row between"><strong>{notice.location}</strong><small>{new Date(notice.createdAt).toLocaleString("ko-KR", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" })}</small></div><p>{notice.message}</p></article>)}
            {announcements.length === 0 && <div className="dm-empty">아직 발송한 공지가 없습니다.</div>}
          </div>
        </section>
      </main>
      <nav className="admin-bottom-nav five"><button onClick={() => onNext("adminDashboard")}><span>⌂</span>대시보드</button><button onClick={() => onNext("adminFridge")}><span>▦</span>현황</button><button className="active"><span>!</span>운영</button><button onClick={() => onNext("adminStats")}><span>↗</span>통계</button><button onClick={() => onNext("adminMenu")}><span>☰</span>메뉴</button></nav>
      {noticeTarget && <div className="notice-modal-backdrop" onClick={() => setNoticeTarget(null)}><section className="notice-modal" role="dialog" aria-modal="true" aria-label="냉장고 공지 작성" onClick={event => event.stopPropagation()}><header><div><small>RA 공지 발송</small><h3>{noticeTarget.building} {noticeTarget.floor} · {noticeTarget.label}</h3></div><button onClick={() => setNoticeTarget(null)} aria-label="닫기">×</button></header><label>공지 내용<textarea value={noticeText} onChange={event => setNoticeText(event.target.value)} maxLength={180} rows={5} /></label><p>{noticeText.length}/180자 · 해당 냉장고 학생 화면에 바로 표시됩니다.</p>{sentMessage && <div className="notice-sent-success">✓ {sentMessage}</div>}<footer><button onClick={() => setNoticeTarget(null)}>취소</button><button onClick={sendNotice} disabled={!noticeText.trim()}>공지 발송하기</button></footer></section></div>}
    </div>
  )
}
