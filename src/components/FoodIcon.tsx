import type { ReactNode } from "react"

interface Props {
  category?: string
  emoji?: string
  foodId?: string
  size?: "small" | "medium" | "large"
}

const C = {
  green: "#83A85B", darkGreen: "#47744A", red: "#D95E61", orange: "#E99A45",
  yellow: "#F1C879", cream: "#FFF6E8", purple: "#7C7593", brown: "#93664C",
  blue: "#74A2B6", ink: "#3E4A43", white: "#FFFDF7",
}

type Glyph = "egg" | "carton" | "tofu" | "leaf" | "cabbage" | "mushroom" | "apple" | "tomato" | "garlic" | "meat" | "fish" | "dumpling" | "shrimp" | "bacon" | "skewer" | "jar" | "cheese" | "yogurt" | "butter" | "bottle" | "can" | "water" | "cup" | "pizza" | "pickle" | "bowl" | "riceball" | "lunchbox" | "sausage" | "seaweed" | "rice" | "nugget" | "chicken" | "soup" | "banana" | "sandwich" | "salad" | "generic"

const glyphByFoodId: Record<string, Glyph> = {
  egg: "egg", milk: "carton", tofu: "tofu", "green-onion": "leaf", cabbage: "cabbage", spinach: "leaf", mushroom: "mushroom", apple: "apple", "cherry-tomato": "tomato", garlic: "garlic",
  pork: "meat", beef: "meat", chicken: "chicken", fish: "fish", "frozen-dumpling": "dumpling", "frozen-chicken-breast": "chicken", "seafood-mix": "fish", "frozen-shrimp": "shrimp", bacon: "bacon", "fish-cake": "skewer",
  kimchi: "jar", cheese: "cheese", "plain-yogurt": "yogurt", butter: "butter", doenjang: "jar", gochujang: "jar", ketchup: "bottle", mayonnaise: "bottle", "oyster-sauce": "bottle", jam: "jar",
  cola: "can", "sports-drink": "bottle", beer: "can", "soy-milk": "carton", water: "water", coffee: "cup",
  "leftover-chicken-pizza": "pizza", "pickled-radish": "pickle", "dorm-slice-cheese": "cheese", "dorm-pizza-cheese": "cheese", "mini-sauce": "bottle", "ssam-sauce": "bowl",
  "triangle-kimbap": "riceball", lunchbox: "lunchbox", "sausage-bar": "sausage", "smoked-egg": "egg", "cereal-yogurt": "yogurt", "seasoned-seaweed": "seaweed",
  "microwave-dumpling": "dumpling", "fried-rice": "rice", nugget: "nugget", "hotdog-pizza": "sausage", "microwave-chicken": "chicken", "soup-kit": "soup",
  "snack-tomato": "tomato", "banana-fruitcup": "banana", "washed-apple": "apple", "sandwich-burger": "sandwich", "mini-jam-butter": "butter", salad: "salad",
}

const categoryGlyph: Record<string, Glyph> = {
  유제품: "carton", 육류: "meat", 채소류: "leaf", 과일: "apple", 음료: "bottle", 반찬: "bowl", 냉동식품: "dumpling", 기타: "generic",
}

