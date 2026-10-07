import { useMemo, useState } from "react"
import { getFoodGuide } from "../../foodGuide"
import FoodIcon from "../../components/FoodIcon"
import { foodTargetDate, formatFoodQuantity, quantityStepFor, type FoodItem, type UserProfile } from "../../model"

interface Props {
  onBack: () => void
  onNext: (screen: string) => void
  foods: FoodItem[]
  profile: UserProfile
  onComplete: (id: string, outcome: "consumed" | "discarded") => void
  onUpdateQuantity: (id: string, quantity: number) => void
}

function daysLeft(food: FoodItem) {
  const target = foodTargetDate(food)
  return Math.ceil((target.getTime() - Date.now()) / 86400000)
}

export default function MyFoodsScreen({ onBack, onNext, foods, profile, onComplete, onUpdateQuantity }: Props) {
  const [zone, setZone] = useState<"전체" | "냉장실" | "냉동고">("전체")
  const myFoods = useMemo(() => foods.filter(food => !food.coOwners?.length || food.coOwners.includes(profile.room)), [foods, profile.room])
  const visible = myFoods.filter(food => zone === "전체" || food.zone === zone).sort((a, b) => daysLeft(a) - daysLeft(b))
  const shared = myFoods.filter(food => food.registrationMode === "shared").length
  const urgent = myFoods.filter(food => daysLeft(food) <= 2).length

  return <div className="dm-screen my-foods-screen">
    <header className="dm-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>{profile.room} 소유 음식</p><h2>내 음식</h2></div><button className="dm-header-action" onClick={() => onNext("addFood")}>＋ 등록</button></header>
    <main className="dm-stack">
      <section className="my-food-summary"><div><strong>{myFoods.length}</strong><span>등록 품목</span></div><div><strong>{shared}</strong><span>공동 등록</span></div><div><strong>{urgent}</strong><span>곧 확인</span></div></section>
      <div className="dm-segmented three">{(["전체", "냉장실", "냉동고"] as const).map(item => <button key={item} className={zone === item ? "active" : ""} onClick={() => setZone(item)}>{item}</button>)}</div>
      <section className="my-food-grid">{visible.map(food => {
        const remaining = daysLeft(food)
        const guide = getFoodGuide(food.kind, food.category)
        return <article key={food.id} className="my-food-card">
          <div className="my-food-photo">{food.photoData ? <img src={food.photoData} alt="" /> : <FoodIcon category={food.category} foodId={food.guideId?.replace(/^catalog-/, "")} emoji={food.icon} size="large" />}<b className={remaining <= 2 ? "urgent" : ""}>{remaining < 0 ? `${Math.abs(remaining)}일 지남` : remaining === 0 ? "오늘" : `D-${remaining}`}</b></div>
          <div className="my-food-body"><div className="dm-row between"><strong>{food.name}</strong><span className="slot-chip">{food.shelfId}</span></div><p>{food.category} · {food.position} · {food.units}칸</p><div className="my-food-quantity"><span>수량</span><button type="button" onClick={() => onUpdateQuantity(food.id, (food.quantity ?? 1) - quantityStepFor(food.quantityUnit ?? "개"))} aria-label={`${food.name} 수량 줄이기`}>−</button><strong>{formatFoodQuantity(food.quantity, food.quantityUnit)}</strong><button type="button" onClick={() => onUpdateQuantity(food.id, (food.quantity ?? 1) + quantityStepFor(food.quantityUnit ?? "개"))} aria-label={`${food.name} 수량 늘리기`}>+</button></div>{food.registrationMode === "shared" && <div className="shared-owners">공동 소유 · {food.coOwners?.join(", ")}</div>}<div className="food-date-lines">{food.expiry && <small>소비기한 · {food.expiry}</small>}{food.openedAt && <small>개봉일 · {food.openedAt}</small>}{food.openedUseBy && <small className="opened">개봉 후 상태 확인 · {food.openedUseBy}</small>}{!food.expiry && !food.openedUseBy && <small>{food.reminderRule}</small>}</div>{food.memo && <p className="food-memo-preview">✎ {food.memo}</p>}<details><summary>보관 안내 보기</summary><p><b>보관</b> {guide.storage}</p><p><b>주의</b> {guide.caution}</p></details><div className="my-food-actions"><button onClick={() => onComplete(food.id, "consumed")}>먹었어요</button><button onClick={() => onComplete(food.id, "discarded")}>폐기</button></div></div>
        </article>
      })}{visible.length === 0 && <div className="dm-empty">이 조건에 맞는 음식이 없습니다.</div>}</section>
    </main>
  </div>
}
