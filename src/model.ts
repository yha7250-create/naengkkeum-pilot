export type StorageSize = "small" | "medium" | "large"

export interface FoodItem {
  id: string
  name: string
  kind: string
  category: string
  zone: "냉장실" | "냉동고"
  position: string
  size: StorageSize
  units: number
  photoName?: string
  photoData?: string
  shelfId?: string
  expiry?: string
  expiryProofName?: string
  expiryVerified: boolean
  registeredAt: string
  reminderAt: string
  reminderRule: string
  registrationMode?: "personal" | "shared"
  coOwners?: string[]
  price?: number
  guideId?: string
  icon?: string
}

export interface ResidenceProfile {
  school: "연세대학교"
  dorm: string
  building: string
  floor: number
  fridgeName: string
}

export interface AdminManagedArea {
  id: string
  dorm: string
  building: string
  floor: number
}

export interface UserProfile {
  name: string
  studentId: string
  phone: string
  room: string
}

export interface FridgeLayout {
  fridgeShelves: number
  freezerShelves: number
  doorPockets: number
  freezerDoorPockets: number
  drawers: number
}

export interface ImpactStats {
  foodSavedKg: number
  carbonSavedKg: number
  moneySaved: number
  completedActions: number
  points: number
}

export interface StoragePolicy {
  totalUnits: number
  fridgeUnits: number
  freezerUnits: number
  perSlotUnits: number
}

export interface FoodActivity {
  id: string
  type: "registered" | "consumed" | "discarded"
  units: number
  at: string
}

export interface FridgeAnnouncement {
  id: string
  fridgeId: string
  location: string
  message: string
  sender: string
  createdAt: string
}

export interface CommunityGoal {
  fridgeId: string
  target: number
  completed: number
  weekLabel: string
}

export interface AdminAccessCode {
  id: string
  code: string
  label: string
  createdAt: string
  usedAt?: string
  usedBy?: string
  active: boolean
}

export type ReportCategory = "도난·무단 수거" | "소비기한 경과" | "악취·오염" | "기타"
export type ReportStatus = "접수" | "확인 중" | "처리 완료"

export interface IncidentReport {
  id: string
  category: ReportCategory
  location: string
  description: string
  photoName?: string
  photoData?: string
  reporter: string
  status: ReportStatus
  createdAt: string
}

export interface ChatMessage {
  id: string
  author: string
  role: "student" | "admin"
  text: string
  sentAt: string
}

export interface ChatRoom {
  id: string
  type: "care" | "groupbuy"
  title: string
  location: string
  adminPresent: boolean
  participants: number
  pickupPlace?: string
  settlement?: string
  category?: string
  creatorRoom?: string
  bankName?: string
  accountNumber?: string
  accountHolder?: string
  unitPrice?: number
  deadline?: string
  maxParticipants?: number
  payments?: { room: string; paid: boolean }[]
  messages: ChatMessage[]
}

export interface NotificationSettings {
  expiryEnabled: boolean
  reminderDays: number[]
  overdueEnabled: boolean
  highRiskEnabled: boolean
  chatEnabled: boolean
  groupBuyEnabled: boolean
  hygieneEnabled: boolean
}

export interface FridgeMetric {
  id: string
  dorm?: string
  building: string
  floor: string
  label: string
  used: number
  capacity: number
  reports: number
  expired: number
  /** RA가 운영 종료한 냉장고. 기록은 보존하고 학생/운영 화면에서는 숨깁니다. */
  archivedAt?: string
}

export const initialFoods: FoodItem[] = [
  {
    id: "food-1",
    name: "그릭요거트",
    kind: "미개봉 냉장식품",
    category: "유제품",
    zone: "냉장실",
    position: "중단 선반",
    shelfId: "R2",
    size: "small",
    units: 1,
    expiry: "2026-09-21",
    expiryProofName: "yogurt-label.jpg",
    expiryVerified: true,
    registeredAt: "2026-09-17T09:00:00.000Z",
    reminderAt: "2026-09-20T09:00:00.000Z",
    reminderRule: "소비기한 1일 전",
    registrationMode: "personal",
    coOwners: ["302호"],
    price: 4800,
    guideId: "sealed-dairy",
  },
  {
    id: "food-2",
    name: "닭가슴살 3팩",
    kind: "냉동식품",
    category: "육류",
    zone: "냉동고",
    position: "상단 선반",
    shelfId: "F1",
    size: "medium",
    units: 2,
    photoName: "chicken.jpg",
    expiryVerified: false,
    registeredAt: "2026-09-15T12:00:00.000Z",
    reminderAt: "2026-09-29T12:00:00.000Z",
    reminderRule: "사진 등록 · 14일 후 확인",
    registrationMode: "shared",
    coOwners: ["302호", "304호"],
    price: 12900,
    guideId: "frozen-meat",
  },
]

