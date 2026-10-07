import { useEffect, useMemo, useState } from "react"
import {
  initialFoods,
  initialFridges,
  initialFridgeLayout,
  initialImpact,
  initialProfile,
  initialResidence,
  initialAdminCodes,
  initialReports,
  initialRooms,
  initialNotificationSettings,
  initialStoragePolicy,
  initialActivities,
  initialAnnouncements,
  initialCommunityGoals,
  normalizeFoodQuantity,
  uid,
  type ChatRoom,
  type AdminManagedArea,
  type AdminAccessCode,
  type FoodItem,
  type FoodQuickPick,
  type FridgeLayout,
  type FridgeMetric,
  type ImpactStats,
  type IncidentReport,
  type ResidenceProfile,
  type ReportStatus,
  type UserProfile,
  type NotificationSettings,
  type StoragePolicy,
  type FoodActivity,
  type FridgeAnnouncement,
  type CommunityGoal,
} from "./model"

function floorNumber(label: string) {
  const value = Number(label.replace(/\D/g, "")) || 1
  return label.trim().toUpperCase().startsWith("B") ? -value : value
}

function floorLabel(floor: number) {
  return floor < 0 ? `B${Math.abs(floor)}층` : `${floor}층`
}

function managedFridgeId(area: Omit<AdminManagedArea, "id">) {
  return `managed-${area.dorm}-${area.building}-${area.floor}`
}

function useStoredState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = window.localStorage.getItem(key)
      return saved ? (JSON.parse(saved) as T) : fallback
    } catch {
      return fallback
    }
  })

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

