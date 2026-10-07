import { useMemo, useState } from "react"
import CameraCapture from "../../components/CameraCapture"
import DynamicFridge, { type FridgeSlot, type FridgeZone } from "../../components/DynamicFridge"
import FoodIcon from "../../components/FoodIcon"
import { foodCatalog, foodCatalogGroups, type FoodCatalogGroup, type FoodCatalogItem } from "../../foodCatalog"
import { foodCategories, foodKinds, foodSafetySource, getFoodGuide } from "../../foodGuide"
import { foodQuantityUnits, normalizeFoodQuantity, quantityStepFor, uid, type FoodItem, type FoodQuantityUnit, type FoodQuickPick, type FridgeLayout, type ResidenceProfile, type StoragePolicy, type StorageSize, type UserProfile } from "../../model"

interface Props {
  onBack: () => void
  onDone: (food: FoodItem) => void
  usedUnits: number
  usedUnitsByZone: Record<"냉장실" | "냉동고", number>
  storagePolicy: StoragePolicy
  foods: FoodItem[]
  layout: FridgeLayout
  residence: ResidenceProfile
  profile: UserProfile
  quickFoods: FoodQuickPick[]
}

const sizes: { key: StorageSize; label: string; units: number }[] = [
  { key: "small", label: "우유 1팩 정도", units: 1 },
  { key: "medium", label: "반찬통 정도", units: 2 },
  { key: "large", label: "냄비 정도", units: 3 },
]

const quantityUnitByFood: Record<string, FoodQuantityUnit> = {
  egg: "개", milk: "팩", tofu: "모", "green-onion": "단", cabbage: "개", spinach: "단", mushroom: "팩", apple: "개", "cherry-tomato": "팩", garlic: "g",
  pork: "g", beef: "g", chicken: "g", fish: "g", "frozen-dumpling": "봉", "frozen-chicken-breast": "팩", "seafood-mix": "봉", "frozen-shrimp": "봉", bacon: "팩", "fish-cake": "봉",
  kimchi: "kg", cheese: "장", "plain-yogurt": "팩", butter: "g", doenjang: "g", gochujang: "g", ketchup: "병", mayonnaise: "병", "oyster-sauce": "병", jam: "병",
  cola: "캔", "sports-drink": "병", beer: "캔", "soy-milk": "팩", water: "L", coffee: "캔",
}

function suggestedQuantityUnit(food: FoodCatalogItem): FoodQuantityUnit {
  if (quantityUnitByFood[food.id]) return quantityUnitByFood[food.id]
  if (food.category === "냉동식품") return "봉"
  if (food.category === "음료") return "병"
  if (food.category === "육류") return "g"
  if (food.category === "유제품") return "팩"
  return "개"
}

function initialQuantityFor(unit: FoodQuantityUnit) {
  if (unit === "g" || unit === "mL") return 500
  if (unit === "kg" || unit === "L") return 1
  return 1
}

function addDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