export const initialReports: IncidentReport[] = [
  {
    id: "report-1",
    category: "악취·오염",
    location: "무악학사 1관 3층 · 냉장고 B 하단",
    description: "검은 봉투 주변에서 강한 냄새가 납니다.",
    photoName: "fridge-zone-b.jpg",
    reporter: "302호 · 익명",
    status: "접수",
    createdAt: "2026-09-18T08:40:00.000Z",
  },
]

export const initialRooms: ChatRoom[] = [
  {
    id: "care-3f",
    type: "care",
    title: "3층 냉장고 정리방",
    location: "무악학사 1관 3층",
    adminPresent: true,
    participants: 18,
    messages: [
      { id: "m1", author: "RA 김관리", role: "admin", text: "오늘 22시까지 기한이 지난 음식 확인 부탁드립니다.", sentAt: "18:10" },
      { id: "m2", author: "318호", role: "student", text: "하단 검은 봉투 제 것이 아닙니다. 신고로 남길게요.", sentAt: "18:14" },
    ],
  },
  {
    id: "buy-chicken",
    type: "groupbuy",
    title: "닭가슴살 20팩 공동구매",
    location: "무악학사 1관 3층",
    adminPresent: true,
    participants: 5,
    pickupPlace: "1관 1층 로비",
    settlement: "1인 12,500원 · 계좌이체",
    category: "육류",
    creatorRoom: "302호",
    bankName: "신한",
    accountNumber: "110-123-456789",
    accountHolder: "홍길동",
    unitPrice: 12500,
    deadline: "2026-09-21",
    maxParticipants: 6,
    payments: [
      { room: "301호", paid: true },
      { room: "304호", paid: true },
      { room: "305호", paid: false },
    ],
    messages: [
      { id: "m3", author: "302호", role: "student", text: "금요일 19시에 수령하겠습니다.", sentAt: "17:42" },
    ],
  },
]

export const initialFridges: FridgeMetric[] = [
  { id: "1-2-a", dorm: "무악학사", building: "1관", floor: "2층", label: "냉장고 A", used: 26, capacity: 40, reports: 1, expired: 1 },
  { id: "1-3-a", dorm: "무악학사", building: "1관", floor: "3층", label: "냉장고 A", used: 34, capacity: 40, reports: 1, expired: 4 },
  { id: "1-3-b", dorm: "무악학사", building: "1관", floor: "3층", label: "냉장고 B", used: 38, capacity: 40, reports: 3, expired: 6 },
  { id: "2-4-a", dorm: "무악학사", building: "2관", floor: "4층", label: "냉장고 A", used: 19, capacity: 40, reports: 0, expired: 0 },
]

export const initialResidence: ResidenceProfile = {
  school: "연세대학교",
  dorm: "무악학사",
  building: "1관",
  floor: 3,
  fridgeName: "공용 냉장고 B",
}

export const initialProfile: UserProfile = {
  name: "홍길동",
  studentId: "2026123456",
  phone: "010-1234-5678",
  room: "302호",
}

export const initialFridgeLayout: FridgeLayout = {
  fridgeShelves: 6,
  freezerShelves: 4,
  doorPockets: 5,
  freezerDoorPockets: 3,
  drawers: 2,
}

export const initialImpact: ImpactStats = {
  foodSavedKg: 3.8,
  carbonSavedKg: 9.5,
  moneySaved: 42800,
  completedActions: 12,
  points: 145,
}

export const initialStoragePolicy: StoragePolicy = {
  totalUnits: 8,
  fridgeUnits: 6,
  freezerUnits: 4,
  perSlotUnits: 3,
}

export const initialActivities: FoodActivity[] = [
  { id: "activity-1", type: "registered", units: 1, at: "2026-09-17T09:00:00.000Z" },
  { id: "activity-2", type: "registered", units: 2, at: "2026-09-15T12:00:00.000Z" },
  { id: "activity-3", type: "consumed", units: 2, at: "2026-09-13T18:30:00.000Z" },
  { id: "activity-4", type: "discarded", units: 1, at: "2026-09-10T20:10:00.000Z" },
]

export const initialAnnouncements: FridgeAnnouncement[] = []

export const initialCommunityGoals: Record<string, CommunityGoal> = {
  "1-2-a": { fridgeId: "1-2-a", target: 8, completed: 3, weekLabel: "이번 주" },
  "1-3-a": { fridgeId: "1-3-a", target: 10, completed: 5, weekLabel: "이번 주" },
  "1-3-b": { fridgeId: "1-3-b", target: 10, completed: 6, weekLabel: "이번 주" },
  "2-4-a": { fridgeId: "2-4-a", target: 8, completed: 4, weekLabel: "이번 주" },
}

export const initialAdminCodes: AdminAccessCode[] = [
  {
    id: "code-demo",
    code: "RA-2026",
    label: "3층 담당 RA",
    createdAt: "2026-09-18T09:00:00.000Z",
    active: true,
  },
]

export const initialNotificationSettings: NotificationSettings = {
  expiryEnabled: true,
  reminderDays: [3, 1, 0],
  overdueEnabled: true,
  highRiskEnabled: true,
  chatEnabled: true,
  groupBuyEnabled: true,
  hygieneEnabled: true,
}

export function uid(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