function IconBase({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">{children}</svg>
}

function FoodGlyph({ kind }: { kind: Glyph }) {
  switch (kind) {
    case "egg": return <IconBase><ellipse cx="32" cy="34" rx="20" ry="24" fill={C.white}/><circle cx="32" cy="36" r="9" fill={C.yellow}/></IconBase>
    case "carton": return <IconBase><path d="M18 18h28l5 9v29H13V27z" fill={C.blue}/><path d="M18 18l6-9h20l2 9z" fill={C.white}/><rect x="19" y="31" width="26" height="17" rx="3" fill={C.cream}/><path d="M24 13h18" stroke={C.ink} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "tofu": return <IconBase><rect x="12" y="18" width="40" height="34" rx="8" fill={C.cream}/><circle cx="23" cy="29" r="2" fill={C.yellow}/><circle cx="40" cy="38" r="2" fill={C.yellow}/></IconBase>
    case "leaf": return <IconBase><path d="M17 49c3-23 18-35 34-34-1 17-11 33-34 34z" fill={C.green}/><path d="M20 46c8-9 16-16 26-24" stroke={C.darkGreen} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "cabbage": return <IconBase><circle cx="24" cy="34" r="15" fill={C.darkGreen}/><circle cx="40" cy="33" r="16" fill={C.green}/><circle cx="32" cy="25" r="14" fill="#9ABA70"/><path d="M32 22v31" stroke={C.cream} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "mushroom": return <IconBase><path d="M9 32c2-15 12-23 23-23s21 8 23 23z" fill={C.orange}/><rect x="26" y="29" width="13" height="25" rx="6" fill={C.cream}/></IconBase>
    case "apple": return <IconBase><path d="M14 34c0-14 9-22 18-17 9-5 18 3 18 17 0 14-8 22-18 22S14 48 14 34z" fill={C.red}/><path d="M32 17c1-7 5-11 11-12" stroke={C.darkGreen} strokeWidth="4" strokeLinecap="round"/><path d="M34 15c6-4 11-3 15 1-6 4-11 4-15-1z" fill={C.green}/></IconBase>
    case "tomato": return <IconBase><circle cx="32" cy="36" r="21" fill={C.red}/><path d="M32 17l5 7 10-2-7 8 4 7-12-5-12 5 4-7-7-8 10 2z" fill={C.green}/></IconBase>
    case "garlic": return <IconBase><path d="M32 11c0 8-5 10-10 13-7 4-10 10-8 19 2 9 9 14 18 14s16-5 18-14c2-9-1-15-8-19-5-3-10-5-10-13z" fill="#D7CAE5"/><path d="M32 21v33M24 28c-3 8-3 16 1 24M40 28c3 8 3 16-1 24" stroke="#9A89B1" strokeWidth="2.5" strokeLinecap="round"/></IconBase>
    case "meat": return <IconBase><path d="M11 38c0-16 15-30 30-26 12 3 16 17 8 27-7 9-12 6-17 14-6 9-21 1-21-15z" fill={C.red}/><ellipse cx="36" cy="29" rx="7" ry="8" fill={C.cream}/></IconBase>
    case "fish": return <IconBase><path d="M12 33c9-14 25-19 38-8l8-8v32l-8-8c-13 11-29 6-38-8z" fill={C.orange}/><circle cx="42" cy="28" r="2.5" fill={C.ink}/></IconBase>
    case "dumpling": return <IconBase><path d="M10 42c4-18 14-28 22-28s18 10 22 28c-9 11-35 11-44 0z" fill={C.cream}/><path d="M18 29l6 6 8-9 8 9 6-6" fill="none" stroke={C.brown} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
    case "shrimp": return <IconBase><path d="M46 15c13 18-4 41-23 34-12-5-12-20-3-25 7-4 16 1 15 9-1 5-6 7-10 5" fill="none" stroke={C.orange} strokeWidth="9" strokeLinecap="round"/><path d="M46 15l10-2-4 10z" fill={C.red}/></IconBase>
    case "bacon": return <IconBase><path d="M13 14h38l-5 36H8z" fill={C.red}/><path d="M18 15l-4 34M31 15l-4 35M44 15l-4 35" stroke={C.cream} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "skewer": return <IconBase><path d="M16 49l34-34" stroke={C.brown} strokeWidth="4" strokeLinecap="round"/><circle cx="24" cy="41" r="8" fill={C.orange}/><circle cx="36" cy="29" r="8" fill={C.yellow}/><circle cx="47" cy="18" r="8" fill={C.red}/></IconBase>
    case "jar": return <IconBase><rect x="17" y="17" width="30" height="39" rx="7" fill={C.orange}/><rect x="14" y="10" width="36" height="10" rx="4" fill={C.darkGreen}/><rect x="22" y="29" width="20" height="16" rx="6" fill={C.cream}/></IconBase>
    case "cheese": return <IconBase><path d="M9 49l8-27 36-10v37z" fill={C.yellow}/><circle cx="28" cy="36" r="4" fill={C.orange}/><circle cx="44" cy="24" r="3" fill={C.orange}/></IconBase>
    case "yogurt": return <IconBase><path d="M15 22h34l-4 34H19z" fill={C.purple}/><rect x="12" y="15" width="40" height="10" rx="5" fill={C.cream}/><circle cx="32" cy="37" r="8" fill={C.white}/></IconBase>
    case "butter": return <IconBase><path d="M12 27l30-14 11 11-30 16z" fill={C.yellow}/><path d="M12 27v18l11 8V40z" fill={C.orange}/><path d="M23 40l30-16v18L23 53z" fill="#F3D992"/></IconBase>
    case "bottle": return <IconBase><rect x="25" y="7" width="14" height="10" rx="3" fill={C.darkGreen}/><path d="M22 17h20l5 12v27H17V29z" fill={C.green}/><rect x="21" y="33" width="22" height="13" rx="4" fill={C.cream}/></IconBase>
    case "can": return <IconBase><rect x="18" y="10" width="28" height="46" rx="8" fill={C.red}/><rect x="18" y="14" width="28" height="5" fill={C.cream}/><path d="M29 10h9" stroke={C.ink} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "water": return <IconBase><path d="M32 7c8 13 18 24 18 34a18 18 0 01-36 0c0-10 10-21 18-34z" fill={C.blue}/><path d="M23 43c3 5 8 7 13 5" fill="none" stroke={C.white} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "cup": return <IconBase><path d="M14 18h31l-3 38H18z" fill={C.brown}/><path d="M45 25h6c8 0 8 15 0 15h-8" fill="none" stroke={C.brown} strokeWidth="5"/><rect x="11" y="12" width="37" height="8" rx="4" fill={C.cream}/></IconBase>
    case "pizza": return <IconBase><path d="M11 12c20 0 35 13 42 40L18 55z" fill={C.yellow}/><path d="M11 12c17 0 30 6 38 16" fill="none" stroke={C.brown} strokeWidth="7" strokeLinecap="round"/><circle cx="31" cy="32" r="5" fill={C.red}/><circle cx="39" cy="44" r="4" fill={C.red}/></IconBase>
    case "pickle": return <IconBase><rect x="16" y="12" width="32" height="44" rx="8" fill={C.cream}/><rect x="14" y="9" width="36" height="9" rx="4" fill={C.green}/><circle cx="26" cy="34" r="7" fill="#B7C66E"/><circle cx="39" cy="41" r="6" fill="#B7C66E"/></IconBase>
    case "bowl": return <IconBase><path d="M9 28h46c-2 18-11 28-23 28S11 46 9 28z" fill={C.orange}/><path d="M14 23c7-8 29-8 36 0" fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "riceball": return <IconBase><path d="M32 9L55 50H9z" fill={C.white}/><path d="M22 35h20v18H22z" fill={C.darkGreen}/><circle cx="31" cy="27" r="3" fill={C.red}/></IconBase>
    case "lunchbox": return <IconBase><rect x="8" y="16" width="48" height="40" rx="9" fill={C.orange}/><rect x="13" y="22" width="38" height="28" rx="6" fill={C.cream}/><circle cx="24" cy="34" r="7" fill={C.green}/><circle cx="40" cy="34" r="7" fill={C.red}/></IconBase>
    case "sausage": return <IconBase><rect x="12" y="23" width="40" height="19" rx="10" fill={C.red}/><path d="M10 25l-6-6M10 40l-6 6M54 25l6-6M54 40l6 6" stroke={C.brown} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "seaweed": return <IconBase><rect x="14" y="10" width="36" height="44" rx="6" fill={C.darkGreen}/><path d="M23 20h18M23 29h18M23 38h13" stroke={C.green} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "rice": return <IconBase><path d="M10 31h44c-2 17-10 25-22 25S12 48 10 31z" fill={C.blue}/><path d="M15 29c4-17 30-17 34 0z" fill={C.white}/><path d="M23 23l3-7M32 22v-8M41 23l-3-7" stroke={C.brown} strokeWidth="2.5" strokeLinecap="round"/></IconBase>
    case "nugget": return <IconBase><path d="M12 35c-4-12 5-22 17-20 8-8 22-1 20 10 9 7 3 22-9 22-9 10-25 2-28-12z" fill={C.orange}/><circle cx="27" cy="30" r="3" fill={C.yellow}/><circle cx="39" cy="38" r="3" fill={C.yellow}/></IconBase>
    case "chicken": return <IconBase><path d="M13 39c0-12 10-22 22-22 12 0 20 8 20 18S47 53 37 53c-13 0-24-5-24-14z" fill={C.orange}/><path d="M16 43L7 52M20 47l-8 10" stroke={C.cream} strokeWidth="6" strokeLinecap="round"/></IconBase>
    case "soup": return <IconBase><path d="M10 28h44v23H10z" fill={C.red}/><path d="M7 22h50v9H7z" fill={C.orange}/><path d="M22 18c-5-6 5-7 0-13M35 18c-5-6 5-7 0-13M47 18c-5-6 5-7 0-13" fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "banana": return <IconBase><path d="M13 16c4 23 20 33 39 23-3 17-18 24-31 15C9 46 5 29 13 16z" fill={C.yellow}/><path d="M13 16l4-7M52 39l5-4" stroke={C.brown} strokeWidth="4" strokeLinecap="round"/></IconBase>
    case "sandwich": return <IconBase><path d="M8 25l24-14 24 14-24 14z" fill={C.cream}/><path d="M8 25l24 14 24-14v14L32 53 8 39z" fill={C.yellow}/><path d="M11 31l21 13 21-13" fill="none" stroke={C.green} strokeWidth="5"/></IconBase>
    case "salad": return <IconBase><path d="M9 30h46c-3 17-11 25-23 25S12 47 9 30z" fill={C.blue}/><circle cx="22" cy="28" r="8" fill={C.green}/><circle cx="35" cy="24" r="9" fill="#9ABA70"/><circle cx="44" cy="31" r="7" fill={C.red}/></IconBase>
    default: return <IconBase><circle cx="32" cy="32" r="23" fill={C.green}/><path d="M20 34l8 8 17-20" fill="none" stroke={C.cream} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
  }
}

export default function FoodIcon({ category = "기타", emoji, foodId, size = "medium" }: Props) {
  const kind = (foodId && glyphByFoodId[foodId]) ?? categoryGlyph[category]
  if (kind) return <span className={`food-icon flat-food-icon ${size}`} role="img" aria-label={`${category} 아이콘`}><FoodGlyph kind={kind} /></span>
  if (emoji) return <span className={`food-icon catalog-emoji ${size}`} role="img" aria-label={`${category} 아이콘`}><span>{emoji}</span></span>
  return <span className={`food-icon flat-food-icon ${size}`} role="img" aria-label={`${category} 아이콘`}><FoodGlyph kind="generic" /></span>
}
