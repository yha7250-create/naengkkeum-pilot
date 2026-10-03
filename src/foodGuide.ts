export const foodKinds = ["남은 배달음식", "개봉 식품", "구입 식품", "미개봉 냉장식품", "냉동식품"] as const
export const foodCategories = ["유제품", "육류", "채소류", "과일", "음료", "반찬", "냉동식품", "기타"] as const

export type FoodKind = typeof foodKinds[number]
export type FoodCategory = typeof foodCategories[number]

export interface FoodGuide {
  id: string
  days: number
  title: string
  summary: string
  caution: string
  storage: string
}

const categoryDays: Record<FoodCategory, number> = {
  유제품: 3,
  육류: 2,
  채소류: 5,
  과일: 5,
  음료: 5,
  반찬: 4,
  냉동식품: 30,
  기타: 3,
}

const kindLimit: Record<FoodKind, number> = {
  "남은 배달음식": 4,
  "개봉 식품": 5,
  "구입 식품": 7,
  "미개봉 냉장식품": 14,
  "냉동식품": 30,
}

const cautionByCategory: Record<FoodCategory, string> = {
  유제품: "개봉 후에는 뚜껑을 밀폐하고 냄새·분리·곰팡이가 보이면 날짜와 관계없이 폐기하세요.",
  육류: "생고기는 익힌 음식과 분리하고, 해동한 제품은 다시 얼리지 않는 것을 권장해요.",
  채소류: "물기를 줄여 보관하고 무름·점액·곰팡이가 생기면 섭취하지 마세요.",
  과일: "자른 과일은 밀폐 냉장하고 변색·이상 냄새가 있으면 폐기하세요.",
  음료: "입을 대어 마신 음료는 더 빨리 변질될 수 있어 가능한 한 빨리 섭취하세요.",
  반찬: "깨끗한 도구로 덜어 먹고 상온에 오래 둔 음식은 다시 보관하지 마세요.",
  냉동식품: "-18℃ 이하 보관을 권장하며 해동 흔적이나 포장 손상이 있으면 상태를 확인하세요.",
  기타: "제품 표시사항과 보관방법을 우선 확인하고 이상 냄새·색·질감이 있으면 섭취하지 마세요.",
}

export function getFoodGuide(kind: string, category: string): FoodGuide {
  const safeKind = (foodKinds.includes(kind as FoodKind) ? kind : "구입 식품") as FoodKind
  const safeCategory = (foodCategories.includes(category as FoodCategory) ? category : "기타") as FoodCategory
  const frozen = safeKind === "냉동식품" || safeCategory === "냉동식품"
  const days = frozen ? 30 : Math.min(kindLimit[safeKind], categoryDays[safeCategory])
  const highRisk = safeKind === "남은 배달음식" || safeKind === "개봉 식품"

  return {
    id: `${safeKind}-${safeCategory}`,
    days,
    title: `${safeCategory} · ${safeKind}`,
    summary: frozen ? "냉동 보관 상태 확인을 위해 30일 뒤 점검해요." : highRisk ? `${days}일 안에 상태를 확인하고 섭취하는 것을 권장해요.` : `표시된 소비기한을 우선하고, 미입력 시 ${days}일 뒤 점검해요.`,
    caution: cautionByCategory[safeCategory],
    storage: frozen ? "냉동고 -18℃ 이하 권장" : "냉장고 0~5℃ 권장 · 조리식품은 가능한 빨리 냉장",
  }
}

export const foodSafetySource = {
  label: "식품의약품안전처·식품안전나라 공개 안전자료 기반",
  url: "https://www.mfds.go.kr/brd/m_824/view.do?seq=45289",
  note: "표시된 일수는 안전을 보증하는 소비기한이 아니라 기숙사 냉장고 정리를 위한 상태 확인 알림값입니다. 제품 포장의 보관방법·소비기한이 가장 우선이며, 냄새·색·질감이 이상하면 날짜가 남아도 섭취하지 마세요.",
}
