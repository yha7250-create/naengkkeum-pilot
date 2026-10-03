import { useState } from 'react'

interface Props { onBack: () => void }

type BoxStatus = 'safe' | 'warn' | 'urgent' | 'expired' | 'empty'
const statusColor: Record<BoxStatus, string> = { safe: '#22C55E', warn: '#F59E0B', urgent: '#EF4444', expired: '#991B1B', empty: '#D4E4DA' }
const statusBg: Record<BoxStatus, string> = { safe: '#DCFCE7', warn: '#FEF3C7', urgent: '#FEE2E2', expired: '#FEE2E2', empty: '#F4F7F5' }
const statusLabel: Record<BoxStatus, string> = { safe: '안전', warn: '주의', urgent: '임박', expired: '기한초과', empty: '비어있음' }

const allRooms = [
  { room: '301', status: 'safe' as BoxStatus, student: '김민준', phone: '010-1234-5678', items: [{ name: '우유', cat: '유제품', stored: '2026-08-04', expiry: '2026-08-15' }, { name: '요거트', cat: '유제품', stored: '2026-08-06', expiry: '2026-08-12' }] },
  { room: '302', status: 'warn' as BoxStatus, student: '홍길동', phone: '010-9876-5432', items: [{ name: '닭가슴살', cat: '육류', stored: '2026-08-01', expiry: '2026-08-10' }, { name: '계란', cat: '유제품', stored: '2026-08-05', expiry: '2026-08-20' }] },
  { room: '303', status: 'urgent' as BoxStatus, student: '이수빈', phone: '010-5555-7777', items: [{ name: '배달음식', cat: '남은음식', stored: '2026-08-06', expiry: '2026-08-08' }] },
  { room: '304', status: 'empty' as BoxStatus, student: '박지훈', phone: '010-3333-2222', items: [] },
  { room: '305', status: 'safe' as BoxStatus, student: '최유나', phone: '010-1111-4444', items: [{ name: '사과', cat: '과일', stored: '2026-08-05', expiry: '2026-08-18' }] },
  { room: '306', status: 'expired' as BoxStatus, student: '정민재', phone: '010-6666-9999', items: [{ name: '두부', cat: '냉장식품', stored: '2026-07-30', expiry: '2026-08-05' }, { name: '두유', cat: '유제품', stored: '2026-07-28', expiry: '2026-08-03' }] },
]

