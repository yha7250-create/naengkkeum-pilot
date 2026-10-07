import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import type { Session } from "@supabase/supabase-js"
import EagleMascot from "../components/EagleMascot"
import type { DormMealStore } from "../useDormMealStore"
import { pilotCloudEnabled, supabase } from "./supabase"

interface Props {
  store: DormMealStore
  children: ReactNode
}

type SyncState = "loading" | "saved" | "saving" | "offline" | "error"

function ConnectedPilotGate({ store, children }: Props) {
  const [session, setSession] = useState<Session | null>(null)
  const [checking, setChecking] = useState(true)
  const [ready, setReady] = useState(false)
  const [name, setName] = useState("")
  const [room, setRoom] = useState("")
  const [error, setError] = useState("")
  const [joining, setJoining] = useState(false)
  const [syncState, setSyncState] = useState<SyncState>("loading")
  const storeRef = useRef(store)
  const pendingProfile = useRef<{ name: string; room: string } | null>(null)
  const lastShared = useRef("")
  const lastMember = useRef("")
  storeRef.current = store

  const sharedJson = useMemo(() => JSON.stringify(store.sharedSnapshot), [store.sharedSnapshot])
  const memberJson = useMemo(() => JSON.stringify(store.memberSnapshot), [store.memberSnapshot])

  useEffect(() => {
    if (!supabase) return
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setChecking(false)
      if (!nextSession) setReady(false)
    })
    return () => { mounted = false; listener.subscription.unsubscribe() }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user.id) return
    let cancelled = false
    async function hydrate() {
      setReady(false)
      setSyncState("loading")
      const client = supabase!
      const userId = session!.user.id
      const [{ data: member, error: memberError }, { data: cloudState, error: stateError }] = await Promise.all([
        client.from("pilot_members").select("member_state,display_name,room").eq("user_id", userId).maybeSingle(),
        client.from("pilot_state").select("data,updated_at").eq("id", "yonsei-pilot").maybeSingle(),
      ])
      if (cancelled) return
      if (memberError || stateError) {
        setError(memberError?.message ?? stateError?.message ?? "공용 저장소를 불러오지 못했습니다.")
        setSyncState("error")
        return
      }

      let nextMember = member?.member_state as Partial<typeof store.memberSnapshot> | undefined
      if (!nextMember) {
        const first = pendingProfile.current
        nextMember = {
          ...storeRef.current.memberSnapshot,
          profile: {
            name: first?.name ?? "",
            room: first?.room ?? "",
            studentId: "",
            phone: "",
          },
          impact: { foodSavedKg: 0, carbonSavedKg: 0, moneySaved: 0, completedActions: 0, points: 0 },
        }
        const { error: insertError } = await client.from("pilot_members").upsert({
          user_id: userId,
          display_name: nextMember.profile?.name ?? "",
          room: nextMember.profile?.room ?? "",
          member_state: nextMember,
          updated_at: new Date().toISOString(),
        })
        if (insertError) { setError(insertError.message); setSyncState("error"); return }
      }
      storeRef.current.importMemberSnapshot(nextMember)
      lastMember.current = JSON.stringify(nextMember)

      if (cloudState?.data) {
        storeRef.current.importSharedSnapshot(cloudState.data as Partial<typeof store.sharedSnapshot>)
        lastShared.current = JSON.stringify(cloudState.data)
      } else {
        const seed = storeRef.current.sharedSnapshot
        const { error: seedError } = await client.from("pilot_state").upsert({ id: "yonsei-pilot", data: seed, updated_by: userId, updated_at: new Date().toISOString() })
        if (seedError) { setError(seedError.message); setSyncState("error"); return }
        lastShared.current = JSON.stringify(seed)
      }
      if (!cancelled) {
        setReady(true)
        setSyncState("saved")
        pendingProfile.current = null
      }
    }
    void hydrate()
    return () => { cancelled = true }
  }, [session?.user.id])

  useEffect(() => {
    if (!supabase || !ready || !session?.user.id || memberJson === lastMember.current) return
    setSyncState("saving")
    const timer = window.setTimeout(async () => {
      const snapshot = storeRef.current.memberSnapshot
      const { error: saveError } = await supabase!.from("pilot_members").upsert({
        user_id: session.user.id,
        display_name: snapshot.profile.name,
        room: snapshot.profile.room,
        member_state: snapshot,
        updated_at: new Date().toISOString(),
      })
      if (saveError) { setError(saveError.message); setSyncState("error") }
      else { lastMember.current = JSON.stringify(snapshot); setSyncState("saved") }
    }, 900)
    return () => window.clearTimeout(timer)
  }, [memberJson, ready, session?.user.id])

  useEffect(() => {
    if (!supabase || !ready || !session?.user.id || sharedJson === lastShared.current) return
    setSyncState("saving")
    const timer = window.setTimeout(async () => {
      const snapshot = storeRef.current.sharedSnapshot
      const { error: saveError } = await supabase!.from("pilot_state").upsert({
        id: "yonsei-pilot",
        data: snapshot,
        updated_by: session.user.id,
        updated_at: new Date().toISOString(),
      })
      if (saveError) { setError(saveError.message); setSyncState("error") }
      else { lastShared.current = JSON.stringify(snapshot); setSyncState("saved") }
    }, 900)
    return () => window.clearTimeout(timer)
  }, [sharedJson, ready, session?.user.id])

  useEffect(() => {
    if (!supabase || !ready || !session?.user.id) return
    async function refreshShared() {
      if (!navigator.onLine) { setSyncState("offline"); return }
      const { data, error: fetchError } = await supabase!.from("pilot_state").select("data").eq("id", "yonsei-pilot").maybeSingle()
      if (fetchError || !data?.data) return
      const remote = JSON.stringify(data.data)
      if (remote !== lastShared.current) {
        storeRef.current.importSharedSnapshot(data.data as Partial<typeof store.sharedSnapshot>)
        lastShared.current = remote
      }
      setSyncState("saved")
    }
    const interval = window.setInterval(() => void refreshShared(), 15000)
    const focus = () => void refreshShared()
    window.addEventListener("focus", focus)
    return () => { window.clearInterval(interval); window.removeEventListener("focus", focus) }
  }, [ready, session?.user.id])

  useEffect(() => {
    if (!supabase || !ready || !session?.user.id) return
    const channel = supabase.channel("naengkkeum-pilot-state")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "pilot_state", filter: "id=eq.yonsei-pilot" }, payload => {
        const next = (payload.new as { data?: Partial<typeof store.sharedSnapshot> }).data
        if (!next) return
        const remote = JSON.stringify(next)
        if (remote === lastShared.current) return
        storeRef.current.importSharedSnapshot(next)
        lastShared.current = remote
        setSyncState("saved")
      })
      .subscribe()
    return () => { void supabase!.removeChannel(channel) }
  }, [ready, session?.user.id])

  async function joinPilot() {
    const cleanName = name.trim()
    const cleanRoom = room.trim().replace(/호$/, "")
    if (!cleanName || !cleanRoom) return setError("이름과 호수를 모두 입력해 주세요.")
    if (!/^\d{3,4}$/.test(cleanRoom)) return setError("호수는 302처럼 숫자 3~4자리로 입력해 주세요.")
    setJoining(true)
    setError("")
    pendingProfile.current = { name: cleanName, room: `${cleanRoom}호` }
    const { error: signInError } = await supabase!.auth.signInAnonymously({ options: { data: { display_name: cleanName, room: `${cleanRoom}호` } } })
    if (signInError) { setError(signInError.message); setJoining(false); pendingProfile.current = null }
  }

  if (checking) return <div className="pilot-loading"><EagleMascot size={86} /><strong>냉큼 파일럿을 준비하고 있어요</strong></div>
  if (!session) return (
    <div className="pilot-gate">
      <section className="pilot-gate-card">
        <div className="pilot-mascot"><EagleMascot size={112} /></div>
        <span className="dm-eyebrow">10-PERSON PILOT</span>
        <h1>냉큼 테스트 시작</h1>
        <p>처음 한 번만 참가자 정보를 등록하면 이 브라우저에서는 다음부터 바로 시작해요.</p>
        <label><span>이름 또는 닉네임</span><input value={name} onChange={event => setName(event.target.value)} placeholder="예: 연세냉큼이" maxLength={20} /></label>
        <label><span>기숙사 호수</span><input value={room} onChange={event => setRoom(event.target.value)} inputMode="numeric" placeholder="예: 302" maxLength={4} /></label>
        {error && <div className="dm-error">{error}</div>}
        <button onClick={joinPilot} disabled={joining}>{joining ? "참가자 정보를 저장하는 중…" : "파일럿 참가하기 →"}</button>
        <small>같은 브라우저에 로그인 상태가 저장됩니다. 브라우저 데이터 삭제·시크릿 모드·다른 기기에서는 다시 등록해야 해요.</small>
      </section>
    </div>
  )
  if (!ready) return <div className="pilot-loading"><EagleMascot size={86} /><strong>공용 냉장고 데이터를 불러오는 중…</strong>{error && <p>{error}</p>}</div>

  return <div className="pilot-connected">{children}<div className={`pilot-sync-pill ${syncState}`}><span />{syncState === "saving" ? "저장 중" : syncState === "offline" ? "오프라인" : syncState === "error" ? "저장 확인 필요" : "10인 파일럿 · 저장됨"}</div></div>
}

export default function PilotGate(props: Props) {
  if (!pilotCloudEnabled) return <>{props.children}</>
  return <ConnectedPilotGate {...props} />
}
