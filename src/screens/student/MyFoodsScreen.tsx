import { useMemo, useState } from "react"
import { getFoodGuide } from "../../foodGuide"
import FoodIcon from "../../components/FoodIcon"
import type { FoodItem, UserProfile } from "../../model"

interface Props {
  onBack: () => void
  onNext: (screen: string) => void
  foods: FoodItem[]
  profile: UserProfile
  onComplete: (id: string, outcome: "consumed" | "discarded") => void
}

function daysLeft(food: FoodItem) {
  const target = new Date(food.expiry ? `${food.expiry}T23:59:59` : food.reminderAt)
  return Math.ceil((target.getTime() - Date.now()) / 86400000)
}

export default function MyFoodsScreen({ onBack, onNext, foods, profile, onComplete }: Props) {
  const [zone, setZone] = useState<"전체" | "냉장실" | "냉동고">("전체")
  const myFoods = useMemo(() => foods.filter(food => !food.coOwners?.length || food.coOwners.includes(profile.room)), [foods, profile.room])
  const visible = myFoods.filter(food => zone === "전체" || food.zone === zone).sort((a, b) => daysLeft(a) - daysLeft(b))
  const shared = myFoods.filter(food => food.registrationMode === "shared").length
  const urgent = myFoods.filter(food => daysLeft(food) <= 2).length

  return <div className="dm-screen my-foods-screen">
    <header className="dm-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>{profile.room} 소유 음식</p><h2>내 음식</h2></div><button className="dm-header-action" onClick={() => onNext("addFood")}>＋ 등록</button></header>
    <main className="dm-stack">
      <section className="my-food-summary"><div><strong>{myFoods.length}</strong><span>전체 음식</span></div><div><strong>{shared}</strong><span>공동 등록</span></div><div><strong>{urgent}</strong><span>곧 확인</span></div></section>
      <div className="dm-segmented three">{(["전체", "냉장실", "냉동고"] as const).map(item => <button key={item} className={zone === item ? "active" : ""} onClick={() => setZone(item)}>{item}</button>)}</div>
      <section className="my-food-grid">{visible.map(food => {
        const remaining = daysLeft(food)
        const guide = getFoodGuide(food.kind, food.category)
        return <article key={food.id} className="my-food-card">
          <div className="my-food-photo">{food.photoData ? <img src={food.photoData} alt="" /> : <FoodIcon category={food.category} emoji={food.icon} size="large" />}<b className={remaining <= 2 ? "urgent" : ""}>{remaining < 0 ? `${Math.abs(remaining)}일 지남` : remaining === 0 ? "오늘" : `D-${remaining}`}</b></div>
          <div className="my-food-body"><div className="dm-row between"><strong>{food.name}</strong><span className="slot-chip">{food.shelfId}</span></div><p>{food.category} · {food.position} · {food.units}칸</p>{food.registrationMode === "shared" && <div className="shared-owners">공동 소유 · {food.coOwners?.join(", ")}</div>}<small>{food.expiry ? `소비기한 ${food.expiry}` : food.reminderRule}</small><details><summary>보관 안내 보기</summary><p>{guide.caution}</p></details><div className="my-food-actions"><button onClick={() => onComplete(food.id, "consumed")}>먹었어요</button><button onClick={() => onComplete(food.id, "discarded")}>폐기</button></div></div>
        </article>
      })}{visible.length === 0 && <div className="dm-empty">이 조건에 맞는 음식이 없습니다.</div>}</section>
    </main>
  </div>
}