function addDaysToDate(value: string, days: number) {
  const date = new Date(`${value}T12:00:00`)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export default function AddFoodScreen({ onBack, onDone, usedUnits, usedUnitsByZone, storagePolicy, foods, layout, residence, profile, quickFoods }: Props) {
  const [name, setName] = useState("")
  const [selectedFoodId, setSelectedFoodId] = useState("")
  const [catalogQuery, setCatalogQuery] = useState("")
  const [catalogGroup, setCatalogGroup] = useState<"전체" | FoodCatalogGroup>("전체")
  const [showAllFoods, setShowAllFoods] = useState(false)
  const [showAdvancedType, setShowAdvancedType] = useState(false)
  const [kind, setKind] = useState<string>(foodKinds[0])
  const [category, setCategory] = useState<string>(foodCategories[0])
  const [size, setSize] = useState<StorageSize>("small")
  const [storageZone, setStorageZone] = useState<FridgeZone>("냉장실")
  const [slot, setSlot] = useState<FridgeSlot | null>(null)
  const [expiry, setExpiry] = useState("")
  const [openedAt, setOpenedAt] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [quantityUnit, setQuantityUnit] = useState<FoodQuantityUnit>("개")
  const [memo, setMemo] = useState("")
  const [price, setPrice] = useState("")
  const [mode, setMode] = useState<"personal" | "shared">("personal")
  const [roomInput, setRoomInput] = useState("")
  const [coOwners, setCoOwners] = useState<string[]>([profile.room])
  const [photoData, setPhotoData] = useState("")
  const [photoName, setPhotoName] = useState("")
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)

  const units = sizes.find(item => item.key === size)?.units ?? 1
  const zoneLimit = storageZone === "냉장실" ? storagePolicy.fridgeUnits : storagePolicy.freezerUnits
  const slotUsed = slot ? foods.filter(food => food.shelfId === slot.id && (!food.coOwners?.length || food.coOwners.includes(profile.room))).reduce((sum, food) => sum + food.units, 0) : 0
  const selectedFood = useMemo(() => foodCatalog.find(food => food.id === selectedFoodId), [selectedFoodId])
  const filteredFoods = useMemo(() => foodCatalog.filter(food => {
    const groupMatch = catalogGroup === "전체" || food.group === catalogGroup
    const query = catalogQuery.trim().toLowerCase()
    return groupMatch && (!query || `${food.name} ${food.group}`.toLowerCase().includes(query))
  }), [catalogGroup, catalogQuery])
  const visibleFoods = showAllFoods || catalogQuery ? filteredFoods : filteredFoods.slice(0, 12)
  const quickOptions = useMemo(() => {
    if (quickFoods.length) return quickFoods.slice(0, 5)
    return ["milk", "egg", "leftover-chicken-pizza", "frozen-dumpling", "cola"].map(id => {
      const food = foodCatalog.find(item => item.id === id)!
      return { key: food.id, catalogId: food.id, name: food.name, kind: food.kind, category: food.category, zone: food.zone, icon: food.icon, quantityUnit: suggestedQuantityUnit(food), count: 0, lastUsedAt: "" } satisfies FoodQuickPick
    })
  }, [quickFoods])
  const guide = useMemo(() => selectedFood ? {
    id: `catalog-${selectedFood.id}`,
    days: selectedFood.days,
    title: selectedFood.name,
    summary: `제품 표시사항을 우선하고, 별도 날짜를 입력하지 않으면 ${selectedFood.days}일 뒤 상태를 확인하도록 알려드려요.`,
    storage: selectedFood.storage,
    caution: selectedFood.caution,
  } : getFoodGuide(kind, category), [selectedFood, kind, category])
  const openedUseBy = useMemo(() => openedAt ? addDaysToDate(openedAt, guide.days) : "", [openedAt, guide.days])
  const reminder = useMemo(() => {
    const candidates = [
      expiry ? { date: new Date(`${expiry}T09:00:00`), text: "소비기한 3일 전부터 단계 알림" } : null,
      openedUseBy ? { date: new Date(`${openedUseBy}T09:00:00`), text: `개봉 후 ${guide.days}일 · 상태 확인 권장` } : null,
    ].filter((item): item is { date: Date; text: string } => Boolean(item))
    if (!candidates.length) return { date: addDays(guide.days), text: `날짜 미입력 · ${guide.days}일 후 상태 확인` }
    return candidates.sort((a, b) => a.date.getTime() - b.date.getTime())[0]
  }, [expiry, openedUseBy, guide.days])

  function addRoom() {
    const clean = roomInput.trim()
    if (!clean) return
    const normalized = clean.endsWith("호") ? clean : `${clean}호`
    if (coOwners.includes(normalized)) return
    setCoOwners(items => [...items, normalized])
    setRoomInput("")
  }

  function chooseFood(food: FoodCatalogItem) {
    setSelectedFoodId(food.id)
    setName(food.name)
    setKind(food.kind)
    setCategory(food.category)
    setStorageZone(food.zone)
    const nextUnit = suggestedQuantityUnit(food)
    setQuantityUnit(nextUnit)
    setQuantity(initialQuantityFor(nextUnit))
    setSlot(null)
    setError("")
  }

  function chooseQuickFood(quick: FoodQuickPick) {
    const catalogFood = quick.catalogId ? foodCatalog.find(food => food.id === quick.catalogId) : undefined
    if (catalogFood) {
      chooseFood(catalogFood)
      return
    }
    setSelectedFoodId("")
    setName(quick.name)
    setKind(quick.kind)
    setCategory(quick.category)
    setStorageZone(quick.zone)
    setQuantityUnit(quick.quantityUnit)
    setQuantity(initialQuantityFor(quick.quantityUnit))
    setSlot(null)
    setError("")
  }

  function changeQuantity(direction: -1 | 1) {
    const step = quantityStepFor(quantityUnit)
    setQuantity(value => normalizeFoodQuantity(value + direction * step, quantityUnit))
  }

  function submit() {
    if (!name.trim()) return setError("음식 이름을 입력해 주세요.")
    if (!Number.isFinite(quantity) || quantity <= 0) return setError("수량을 0보다 크게 입력해 주세요.")
    if (openedAt && new Date(`${openedAt}T12:00:00`) > new Date()) return setError("개봉일은 오늘 또는 이전 날짜로 입력해 주세요.")
    if (!slot) return setError("냉장고 그림에서 보관할 칸을 선택해 주세요.")
    if (usedUnits + units > storagePolicy.totalUnits) return setError(`전체 보관 한도 ${storagePolicy.totalUnits}칸을 초과합니다. 기존 음식을 소비·폐기한 후 등록해 주세요.`)
    if (usedUnitsByZone[slot.zone] + units > (slot.zone === "냉장실" ? storagePolicy.fridgeUnits : storagePolicy.freezerUnits)) return setError(`${slot.zone} 개인 한도를 초과합니다. 다른 구역을 사용하거나 기존 음식을 먼저 처리해 주세요.`)
    if (slotUsed + units > storagePolicy.perSlotUnits) return setError(`같은 칸은 1인당 ${storagePolicy.perSlotUnits}칸까지만 사용할 수 있어요. 다른 선반을 선택해 주세요.`)
    if (mode === "shared" && coOwners.length < 2) return setError("공동 등록할 호수를 한 곳 이상 추가해 주세요.")
    onDone({
      id: uid("food"), name: name.trim(), kind, category, zone: slot.zone,
      position: slot.label, shelfId: slot.id, size, units,
      photoData: photoData || undefined, photoName: photoName || undefined,
      expiry: expiry || undefined, openedAt: openedAt || undefined, openedUseBy: openedUseBy || undefined,
      quantity: normalizeFoodQuantity(quantity, quantityUnit), quantityUnit, memo: memo.trim() || undefined, expiryVerified: false,
      registeredAt: new Date().toISOString(), reminderAt: reminder.date.toISOString(), reminderRule: reminder.text,
      registrationMode: mode, coOwners: mode === "shared" ? coOwners : [profile.room],
      price: price ? Number(price) : undefined, guideId: guide.id,
      icon: selectedFood?.icon,
    })
    setSaved(true)
    window.setTimeout(onBack, 700)
  }

  return (
    <div className="dm-screen add-food-flow">
      <header className="dm-header"><button className="dm-icon-button dark" onClick={onBack}>‹</button><div><p>{residence.dorm} {residence.building} {residence.floor}층</p><h2>음식 등록</h2></div><span className="dm-step">{usedUnits}/{storagePolicy.totalUnits}칸</span></header>
      <main className="dm-stack">
        <section className="storage-limit-card"><div><span>내 공간 사용량</span><strong>{usedUnits}<small>/{storagePolicy.totalUnits}칸</small></strong></div><div className="limit-bars"><p><span>냉장 {usedUnitsByZone["냉장실"]}/{storagePolicy.fridgeUnits}</span><i><b style={{ width: `${Math.min(100, usedUnitsByZone["냉장실"] / storagePolicy.fridgeUnits * 100)}%` }} /></i></p><p><span>냉동 {usedUnitsByZone["냉동고"]}/{storagePolicy.freezerUnits}</span><i><b className="freezer" style={{ width: `${Math.min(100, usedUnitsByZone["냉동고"] / storagePolicy.freezerUnits * 100)}%` }} /></i></p></div><small>같은 선반은 최대 {storagePolicy.perSlotUnits}칸까지 사용할 수 있어요.</small></section>
        <section className="food-picker-card">
          <div className="food-picker-title"><div><span className="dm-eyebrow">QUICK PICK</span><h3>어떤 음식을 보관하나요?</h3><p>아이콘을 고르면 분류와 권장 보관 위치가 자동으로 채워져요.</p></div><b>60</b></div>
          <div className="quick-foods"><div><strong>빠른 추가</strong><small>{quickFoods.length ? "내가 자주 등록한 순서" : "기숙사 기본 추천"}</small></div><div>{quickOptions.map(food => <button type="button" key={food.key} onClick={() => chooseQuickFood(food)}><FoodIcon category={food.category} foodId={food.catalogId} emoji={food.icon} size="small" /><span>{food.name}</span>{food.count > 1 && <b>{food.count}회</b>}</button>)}</div></div>
          <label className="food-search"><span>⌕</span><input value={catalogQuery} onChange={event => setCatalogQuery(event.target.value)} placeholder="음식 이름 검색" /><button type="button" onClick={() => setCatalogQuery("")} aria-label="검색어 지우기">{catalogQuery ? "×" : ""}</button></label>
          <div className="food-group-tabs">{foodCatalogGroups.map(group => <button type="button" key={group} className={catalogGroup === group ? "active" : ""} onClick={() => { setCatalogGroup(group); setShowAllFoods(false) }}>{group}</button>)}</div>
          <div className="food-catalog-grid">{visibleFoods.map(food => <button type="button" key={food.id} className={selectedFoodId === food.id ? "active" : ""} onClick={() => chooseFood(food)}><FoodIcon category={food.category} foodId={food.id} emoji={food.icon} size="medium" /><span>{food.name}</span><small>{food.zone === "냉동고" ? "냉동" : "냉장"}</small></button>)}</div>
          {!visibleFoods.length && <p className="catalog-empty">검색 결과가 없어요. 아래에서 직접 이름을 입력해 주세요.</p>}
          {!catalogQuery && filteredFoods.length > 12 && <button type="button" className="catalog-more" onClick={() => setShowAllFoods(value => !value)}>{showAllFoods ? "간단히 보기" : `${filteredFoods.length - 12}개 더 보기`}</button>}
        </section>
        <section><label className="dm-label" htmlFor="food-name">음식 이름 <b>필수</b></label><input id="food-name" className="dm-input large" value={name} onChange={event => { setName(event.target.value); if (event.target.value !== selectedFood?.name) setSelectedFoodId("") }} placeholder="목록에 없다면 직접 입력하세요" />{selectedFood && <p className="selected-food-hint"><span>{selectedFood.icon}</span><b>{selectedFood.name}</b> · {selectedFood.group} · {selectedFood.zone} 추천</p>}</section>
        <section><span className="dm-label">수량과 단위</span><div className="quantity-unit-row"><div className="quantity-picker"><button type="button" onClick={() => changeQuantity(-1)} aria-label="수량 줄이기">−</button><input type="number" min={quantityStepFor(quantityUnit)} step={quantityStepFor(quantityUnit)} value={quantity} onChange={event => setQuantity(Number(event.target.value))} aria-label="수량" /><button type="button" onClick={() => changeQuantity(1)} aria-label="수량 늘리기">+</button></div><select className="quantity-unit-select" value={quantityUnit} onChange={event => { const unit = event.target.value as FoodQuantityUnit; setQuantityUnit(unit); setQuantity(initialQuantityFor(unit)) }} aria-label="수량 단위">{foodQuantityUnits.map(unit => <option key={unit} value={unit}>{unit}</option>)}</select></div><p className="dm-help">선택한 음식에 맞는 단위를 먼저 추천해요. 수량과 냉장고 공간 점유 칸 수는 별도로 계산합니다.</p></section>
        <section><span className="dm-label">등록 방식</span><div className="dm-segmented"><button className={mode === "personal" ? "active" : ""} onClick={() => setMode("personal")}>나만 등록</button><button className={mode === "shared" ? "active" : ""} onClick={() => setMode("shared")}>함께 등록</button></div>
          {mode === "shared" && <div className="shared-register"><p>같이 소유할 방을 추가하면 각자의 ‘내 음식’에 함께 보여요.</p><div className="room-add"><input className="dm-input" inputMode="numeric" value={roomInput} onChange={event => setRoomInput(event.target.value)} onKeyDown={event => event.key === "Enter" && addRoom()} placeholder="예: 304" /><button onClick={addRoom}>추가</button></div><div className="owner-chips">{coOwners.map(room => <button key={room} disabled={room === profile.room} onClick={() => setCoOwners(items => items.filter(item => item !== room))}>{room}{room === profile.room ? " · 나" : " ×"}</button>)}</div></div>}
        </section>
        <section className="food-guide-card"><div className="dm-row between"><strong>📖 {guide.title} 보관 가이드</strong><span>자동 추천</span></div><h3>{guide.days}일 뒤 상태 확인 알림</h3><em>안전 섭취기한 아님 · 제품 표시 우선</em><p>{guide.summary}</p><p><b>보관</b> {guide.storage}</p><p><b>주의</b> {guide.caution}</p><a href={foodSafetySource.url} target="_blank" rel="noreferrer">{foodSafetySource.label} ↗</a><small>{foodSafetySource.note}</small></section>
        <section className="advanced-food-type"><button type="button" onClick={() => setShowAdvancedType(value => !value)}><span><b>분류 직접 수정</b><small>{kind} · {category}</small></span><i>{showAdvancedType ? "−" : "+"}</i></button>{showAdvancedType && <div className="advanced-food-type-body"><span className="dm-label">음식 종류</span><div className="dm-pills guide-pills">{foodKinds.map(item => <button key={item} className={kind === item ? "active" : ""} onClick={() => { setKind(item); setSelectedFoodId("") }}>{item}</button>)}</div><span className="dm-label">카테고리</span><div className="food-category-grid">{foodCategories.map(item => <button key={item} className={category === item ? "active" : ""} onClick={() => { setCategory(item); setSelectedFoodId("") }}><FoodIcon category={item} size="medium" /><span>{item}</span></button>)}</div></div>}</section>
        <section><span className="dm-label">보관할 칸 선택</span><div className="fridge-zone-switch selector-zone-switch"><button className={storageZone === "냉장실" ? "active fridge" : ""} onClick={() => { setStorageZone("냉장실"); setSlot(null) }}><span>❄️</span><strong>냉장실</strong></button><button className={storageZone === "냉동고" ? "active freezer" : ""} onClick={() => { setStorageZone("냉동고"); setSlot(null) }}><span>🧊</span><strong>냉동고</strong></button></div><p className="tap-guide">실제로 음식을 넣을 칸을 선택해 주세요. 구조는 RA가 등록한 그대로 표시됩니다.</p><div className="fridge-selector"><DynamicFridge layout={layout} zoneView={storageZone} selected={slot?.id} onSelect={setSlot} compact /></div>{slot && <div className="selected-location"><span>{slot.id}</span><strong>{slot.label}</strong><small>{slot.zone}</small></div>}</section>
        <section><span className="dm-label">음식 크기</span><div className="size-selector">{sizes.map(item => <button key={item.key} className={size === item.key ? "active" : ""} onClick={() => setSize(item.key)}><strong>{item.units}칸</strong><small>{item.label}</small></button>)}</div><p className={`limit-preview ${usedUnits + units > storagePolicy.totalUnits || usedUnitsByZone[storageZone] + units > zoneLimit ? "over" : ""}`}>등록 후 전체 {usedUnits + units}/{storagePolicy.totalUnits}칸 · {storageZone} {usedUnitsByZone[storageZone] + units}/{zoneLimit}칸</p></section>
        <section><label className="dm-label" htmlFor="price">구매 가격 <small>(선택)</small></label><div className="price-input"><input id="price" className="dm-input" type="number" min="0" value={price} onChange={event => setPrice(event.target.value)} placeholder="2980" /><span>원</span></div><p className="dm-help">가격을 입력하면 절감 리포트에서 아낀 금액을 더 정확히 계산할 수 있어요.</p></section>
        <CameraCapture value={photoData} onChange={(data, file) => { setPhotoData(data); setPhotoName(file) }} />
        <section className="expiry-card"><div><label className="dm-label" htmlFor="expiry">소비기한 <small>(선택)</small></label><small>포장에 표시된 날짜가 있으면 입력해 주세요.</small></div><div className="food-date-grid"><label className="food-date-card"><span>소비기한</span><input id="expiry" type="date" className="dm-input" value={expiry} onChange={event => setExpiry(event.target.value)} /></label><label className="food-date-card"><span>개봉일 <small>(선택)</small></span><input id="opened-at" type="date" className="dm-input" value={openedAt} max={new Date().toISOString().slice(0, 10)} onChange={event => setOpenedAt(event.target.value)} /></label></div>{openedUseBy && <div className="opened-recommendation"><span>개봉 후 상태 확인 권장일</span><strong>{openedUseBy}</strong><small>{guide.title} 기준 {guide.days}일 후 · 제품 표시와 냄새·색·질감을 우선 확인하세요.</small></div>}<div className="dm-notice"><strong>예정 알림</strong><span>{reminder.text}</span></div></section>
        <section><label className="dm-label" htmlFor="food-memo">메모 <small>(선택)</small></label><textarea id="food-memo" className="dm-input food-memo" value={memo} maxLength={120} onChange={event => setMemo(event.target.value)} placeholder="예: 금요일 아침에 먹기, 소스는 문칸에 있음" /><p className="memo-count">{memo.length}/120</p></section>
        {error && <p className="dm-error">{error}</p>}{saved && <p className="dm-success">등록 정보가 ‘내 음식’과 냉장고 화면에 저장되었습니다.</p>}
        <button className="dm-primary" onClick={submit} disabled={saved}>등록 완료 · {slot?.id ?? "위치 미선택"}</button>
      </main>
    </div>
  )
}
