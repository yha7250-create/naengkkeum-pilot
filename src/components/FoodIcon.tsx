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

type Glyph = "egg" | "carton" | "tofu" | "greenOnion" | "spinach" | "cabbage" | "mushroom" | "apple" | "tomato" | "garlic" | "pork" | "beef" | "fish" | "dumpling" | "dumplingPack" | "shrimp" | "seafoodMix" | "bacon" | "fishCake" | "kimchi" | "cheese" | "sliceCheese" | "shreddedCheese" | "yogurt" | "cerealYogurt" | "butter" | "doenjang" | "gochujang" | "ketchup" | "mayonnaise" | "oysterSauce" | "jam" | "colaCan" | "sportsBottle" | "beerCan" | "soyCarton" | "water" | "coffeeCup" | "leftovers" | "pickle" | "twinSauce" | "ssamSauce" | "riceball" | "lunchbox" | "sausageStick" | "smokedEgg" | "seaweed" | "friedRice" | "nugget" | "chicken" | "chickenBreast" | "chickenPack" | "hotdogPizza" | "soupKit" | "fruitCup" | "applePack" | "sandwichBurger" | "jamButter" | "salad" | "leaf" | "meat" | "bottle" | "bowl" | "skewer" | "jar" | "can" | "cup" | "pizza" | "sausage" | "rice" | "soup" | "banana" | "sandwich" | "generic"