export default function AdminFoodDetailScreen({ onBack }: Props) {
  const [selRoom, setSelRoom] = useState<typeof allRooms[0] | null>(null)
  const [filter, setFilter] = useState<'all' | 'urgent' | 'expired'>('all')

  const filtered = allRooms.filter(r => {
    if (filter === 'urgent') return r.status === 'urgent'
    if (filter === 'expired') return r.status === 'expired'
    return true
  })

  return (
    <div style={{ height: '100%', background: '#F4F7F5', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
    <div style={{ flex: 1, overflowY: 'auto', paddingBottom: 56 }}>
      {/* Header */}
      <div style={{ background: '#0F3D2B', padding: '16px 24px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={onBack} style={{ width: 32, height: 32, border: 'none', background: 'rgba(255,255,255,0.15)', borderRadius: 9, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 13L5 8L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
          <div>
            <div style={{ display: 'flex', gap: 5, marginBottom: 2 }}>
              <span style={{ background: '#F5C518', borderRadius: 5, padding: '1px 6px', fontFamily: "'Outfit', sans-serif", fontSize: 9, fontWeight: 700, color: '#1A2420' }}>RA</span>
            </div>
            <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>음식 정보 관리</h2>
            <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: 0 }}>신촌학사 A동 3층 · 구역별 클릭으로 상세 확인</p>
          </div>
        </div>
        {/* Filter */}
        <div style={{ display: 'flex', gap: 6 }}>
          {[{ key: 'all', label: '전체' }, { key: 'urgent', label: '⚠ 임박' }, { key: 'expired', label: '🔴 기한초과' }].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              style={{ padding: '6px 12px', background: filter === f.key ? '#F5C518' : 'rgba(255,255,255,0.12)', border: 'none', borderRadius: 8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 12, fontWeight: filter === f.key ? 700 : 400, color: filter === f.key ? '#1A2420' : 'white', cursor: 'pointer' }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Room list */}
      <div style={{ padding: '12px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map(r => (
          <button
            key={r.room}
            onClick={() => setSelRoom(selRoom?.room === r.room ? null : r)}
            style={{
              width: '100%',
              background: selRoom?.room === r.room ? statusBg[r.status] : 'white',
              border: `1.5px solid ${selRoom?.room === r.room ? statusColor[r.status] : '#D4E4DA'}`,
              borderRadius: 16,
              padding: '14px 16px',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 40, height: 40, background: statusBg[r.status], borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${statusColor[r.status]}40`, flexShrink: 0 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: statusColor[r.status] }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 700, color: '#1A2420', margin: 0 }}>{r.room}호</p>
                  <span style={{ padding: '1px 7px', background: statusBg[r.status], borderRadius: 6, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 10, fontWeight: 600, color: statusColor[r.status] }}>{statusLabel[r.status]}</span>
                </div>
                <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 12, color: '#6B8A7A', margin: '2px 0 0' }}>{r.student} · 음식 {r.items.length}개</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ transform: selRoom?.room === r.room ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}><path d="M5 10L8 7L5 4" stroke="#B0C4BB" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>

            {selRoom?.room === r.room && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${statusColor[r.status]}30` }}>
                {/* Student info */}
                <div style={{ background: 'white', borderRadius: 10, padding: '10px 12px', marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A2420', margin: 0 }}>{r.student}</p>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#6B8A7A', margin: '2px 0 0' }}>{r.phone}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button style={{ padding: '6px 10px', background: '#E8F5EE', border: 'none', borderRadius: 8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 11, color: '#1B5E3B', cursor: 'pointer' }}>채팅</button>
                    <button style={{ padding: '6px 10px', background: '#F4F7F5', border: 'none', borderRadius: 8, fontFamily: "'Noto Sans KR', sans-serif", fontSize: 11, color: '#6B8A7A', cursor: 'pointer' }}>전화</button>
                  </div>
                </div>
                {/* Food items */}
                {r.items.length > 0 ? r.items.map((item, i) => (
                  <div key={i} style={{ background: 'white', borderRadius: 10, padding: '10px 12px', marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 13, fontWeight: 600, color: '#1A2420', margin: 0 }}>{item.name}</p>
                      <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 11, color: '#6B8A7A', margin: '1px 0 0' }}>{item.cat} · 보관: {item.stored}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: '#6B8A7A', margin: 0 }}>유통기한</p>
                      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#EF4444', margin: 0, fontWeight: 500 }}>{item.expiry}</p>
                    </div>
                  </div>
                )) : (
                  <p style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 12, color: '#B0C4BB', textAlign: 'center', padding: '8px 0' }}>등록된 음식 없음</p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      </div>
      {/* Bottom nav */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'white', borderTop: '1px solid #E8F0EC', display: 'flex', padding: '8px 0 12px', zIndex: 10 }}>
        {[
          { icon: '❄️', label: '냉장고', active: false },
          { icon: '📋', label: '음식정보', active: true },
          { icon: '📢', label: '공지사항', active: false },
          { icon: '⚙️', label: '메뉴', active: false },
        ].map(tab => (
          <button key={tab.label} style={{ flex: 1, border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '4px 0' }}>
            <span style={{ fontSize: 20 }}>{tab.icon}</span>
            <span style={{ fontFamily: "'Noto Sans KR', sans-serif", fontSize: 10, color: tab.active ? '#1B5E3B' : '#B0C4BB', fontWeight: tab.active ? 700 : 400 }}>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