export function useDormMealStore() {
  const [foods, setFoods] = useStoredState<FoodItem[]>("dormmeal.foods.v2", initialFoods)
  const [reports, setReports] = useStoredState<IncidentReport[]>("dormmeal.reports.v2", initialReports)
  const [rooms, setRooms] = useStoredState<ChatRoom[]>("dormmeal.rooms.v2", initialRooms)
  const [fridges, setFridges] = useStoredState<FridgeMetric[]>("dormmeal.fridges.v2", initialFridges)
  const [residence, setResidence] = useStoredState<ResidenceProfile>("dormmeal.residence.v3", initialResidence)
  const [profile, setProfile] = useStoredState<UserProfile>("dormmeal.profile.v3", initialProfile)
  const [legacyFridgeLayout, setLegacyFridgeLayout] = useStoredState<FridgeLayout>("dormmeal.layout.v4", initialFridgeLayout)
  const [fridgeLayouts, setFridgeLayouts] = useStoredState<Record<string, FridgeLayout>>("dormmeal.layoutsByLocation.v1", {})
  const [impact, setImpact] = useStoredState<ImpactStats>("dormmeal.impact.v3", initialImpact)
  const [adminCodes, setAdminCodes] = useStoredState<AdminAccessCode[]>("dormmeal.adminCodes.v4", initialAdminCodes)
  const [adminSession, setAdminSession] = useStoredState<string | null>("dormmeal.adminSession.v4", null)
  const [notificationSettings, setNotificationSettings] = useStoredState<NotificationSettings>("dormmeal.notifications.v1", initialNotificationSettings)
  const [storagePolicy, setStoragePolicy] = useStoredState<StoragePolicy>("dormmeal.storagePolicy.v1", initialStoragePolicy)
  const [activities, setActivities] = useStoredState<FoodActivity[]>("dormmeal.activities.v1", initialActivities)
  const [quickFoods, setQuickFoods] = useStoredState<FoodQuickPick[]>("naengkkeum.quickFoods.v1", [])
  const [selectedAdminFridgeId, setSelectedAdminFridgeId] = useStoredState<string>("dormmeal.selectedAdminFridge.v1", "1-3-b")
  const [announcements, setAnnouncements] = useStoredState<FridgeAnnouncement[]>("dormmeal.announcements.v1", initialAnnouncements)
  const [communityGoals, setCommunityGoals] = useStoredState<Record<string, CommunityGoal>>("dormmeal.communityGoals.v1", initialCommunityGoals)
  const [adminManagedAreas, setAdminManagedAreas] = useStoredState<AdminManagedArea[]>("dormmeal.adminManagedAreas.v1", [{
    id: "무악학사-1관-3",
    dorm: "무악학사",
    building: "1관",
    floor: 3,
  }])

  useEffect(() => {
    setReports(current => current.some(report => (report.category as string) === "라벨 미부착")
      ? current.filter(report => (report.category as string) !== "라벨 미부착")
      : current)
  }, [setReports])

  const adminFridges = useMemo(() => fridges.filter(fridge => !fridge.archivedAt && adminManagedAreas.some(area =>
    (fridge.dorm ?? initialResidence.dorm) === area.dorm
    && fridge.building === area.building
    && floorNumber(fridge.floor) === area.floor,
  )), [adminManagedAreas, fridges])
  const archivedAdminFridges = useMemo(() => fridges.filter(fridge => Boolean(fridge.archivedAt) && adminManagedAreas.some(area =>
    (fridge.dorm ?? initialResidence.dorm) === area.dorm
    && fridge.building === area.building
    && floorNumber(fridge.floor) === area.floor,
  )), [adminManagedAreas, fridges])
  const activeAdminFridge = adminFridges.find(fridge => fridge.id === selectedAdminFridgeId) ?? adminFridges[0]
  const adminResidence: ResidenceProfile = activeAdminFridge ? {
    ...residence,
    dorm: activeAdminFridge.dorm ?? residence.dorm,
    building: activeAdminFridge.building,
    floor: floorNumber(activeAdminFridge.floor),
    fridgeName: activeAdminFridge.label,
  } : residence
  const studentLocationFridges = fridges.filter(fridge => !fridge.archivedAt
    && (fridge.dorm ?? initialResidence.dorm) === residence.dorm
    && fridge.building === residence.building
    && floorNumber(fridge.floor) === residence.floor)
  const studentFridge = studentLocationFridges.find(fridge => fridge.id === residence.fridgeId)
    ?? studentLocationFridges.find(fridge => residence.fridgeName.includes(fridge.label) || fridge.label.includes(residence.fridgeName))
    ?? studentLocationFridges[0]
  const studentResidence: ResidenceProfile = studentFridge ? {
    ...residence,
    fridgeId: studentFridge.id,
    fridgeName: studentFridge.label,
  } : residence
  const makeLocationKey = (target: ResidenceProfile) => `${target.school}|${target.dorm}|${target.building}|${target.floor}|${target.fridgeName.replace(/^공용\s*/, "")}`
  const legacyResidenceLocationKey = `${residence.school}|${residence.dorm}|${residence.building}|${residence.floor}|${residence.fridgeName}`
  const fridgeLocationKey = makeLocationKey(residence)
  const adminFridgeLocationKey = makeLocationKey(adminResidence)
  const fridgeLayout = (studentFridge ? fridgeLayouts[studentFridge.id] : undefined) ?? fridgeLayouts[fridgeLocationKey] ?? fridgeLayouts[legacyResidenceLocationKey] ?? (Object.keys(fridgeLayouts).length === 0 ? legacyFridgeLayout : initialFridgeLayout)
  const adminFridgeLayout = (activeAdminFridge ? fridgeLayouts[activeAdminFridge.id] : undefined) ?? fridgeLayouts[adminFridgeLocationKey] ?? (adminFridgeLocationKey === fridgeLocationKey ? fridgeLayout : initialFridgeLayout)
  const studentCommunityGoal = communityGoals[studentFridge?.id ?? ""] ?? { fridgeId: studentFridge?.id ?? "", target: 10, completed: 0, weekLabel: "이번 주" }
  const adminCommunityGoal = communityGoals[activeAdminFridge?.id ?? ""] ?? { fridgeId: activeAdminFridge?.id ?? "", target: 10, completed: 0, weekLabel: "이번 주" }

  const ownedFoods = useMemo(() => foods.filter(food => !food.coOwners?.length || food.coOwners.includes(profile.room)), [foods, profile.room])
  const usedUnits = useMemo(() => ownedFoods.reduce((sum, item) => sum + item.units, 0), [ownedFoods])
  const usedUnitsByZone = useMemo(() => ({
    "냉장실": ownedFoods.filter(food => food.zone === "냉장실").reduce((sum, item) => sum + item.units, 0),
    "냉동고": ownedFoods.filter(food => food.zone === "냉동고").reduce((sum, item) => sum + item.units, 0),
  }), [ownedFoods])
  const personalLimit = storagePolicy.totalUnits

  function addFood(food: FoodItem) {
    setFoods(current => [food, ...current])
    setActivities(current => [{ id: uid("activity"), type: "registered", units: food.units, at: new Date().toISOString() }, ...current])
    const catalogId = food.guideId?.startsWith("catalog-") ? food.guideId.replace(/^catalog-/, "") : undefined
    const quickKey = catalogId ?? `custom-${food.name.trim().toLowerCase()}`
    setQuickFoods(current => {
      const previous = current.find(item => item.key === quickKey)
      const next: FoodQuickPick = {
        key: quickKey,
        catalogId,
        name: food.name,
        kind: food.kind,
        category: food.category,
        zone: food.zone,
        icon: food.icon,
        quantityUnit: food.quantityUnit ?? "개",
        count: (previous?.count ?? 0) + 1,
        lastUsedAt: new Date().toISOString(),
      }
      return [next, ...current.filter(item => item.key !== quickKey)]
        .sort((a, b) => b.count - a.count || b.lastUsedAt.localeCompare(a.lastUsedAt))
        .slice(0, 8)
    })
    setImpact(current => ({ ...current, points: current.points + 5 }))
    setFridges(current => current.map(fridge => fridge.id === studentFridge?.id
      ? { ...fridge, used: Math.min(fridge.capacity, fridge.used + food.units) }
      : fridge))
  }

  function updateFoodQuantity(id: string, quantity: number) {
    setFoods(current => current.map(food => food.id === id
      ? { ...food, quantity: normalizeFoodQuantity(quantity, food.quantityUnit ?? "개") }
      : food))
  }

  function removeFood(id: string) {
    const target = foods.find(food => food.id === id)
    setFoods(current => current.filter(food => food.id !== id))
    if (target) {
      setFridges(current => current.map(fridge => fridge.id === studentFridge?.id
        ? { ...fridge, used: Math.max(0, fridge.used - target.units) }
        : fridge))
    }
  }

  function completeFood(id: string, outcome: "consumed" | "discarded") {
    const target = foods.find(food => food.id === id)
    if (!target) return
    removeFood(id)
    setActivities(current => [{ id: uid("activity"), type: outcome, units: target.units, at: new Date().toISOString() }, ...current])
    if (outcome === "consumed") {
      const savedKg = Number((target.units * 0.22).toFixed(2))
      setImpact(current => ({
        foodSavedKg: Number((current.foodSavedKg + savedKg).toFixed(2)),
        carbonSavedKg: Number((current.carbonSavedKg + savedKg * 2.5).toFixed(2)),
        moneySaved: current.moneySaved + target.units * 2800,
        completedActions: current.completedActions + 1,
        points: current.points + 15,
      }))
    } else {
      setImpact(current => ({ ...current, completedActions: current.completedActions + 1, points: current.points + 2 }))
    }
    if (studentFridge) {
      setCommunityGoals(current => {
        const goal = current[studentFridge.id] ?? { fridgeId: studentFridge.id, target: 10, completed: 0, weekLabel: "이번 주" }
        return { ...current, [studentFridge.id]: { ...goal, completed: Math.min(goal.target, goal.completed + 1) } }
      })
    }
  }

  function updateResidence(patch: Partial<ResidenceProfile>) {
    setResidence(current => ({ ...current, ...patch }))
  }

  function updateProfile(patch: Partial<UserProfile>) {
    setProfile(current => ({ ...current, ...patch }))
  }

  function saveAdminManagedAreas(areas: Omit<AdminManagedArea, "id">[]) {
    const unique = areas.filter((area, index, all) => all.findIndex(item =>
      item.dorm === area.dorm && item.building === area.building && item.floor === area.floor,
    ) === index)
    const normalized = unique.map(area => ({ ...area, id: `${area.dorm}-${area.building}-${area.floor}` }))
    setAdminManagedAreas(normalized)
    setFridges(current => {
      const next = [...current]
      normalized.forEach(area => {
        const exists = next.some(fridge =>
          (fridge.dorm ?? initialResidence.dorm) === area.dorm
          && fridge.building === area.building
          && floorNumber(fridge.floor) === area.floor)
        if (!exists) next.push({
          id: managedFridgeId(area),
          dorm: area.dorm,
          building: area.building,
          floor: floorLabel(area.floor),
          label: "냉장고 A",
          used: 0,
          capacity: 40,
          reports: 0,
          expired: 0,
        })
      })
      return next
    })
    const first = normalized[0]
    if (first) {
      const existing = fridges.find(fridge =>
        (fridge.dorm ?? initialResidence.dorm) === first.dorm
        && fridge.building === first.building
        && floorNumber(fridge.floor) === first.floor)
      setSelectedAdminFridgeId(existing?.id ?? managedFridgeId(first))
    }
  }

  function saveFridgeLayout(layout: FridgeLayout) {
    setLegacyFridgeLayout(layout)
    setFridgeLayouts(current => ({ ...current, [fridgeLocationKey]: layout }))
  }

  function saveAdminFridgeLayout(layout: FridgeLayout) {
    setFridgeLayouts(current => ({ ...current, [adminFridgeLocationKey]: layout, ...(activeAdminFridge ? { [activeAdminFridge.id]: layout } : {}) }))
    if (adminFridgeLocationKey === fridgeLocationKey) setLegacyFridgeLayout(layout)
  }

  function selectAdminFridge(id: string) {
    if (adminFridges.some(fridge => fridge.id === id)) setSelectedAdminFridgeId(id)
  }

  function addAdminFridge(areaId: string, name: string) {
    const area = adminManagedAreas.find(item => item.id === areaId)
    const cleanName = name.trim()
    if (!area || !cleanName) return ""
    const duplicate = fridges.some(fridge =>
      (fridge.dorm ?? initialResidence.dorm) === area.dorm
      && fridge.building === area.building
      && floorNumber(fridge.floor) === area.floor
      && fridge.label.toLowerCase() === cleanName.toLowerCase())
    if (duplicate) return ""
    const id = uid("fridge")
    setFridges(current => [...current, {
      id,
      dorm: area.dorm,
      building: area.building,
      floor: floorLabel(area.floor),
      label: cleanName,
      used: 0,
      capacity: 40,
      reports: 0,
      expired: 0,
    }])
    setSelectedAdminFridgeId(id)
    return id
  }

  function renameAdminFridge(id: string, name: string) {
    const cleanName = name.trim()
    const target = fridges.find(fridge => fridge.id === id)
    if (!target || !cleanName) return false
    const oldResidence: ResidenceProfile = {
      ...residence,
      dorm: target.dorm ?? residence.dorm,
      building: target.building,
      floor: floorNumber(target.floor),
      fridgeName: target.label,
    }
    const newResidence = { ...oldResidence, fridgeName: cleanName }
    const oldKey = makeLocationKey(oldResidence)
    const newKey = makeLocationKey(newResidence)
    setFridges(current => current.map(fridge => fridge.id === id ? { ...fridge, label: cleanName } : fridge))
    setFridgeLayouts(current => current[oldKey] && !current[newKey] ? { ...current, [newKey]: current[oldKey] } : current)
    return true
  }

  function archiveAdminFridge(id: string) {
    const target = adminFridges.find(fridge => fridge.id === id)
    if (!target || adminFridges.length <= 1) return false
    setFridges(current => current.map(fridge => fridge.id === id ? { ...fridge, archivedAt: new Date().toISOString() } : fridge))
    if (selectedAdminFridgeId === id) {
      const next = adminFridges.find(fridge => fridge.id !== id)
      if (next) setSelectedAdminFridgeId(next.id)
    }
    return true
  }

  function restoreAdminFridge(id: string) {
    const target = archivedAdminFridges.find(fridge => fridge.id === id)
    if (!target) return false
    setFridges(current => current.map(fridge => fridge.id === id ? { ...fridge, archivedAt: undefined } : fridge))
    setSelectedAdminFridgeId(id)
    return true
  }

  function sendAnnouncement(fridgeId: string, message: string) {
    const fridge = fridges.find(item => item.id === fridgeId)
    const clean = message.trim()
    if (!fridge || !clean) return false
    setAnnouncements(current => [{
      id: uid("announcement"),
      fridgeId,
      location: `${fridge.building} ${fridge.floor} · ${fridge.label}`,
      message: clean,
      sender: `RA ${adminSession ?? "관리자"}`,
      createdAt: new Date().toISOString(),
    }, ...current])
    return true
  }

  function updateCommunityGoalTarget(fridgeId: string, target: number) {
    if (!fridges.some(fridge => fridge.id === fridgeId)) return
    setCommunityGoals(current => {
      const goal = current[fridgeId] ?? { fridgeId, target: 10, completed: 0, weekLabel: "이번 주" }
      const nextTarget = Math.max(1, Math.min(50, target))
      return { ...current, [fridgeId]: { ...goal, target: nextTarget, completed: Math.min(goal.completed, nextTarget) } }
    })
  }

  function issueAdminCode(label: string) {
    const code = `RA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
    const item: AdminAccessCode = {
      id: uid("admin-code"), code, label: label.trim() || "기숙사 관리자",
      createdAt: new Date().toISOString(), active: true,
    }
    setAdminCodes(current => [item, ...current])
    return item
  }

  function verifyAdminCode(code: string, adminName: string) {
    const clean = code.trim().toUpperCase()
    const cleanName = adminName.trim() || "관리자"
    const matched = adminCodes.find(item => item.code.toUpperCase() === clean
      && item.active
      && (!item.usedAt || item.usedBy?.trim().toLowerCase() === cleanName.toLowerCase()))
    if (!matched) return false
    if (!matched.usedAt) {
      setAdminCodes(current => current.map(item => item.id === matched.id ? {
        ...item, usedAt: new Date().toISOString(), usedBy: cleanName,
      } : item))
    }
    setAdminSession(cleanName || matched.label)
    return true
  }

  function disableAdminCode(id: string) {
    setAdminCodes(current => current.map(item => item.id === id ? { ...item, active: false } : item))
  }

  function logoutAdmin() {
    setAdminSession(null)
  }

  function addReport(report: IncidentReport) {
    setReports(current => [report, ...current])
    setFridges(current => current.map(fridge => fridge.id === studentFridge?.id
      ? { ...fridge, reports: fridge.reports + 1 }
      : fridge))
  }

  function updateReportStatus(id: string, status: ReportStatus) {
    setReports(current => current.map(report => report.id === id ? { ...report, status } : report))
  }

  function addRoom(room: ChatRoom) {
    setRooms(current => [room, ...current])
  }

  function joinGroupBuy(roomId: string, roomNumber: string) {
    setRooms(current => current.map(room => {
      if (room.id !== roomId || room.payments?.some(item => item.room === roomNumber)) return room
      if (room.maxParticipants && room.participants >= room.maxParticipants) return room
      return { ...room, participants: room.participants + 1, payments: [...(room.payments ?? []), { room: roomNumber, paid: false }] }
    }))
  }

  function toggleGroupBuyPayment(roomId: string, roomNumber: string) {
    setRooms(current => current.map(room => room.id === roomId ? {
      ...room,
      payments: (room.payments ?? []).map(item => item.room === roomNumber ? { ...item, paid: !item.paid } : item),
    } : room))
  }

  function saveNotificationSettings(settings: NotificationSettings) {
    setNotificationSettings(settings)
  }

  function saveStoragePolicy(policy: StoragePolicy) {
    setStoragePolicy(policy)
  }

  function sendMessage(roomId: string, text: string, role: "student" | "admin" = "student") {
    const clean = text.trim()
    if (!clean) return
    setRooms(current => current.map(room => room.id === roomId ? {
      ...room,
      messages: [...room.messages, {
        id: uid("message"),
        author: role === "admin" ? "RA 김관리" : "302호",
        role,
        text: clean,
        sentAt: new Date().toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", hour12: false }),
      }],
    } : room))
  }

  const sharedSnapshot = useMemo(() => ({
    foods, reports, rooms, fridges, fridgeLayouts, storagePolicy, activities,
    announcements, communityGoals, adminManagedAreas, adminCodes,
  }), [foods, reports, rooms, fridges, fridgeLayouts, storagePolicy, activities, announcements, communityGoals, adminManagedAreas, adminCodes])

  const memberSnapshot = useMemo(() => ({ residence, profile, impact, notificationSettings, quickFoods }), [residence, profile, impact, notificationSettings, quickFoods])

  function importSharedSnapshot(data: Partial<typeof sharedSnapshot>) {
    if (Array.isArray(data.foods)) setFoods(data.foods)
    if (Array.isArray(data.reports)) setReports(data.reports)
    if (Array.isArray(data.rooms)) setRooms(data.rooms)
    if (Array.isArray(data.fridges)) setFridges(data.fridges)
    if (data.fridgeLayouts && typeof data.fridgeLayouts === "object") setFridgeLayouts(data.fridgeLayouts)
    if (data.storagePolicy) setStoragePolicy(data.storagePolicy)
    if (Array.isArray(data.activities)) setActivities(data.activities)
    if (Array.isArray(data.announcements)) setAnnouncements(data.announcements)
    if (data.communityGoals && typeof data.communityGoals === "object") setCommunityGoals(data.communityGoals)
    if (Array.isArray(data.adminManagedAreas)) setAdminManagedAreas(data.adminManagedAreas)
    if (Array.isArray(data.adminCodes)) setAdminCodes(data.adminCodes)
  }

  function importMemberSnapshot(data: Partial<typeof memberSnapshot>) {
    if (data.residence) setResidence(data.residence)
    if (data.profile) setProfile(data.profile)
    if (data.impact) setImpact(data.impact)
    if (data.notificationSettings) setNotificationSettings(data.notificationSettings)
    if (Array.isArray(data.quickFoods)) setQuickFoods(data.quickFoods)
  }

  return {
    foods,
    reports,
    rooms,
    fridges,
    adminFridges,
    archivedAdminFridges,
    adminManagedAreas,
    usedUnits,
    usedUnitsByZone,
    personalLimit,
    residence,
    studentResidence,
    profile,
    fridgeLayout,
    adminFridgeLayout,
    activeAdminFridge,
    selectedAdminFridgeId: activeAdminFridge?.id ?? selectedAdminFridgeId,
    adminResidence,
    studentFridgeId: studentFridge?.id ?? "",
    announcements,
    studentCommunityGoal,
    adminCommunityGoal,
    impact,
    adminCodes,
    adminSession,
    notificationSettings,
    storagePolicy,
    activities,
    quickFoods,
    addFood,
    updateFoodQuantity,
    removeFood,
    completeFood,
    updateResidence,
    updateProfile,
    saveAdminManagedAreas,
    saveFridgeLayout,
    saveAdminFridgeLayout,
    selectAdminFridge,
    addAdminFridge,
    renameAdminFridge,
    archiveAdminFridge,
    restoreAdminFridge,
    sendAnnouncement,
    updateCommunityGoalTarget,
    issueAdminCode,
    verifyAdminCode,
    disableAdminCode,
    logoutAdmin,
    addReport,
    updateReportStatus,
    addRoom,
    joinGroupBuy,
    toggleGroupBuyPayment,
    saveNotificationSettings,
    saveStoragePolicy,
    sendMessage,
    sharedSnapshot,
    memberSnapshot,
    importSharedSnapshot,
    importMemberSnapshot,
  }
}

export type DormMealStore = ReturnType<typeof useDormMealStore>