const glyphByFoodId: Record<string, Glyph> = {
  egg: "egg", milk: "carton", tofu: "tofu", "green-onion": "greenOnion", cabbage: "cabbage", spinach: "spinach", mushroom: "mushroom", apple: "apple", "cherry-tomato": "tomato", garlic: "garlic",
  pork: "pork", beef: "beef", chicken: "chicken", fish: "fish", "frozen-dumpling": "dumpling", "frozen-chicken-breast": "chickenBreast", "seafood-mix": "seafoodMix", "frozen-shrimp": "shrimp", bacon: "bacon", "fish-cake": "fishCake",
  kimchi: "kimchi", cheese: "cheese", "plain-yogurt": "yogurt", butter: "butter", doenjang: "doenjang", gochujang: "gochujang", ketchup: "ketchup", mayonnaise: "mayonnaise", "oyster-sauce": "oysterSauce", jam: "jam",
  cola: "colaCan", "sports-drink": "sportsBottle", beer: "beerCan", "soy-milk": "soyCarton", water: "water", coffee: "coffeeCup",
  "leftover-chicken-pizza": "leftovers", "pickled-radish": "pickle", "dorm-slice-cheese": "sliceCheese", "dorm-pizza-cheese": "shreddedCheese", "mini-sauce": "twinSauce", "ssam-sauce": "ssamSauce",
  "triangle-kimbap": "riceball", lunchbox: "lunchbox", "sausage-bar": "sausageStick", "smoked-egg": "smokedEgg", "cereal-yogurt": "cerealYogurt", "seasoned-seaweed": "seaweed",
  "microwave-dumpling": "dumplingPack", "fried-rice": "friedRice", nugget: "nugget", "hotdog-pizza": "hotdogPizza", "microwave-chicken": "chickenPack", "soup-kit": "soupKit",
  "snack-tomato": "tomato", "banana-fruitcup": "fruitCup", "washed-apple": "applePack", "sandwich-burger": "sandwichBurger", "mini-jam-butter": "jamButter", salad: "salad",
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
    case "greenOnion": return <IconBase><path d="M18 54L37 12M29 55L43 14M40 55L49 20" stroke={C.cream} strokeWidth="8" strokeLinecap="round"/><path d="M18 42L35 10M29 41L42 12M40 43L49 18" stroke={C.green} strokeWidth="7" strokeLinecap="round"/></IconBase>
    case "spinach": return <IconBase><path d="M32 55V22" stroke={C.darkGreen} strokeWidth="5" strokeLinecap="round"/><path d="M31 34C9 34 10 14 13 11c12 0 21 8 18 23zM33 32c22 0 21-20 18-23-12 0-21 8-18 23zM32 45C14 48 9 36 11 31c11-3 19 2 21 14zM32 45c18 3 23-9 21-14-11-3-19 2-21 14z" fill={C.green}/></IconBase>
    case "leaf": return <IconBase><path d="M17 49c3-23 18-35 34-34-1 17-11 33-34 34z" fill={C.green}/><path d="M20 46c8-9 16-16 26-24" stroke={C.darkGreen} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "cabbage": return <IconBase><circle cx="24" cy="34" r="15" fill={C.darkGreen}/><circle cx="40" cy="33" r="16" fill={C.green}/><circle cx="32" cy="25" r="14" fill="#9ABA70"/><path d="M32 22v31" stroke={C.cream} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "mushroom": return <IconBase><path d="M9 32c2-15 12-23 23-23s21 8 23 23z" fill={C.orange}/><rect x="26" y="29" width="13" height="25" rx="6" fill={C.cream}/></IconBase>
    case "apple": return <IconBase><path d="M14 34c0-14 9-22 18-17 9-5 18 3 18 17 0 14-8 22-18 22S14 48 14 34z" fill={C.red}/><path d="M32 17c1-7 5-11 11-12" stroke={C.darkGreen} strokeWidth="4" strokeLinecap="round"/><path d="M34 15c6-4 11-3 15 1-6 4-11 4-15-1z" fill={C.green}/></IconBase>
    case "tomato": return <IconBase><circle cx="32" cy="36" r="21" fill={C.red}/><path d="M32 17l5 7 10-2-7 8 4 7-12-5-12 5 4-7-7-8 10 2z" fill={C.green}/></IconBase>
    case "garlic": return <IconBase><path d="M32 11c0 8-5 10-10 13-7 4-10 10-8 19 2 9 9 14 18 14s16-5 18-14c2-9-1-15-8-19-5-3-10-5-10-13z" fill="#D7CAE5"/><path d="M32 21v33M24 28c-3 8-3 16 1 24M40 28c3 8 3 16-1 24" stroke="#9A89B1" strokeWidth="2.5" strokeLinecap="round"/></IconBase>
    case "pork": return <IconBase><path d="M10 38c0-15 13-27 29-24 13 2 18 15 11 26-5 8-13 7-17 14-6 8-23 0-23-16z" fill="#E88A8D"/><path d="M18 33c6-8 15-10 24-5" fill="none" stroke={C.cream} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "beef": return <IconBase><path d="M11 38c0-16 15-30 30-26 12 3 16 17 8 27-7 9-12 6-17 14-6 9-21 1-21-15z" fill="#B94D50"/><ellipse cx="36" cy="29" rx="7" ry="8" fill={C.cream}/><path d="M17 42l10-7" stroke="#E78A83" strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "meat": return <IconBase><path d="M11 38c0-16 15-30 30-26 12 3 16 17 8 27-7 9-12 6-17 14-6 9-21 1-21-15z" fill={C.red}/><ellipse cx="36" cy="29" rx="7" ry="8" fill={C.cream}/></IconBase>
    case "fish": return <IconBase><path d="M12 33c9-14 25-19 38-8l8-8v32l-8-8c-13 11-29 6-38-8z" fill={C.orange}/><circle cx="42" cy="28" r="2.5" fill={C.ink}/></IconBase>
    case "dumpling": return <IconBase><path d="M10 42c4-18 14-28 22-28s18 10 22 28c-9 11-35 11-44 0z" fill={C.cream}/><path d="M18 29l6 6 8-9 8 9 6-6" fill="none" stroke={C.brown} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></IconBase>
    case "shrimp": return <IconBase><path d="M46 15c13 18-4 41-23 34-12-5-12-20-3-25 7-4 16 1 15 9-1 5-6 7-10 5" fill="none" stroke={C.orange} strokeWidth="9" strokeLinecap="round"/><path d="M46 15l10-2-4 10z" fill={C.red}/></IconBase>
    case "seafoodMix": return <IconBase><path d="M10 37c6-9 16-12 25-6l7-6v24l-7-6c-9 6-19 3-25-6z" fill={C.blue}/><circle cx="30" cy="34" r="2" fill={C.ink}/><path d="M43 14c9 4 12 12 8 19M48 18l-8 4M52 24l-9 1" fill="none" stroke={C.orange} strokeWidth="5" strokeLinecap="round"/><path d="M18 49c3 0 5 2 5 5M28 48c3 1 4 3 3 6M39 48c3 1 4 3 3 6" fill="none" stroke={C.red} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "chickenBreast": return <IconBase><path d="M13 37c0-14 11-25 25-24 11 1 18 10 16 21-2 12-14 21-28 20-9-1-13-8-13-17z" fill="#E9A56D"/><path d="M22 41c7-8 15-12 24-13M25 48c8-7 14-10 22-11" fill="none" stroke={C.cream} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "bacon": return <IconBase><path d="M13 14h38l-5 36H8z" fill={C.red}/><path d="M18 15l-4 34M31 15l-4 35M44 15l-4 35" stroke={C.cream} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "skewer": return <IconBase><path d="M16 49l34-34" stroke={C.brown} strokeWidth="4" strokeLinecap="round"/><circle cx="24" cy="41" r="8" fill={C.orange}/><circle cx="36" cy="29" r="8" fill={C.yellow}/><circle cx="47" cy="18" r="8" fill={C.red}/></IconBase>
    case "fishCake": return <IconBase><path d="M15 54L49 10" stroke={C.brown} strokeWidth="4" strokeLinecap="round"/><path d="M18 39c8-7 3-12 11-18s12 0 19-7" fill="none" stroke={C.orange} strokeWidth="11" strokeLinecap="round"/><circle cx="14" cy="51" r="3" fill={C.brown}/></IconBase>
    case "jar": return <IconBase><rect x="17" y="17" width="30" height="39" rx="7" fill={C.orange}/><rect x="14" y="10" width="36" height="10" rx="4" fill={C.darkGreen}/><rect x="22" y="29" width="20" height="16" rx="6" fill={C.cream}/></IconBase>
    case "kimchi": return <IconBase><rect x="12" y="16" width="40" height="40" rx="8" fill={C.cream}/><rect x="10" y="10" width="44" height="10" rx="5" fill={C.darkGreen}/><path d="M19 45c3-13 9-20 19-23 7 5 10 13 7 24-9 5-18 5-26-1z" fill={C.red}/><path d="M27 38c4-6 8-9 14-11" stroke={C.green} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "cheese": return <IconBase><path d="M9 49l8-27 36-10v37z" fill={C.yellow}/><circle cx="28" cy="36" r="4" fill={C.orange}/><circle cx="44" cy="24" r="3" fill={C.orange}/></IconBase>
    case "yogurt": return <IconBase><path d="M15 22h34l-4 34H19z" fill={C.purple}/><rect x="12" y="15" width="40" height="10" rx="5" fill={C.cream}/><circle cx="32" cy="37" r="8" fill={C.white}/></IconBase>
    case "butter": return <IconBase><path d="M12 27l30-14 11 11-30 16z" fill={C.yellow}/><path d="M12 27v18l11 8V40z" fill={C.orange}/><path d="M23 40l30-16v18L23 53z" fill="#F3D992"/></IconBase>
    case "sliceCheese": return <IconBase><rect x="10" y="13" width="44" height="38" rx="5" fill={C.yellow}/><circle cx="22" cy="26" r="4" fill={C.orange}/><circle cx="42" cy="37" r="5" fill={C.orange}/><path d="M14 55h36" stroke={C.cream} strokeWidth="4" strokeLinecap="round"/></IconBase>
    case "shreddedCheese": return <IconBase><path d="M13 24h38l-4 33H17z" fill={C.cream}/><rect x="10" y="15" width="44" height="12" rx="6" fill={C.green}/><path d="M21 34l5 14M30 32l3 17M41 34l-4 14" stroke={C.yellow} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "cerealYogurt": return <IconBase><path d="M13 25h38l-5 31H18z" fill={C.purple}/><rect x="10" y="18" width="44" height="10" rx="5" fill={C.cream}/><circle cx="24" cy="37" r="5" fill={C.yellow}/><circle cx="36" cy="42" r="5" fill={C.red}/><circle cx="42" cy="33" r="4" fill={C.green}/></IconBase>
    case "doenjang": return <IconBase><rect x="15" y="18" width="34" height="38" rx="8" fill="#B9834F"/><rect x="12" y="11" width="40" height="11" rx="5" fill={C.darkGreen}/><circle cx="25" cy="36" r="4" fill={C.yellow}/><circle cx="38" cy="41" r="4" fill={C.yellow}/></IconBase>
    case "gochujang": return <IconBase><path d="M13 23h38l-4 33H17z" fill={C.red}/><rect x="10" y="15" width="44" height="12" rx="6" fill={C.darkGreen}/><path d="M25 43c4-10 10-14 18-15-1 9-6 15-18 15z" fill={C.cream}/></IconBase>
    case "ketchup": return <IconBase><rect x="26" y="7" width="12" height="9" rx="3" fill={C.cream}/><path d="M21 16h22l5 13-4 27H20l-4-27z" fill={C.red}/><path d="M23 33h18" stroke={C.cream} strokeWidth="7" strokeLinecap="round"/></IconBase>
    case "mayonnaise": return <IconBase><rect x="25" y="7" width="14" height="9" rx="3" fill={C.orange}/><path d="M20 16h24l5 14-5 26H20l-5-26z" fill={C.cream}/><path d="M24 35c5-5 11-6 17-2" fill="none" stroke={C.yellow} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "oysterSauce": return <IconBase><rect x="24" y="7" width="16" height="11" rx="3" fill={C.red}/><path d="M20 17h24l4 11-3 28H19l-3-28z" fill={C.brown}/><ellipse cx="32" cy="38" rx="11" ry="8" fill={C.cream}/><path d="M25 40c4-5 9-6 14-2" fill="none" stroke={C.blue} strokeWidth="3"/></IconBase>
    case "jam": return <IconBase><rect x="14" y="18" width="36" height="38" rx="8" fill="#D86673"/><rect x="11" y="10" width="42" height="12" rx="5" fill={C.yellow}/><path d="M32 30c7-6 15 2 10 9-3 5-10 9-10 9s-7-4-10-9c-5-7 3-15 10-9z" fill={C.cream}/></IconBase>
    case "bottle": return <IconBase><rect x="25" y="7" width="14" height="10" rx="3" fill={C.darkGreen}/><path d="M22 17h20l5 12v27H17V29z" fill={C.green}/><rect x="21" y="33" width="22" height="13" rx="4" fill={C.cream}/></IconBase>
    case "sportsBottle": return <IconBase><rect x="25" y="5" width="14" height="9" rx="3" fill={C.orange}/><path d="M22 14h20l5 13v29H17V27z" fill={C.blue}/><path d="M19 36h26" stroke={C.cream} strokeWidth="10"/><path d="M29 30l-4 9h7l-3 10 11-14h-7l4-5z" fill={C.orange}/></IconBase>
    case "soyCarton": return <IconBase><path d="M17 18h30l5 9v29H12V27z" fill={C.cream}/><path d="M17 18l7-10h18l5 10z" fill={C.green}/><path d="M24 39c5-9 12-11 18-8-1 8-6 13-18 8z" fill={C.darkGreen}/><circle cx="35" cy="35" r="3" fill={C.yellow}/></IconBase>
    case "can": return <IconBase><rect x="18" y="10" width="28" height="46" rx="8" fill={C.red}/><rect x="18" y="14" width="28" height="5" fill={C.cream}/><path d="M29 10h9" stroke={C.ink} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "colaCan": return <IconBase><rect x="18" y="9" width="28" height="47" rx="8" fill={C.red}/><path d="M18 18h28M18 47h28" stroke={C.cream} strokeWidth="4"/><path d="M26 37c4-8 9-11 14-11-2 7-6 11-14 11z" fill={C.white}/><path d="M28 10h9" stroke={C.ink} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "beerCan": return <IconBase><rect x="18" y="9" width="28" height="47" rx="8" fill={C.yellow}/><path d="M18 17h28M18 49h28" stroke={C.cream} strokeWidth="4"/><path d="M32 25v20M25 29c5 2 9 2 14 0" stroke={C.darkGreen} strokeWidth="3" strokeLinecap="round"/><path d="M28 10h9" stroke={C.ink} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "water": return <IconBase><path d="M32 7c8 13 18 24 18 34a18 18 0 01-36 0c0-10 10-21 18-34z" fill={C.blue}/><path d="M23 43c3 5 8 7 13 5" fill="none" stroke={C.white} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "cup": return <IconBase><path d="M14 18h31l-3 38H18z" fill={C.brown}/><path d="M45 25h6c8 0 8 15 0 15h-8" fill="none" stroke={C.brown} strokeWidth="5"/><rect x="11" y="12" width="37" height="8" rx="4" fill={C.cream}/></IconBase>
    case "coffeeCup": return <IconBase><path d="M15 19h34l-5 37H20z" fill={C.brown}/><rect x="12" y="13" width="40" height="9" rx="4" fill={C.cream}/><path d="M24 34c4-6 12-8 19-3-2 7-9 10-19 3z" fill={C.yellow}/><path d="M32 13V6M39 14l3-7" stroke={C.ink} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "pizza": return <IconBase><path d="M11 12c20 0 35 13 42 40L18 55z" fill={C.yellow}/><path d="M11 12c17 0 30 6 38 16" fill="none" stroke={C.brown} strokeWidth="7" strokeLinecap="round"/><circle cx="31" cy="32" r="5" fill={C.red}/><circle cx="39" cy="44" r="4" fill={C.red}/></IconBase>
    case "leftovers": return <IconBase><path d="M8 18c15 0 25 8 30 27L14 48z" fill={C.yellow}/><path d="M8 18c12 0 21 4 27 11" fill="none" stroke={C.brown} strokeWidth="6" strokeLinecap="round"/><circle cx="24" cy="31" r="4" fill={C.red}/><path d="M39 34c4-7 13-8 17-2 4 7-2 15-10 15-7 0-11-6-7-13z" fill={C.orange}/><path d="M48 45l7 8" stroke={C.cream} strokeWidth="6" strokeLinecap="round"/></IconBase>
    case "pickle": return <IconBase><rect x="16" y="12" width="32" height="44" rx="8" fill={C.cream}/><rect x="14" y="9" width="36" height="9" rx="4" fill={C.green}/><circle cx="26" cy="34" r="7" fill="#B7C66E"/><circle cx="39" cy="41" r="6" fill="#B7C66E"/></IconBase>
    case "bowl": return <IconBase><path d="M9 28h46c-2 18-11 28-23 28S11 46 9 28z" fill={C.orange}/><path d="M14 23c7-8 29-8 36 0" fill="none" stroke={C.green} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "twinSauce": return <IconBase><path d="M12 22h17l3 10-3 24H12L9 32z" fill={C.red}/><rect x="15" y="13" width="11" height="10" rx="3" fill={C.cream}/><path d="M35 22h17l3 10-3 24H35l-3-24z" fill={C.cream}/><rect x="38" y="13" width="11" height="10" rx="3" fill={C.orange}/><path d="M15 39h11M38 39h11" stroke={C.yellow} strokeWidth="4" strokeLinecap="round"/></IconBase>
    case "ssamSauce": return <IconBase><path d="M9 29h46c-2 17-11 27-23 27S11 46 9 29z" fill={C.cream}/><ellipse cx="32" cy="28" rx="21" ry="10" fill="#A8673F"/><path d="M22 25l6 5 13-8" fill="none" stroke={C.green} strokeWidth="4" strokeLinecap="round"/></IconBase>
    case "riceball": return <IconBase><path d="M32 9L55 50H9z" fill={C.white}/><path d="M22 35h20v18H22z" fill={C.darkGreen}/><circle cx="31" cy="27" r="3" fill={C.red}/></IconBase>
    case "lunchbox": return <IconBase><rect x="8" y="16" width="48" height="40" rx="9" fill={C.orange}/><rect x="13" y="22" width="38" height="28" rx="6" fill={C.cream}/><circle cx="24" cy="34" r="7" fill={C.green}/><circle cx="40" cy="34" r="7" fill={C.red}/></IconBase>
    case "sausage": return <IconBase><rect x="12" y="23" width="40" height="19" rx="10" fill={C.red}/><path d="M10 25l-6-6M10 40l-6 6M54 25l6-6M54 40l6 6" stroke={C.brown} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "sausageStick": return <IconBase><rect x="13" y="15" width="38" height="25" rx="13" fill={C.red}/><path d="M32 40v17" stroke={C.brown} strokeWidth="5" strokeLinecap="round"/><path d="M20 23l5 5M32 21l5 5M42 23l4 4" stroke={C.cream} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "smokedEgg": return <IconBase><ellipse cx="32" cy="34" rx="19" ry="24" fill="#C98C58"/><path d="M22 38c3 7 9 10 16 8" fill="none" stroke={C.cream} strokeWidth="3" strokeLinecap="round"/><path d="M24 15c1-5 4-7 8-9M34 14c1-5 4-7 8-8" stroke={C.blue} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "seaweed": return <IconBase><rect x="14" y="10" width="36" height="44" rx="6" fill={C.darkGreen}/><path d="M23 20h18M23 29h18M23 38h13" stroke={C.green} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "rice": return <IconBase><path d="M10 31h44c-2 17-10 25-22 25S12 48 10 31z" fill={C.blue}/><path d="M15 29c4-17 30-17 34 0z" fill={C.white}/><path d="M23 23l3-7M32 22v-8M41 23l-3-7" stroke={C.brown} strokeWidth="2.5" strokeLinecap="round"/></IconBase>
    case "friedRice": return <IconBase><path d="M9 31h46c-2 17-11 25-23 25S11 48 9 31z" fill={C.blue}/><path d="M14 30c4-18 32-18 36 0z" fill={C.yellow}/><circle cx="24" cy="24" r="4" fill={C.green}/><circle cx="37" cy="20" r="4" fill={C.red}/><circle cx="43" cy="27" r="3" fill={C.orange}/></IconBase>
    case "dumplingPack": return <IconBase><path d="M10 14h44l-4 43H14z" fill={C.blue}/><rect x="14" y="18" width="36" height="9" rx="4" fill={C.cream}/><path d="M20 45c2-10 7-16 12-16s10 6 12 16c-6 7-18 7-24 0z" fill={C.white}/><path d="M24 38l4 4 4-6 5 6 3-4" fill="none" stroke={C.brown} strokeWidth="2"/></IconBase>
    case "nugget": return <IconBase><path d="M12 35c-4-12 5-22 17-20 8-8 22-1 20 10 9 7 3 22-9 22-9 10-25 2-28-12z" fill={C.orange}/><circle cx="27" cy="30" r="3" fill={C.yellow}/><circle cx="39" cy="38" r="3" fill={C.yellow}/></IconBase>
    case "chicken": return <IconBase><path d="M13 39c0-12 10-22 22-22 12 0 20 8 20 18S47 53 37 53c-13 0-24-5-24-14z" fill={C.orange}/><path d="M16 43L7 52M20 47l-8 10" stroke={C.cream} strokeWidth="6" strokeLinecap="round"/></IconBase>
    case "chickenPack": return <IconBase><rect x="9" y="12" width="46" height="44" rx="8" fill={C.cream}/><rect x="12" y="15" width="40" height="9" rx="4" fill={C.green}/><path d="M17 40c0-9 8-16 18-16 9 0 15 6 14 13-1 9-10 15-21 15-7 0-11-5-11-12z" fill={C.orange}/><path d="M25 43c5-5 10-8 17-9" stroke={C.white} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "hotdogPizza": return <IconBase><path d="M8 22c0-7 6-12 13-12h18c7 0 13 5 13 12s-6 12-13 12H21C14 34 8 29 8 22z" fill={C.orange}/><rect x="13" y="16" width="34" height="12" rx="6" fill={C.red}/><path d="M15 22c8-5 16 5 24 0 4-2 7-1 10 1" fill="none" stroke={C.yellow} strokeWidth="3"/><path d="M18 40h28l7 17H11z" fill={C.yellow}/><circle cx="28" cy="49" r="3" fill={C.red}/><circle cx="40" cy="52" r="3" fill={C.red}/></IconBase>
    case "soup": return <IconBase><path d="M10 28h44v23H10z" fill={C.red}/><path d="M7 22h50v9H7z" fill={C.orange}/><path d="M22 18c-5-6 5-7 0-13M35 18c-5-6 5-7 0-13M47 18c-5-6 5-7 0-13" fill="none" stroke={C.blue} strokeWidth="3" strokeLinecap="round"/></IconBase>
    case "soupKit": return <IconBase><rect x="9" y="14" width="46" height="42" rx="7" fill={C.blue}/><rect x="7" y="10" width="50" height="10" rx="5" fill={C.orange}/><path d="M15 33h34c-2 12-8 18-17 18s-15-6-17-18z" fill={C.red}/><path d="M21 29c4-5 18-5 22 0" fill="none" stroke={C.cream} strokeWidth="4" strokeLinecap="round"/></IconBase>
    case "banana": return <IconBase><path d="M13 16c4 23 20 33 39 23-3 17-18 24-31 15C9 46 5 29 13 16z" fill={C.yellow}/><path d="M13 16l4-7M52 39l5-4" stroke={C.brown} strokeWidth="4" strokeLinecap="round"/></IconBase>
    case "fruitCup": return <IconBase><path d="M13 24h38l-5 32H18z" fill={C.blue}/><rect x="10" y="18" width="44" height="9" rx="4" fill={C.cream}/><path d="M20 38c2-8 8-13 13-13 0 9-4 15-13 13z" fill={C.yellow}/><circle cx="39" cy="38" r="7" fill={C.red}/><path d="M38 31c0-4 2-6 5-8" stroke={C.green} strokeWidth="3"/></IconBase>
    case "applePack": return <IconBase><rect x="9" y="12" width="46" height="44" rx="9" fill={C.cream}/><path d="M17 36c0-10 7-16 15-12 8-4 15 2 15 12 0 10-7 16-15 16s-15-6-15-16z" fill={C.red}/><path d="M32 24c1-5 4-8 8-9" stroke={C.darkGreen} strokeWidth="3"/><path d="M12 20h40" stroke={C.green} strokeWidth="5" strokeLinecap="round"/></IconBase>
    case "sandwich": return <IconBase><path d="M8 25l24-14 24 14-24 14z" fill={C.cream}/><path d="M8 25l24 14 24-14v14L32 53 8 39z" fill={C.yellow}/><path d="M11 31l21 13 21-13" fill="none" stroke={C.green} strokeWidth="5"/></IconBase>
    case "sandwichBurger": return <IconBase><path d="M8 34c1-12 10-20 22-20s21 8 22 20z" fill={C.yellow}/><rect x="8" y="34" width="44" height="8" rx="4" fill={C.green}/><rect x="10" y="40" width="40" height="8" rx="4" fill={C.brown}/><path d="M12 48h36c0 6-5 9-10 9H22c-5 0-10-3-10-9z" fill={C.orange}/><circle cx="24" cy="21" r="2" fill={C.cream}/><circle cx="36" cy="19" r="2" fill={C.cream}/></IconBase>
    case "jamButter": return <IconBase><rect x="8" y="18" width="23" height="34" rx="7" fill={C.red}/><rect x="6" y="12" width="27" height="10" rx="4" fill={C.yellow}/><path d="M39 23l13-6 7 7-13 7z" fill={C.yellow}/><path d="M39 23v20l7 5V31z" fill={C.orange}/><path d="M46 31l13-7v20l-13 4z" fill="#F3D992"/></IconBase>
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
