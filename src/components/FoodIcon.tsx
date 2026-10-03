import type { ReactNode } from "react"

interface Props {
  category?: string
  emoji?: string
  size?: "small" | "medium" | "large"
}

const C = {
  green: "#16875D", greenDark: "#0D6B4B", orange: "#F46B35", orangeDark: "#D94E25",
  yellow: "#F3A51F", blue: "#3D8FB8", blueLight: "#B9D9E8", brown: "#A95B24",
}

function IconBase({ children }: { children: ReactNode }) {
  return <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">{children}</svg>
}

const icons: Record<string, { className: string; art: ReactNode }> = {
  "유제품": { className: "milk", art: <IconBase><path fill={C.blueLight} d="M20 13h24l6 10v31H14V23z"/><path fill={C.blue} d="M14 23h36v12H14zM39 13h5l6 10H39z"/><path fill="#F7F1DD" d="M19 35h20v19H19z"/><path fill="#FFF" d="M20 8h24v7H20z"/><path fill={C.blue} d="M42 35h8v19h-8zM22 39h3l2 6 2-6h3v11h-2v-7l-2 7h-2l-2-7v7h-2zM34 39h2v11h-2z"/></IconBase> },
  "육류": { className: "meat", art: <IconBase><path fill={C.orange} d="M14 45c-3-9 3-24 15-30 12-6 25 3 22 15-3 11-14 11-19 20-4 7-15 4-18-5z"/><path fill={C.orangeDark} d="M17 43c-1-7 4-18 13-23 8-4 16 0 17 7-10-2-21 6-30 16z"/><ellipse cx="36" cy="28" rx="6" ry="7" fill="#FFF4D9"/><path fill="#F58A55" d="M19 38c7-7 14-10 24-10v3c-9 0-16 3-22 9zM17 45c5-5 10-8 16-10l1 3c-6 2-10 5-15 10z"/></IconBase> },
  "채소류": { className: "vegetable", art: <IconBase><path fill={C.greenDark} d="M27 29h10l6 25H21z"/><path fill={C.green} d="M18 33c-7 0-12-5-11-12 1-6 8-9 13-6 2-8 14-10 18-3 7-4 16 1 15 9 4 2 5 8 1 12-4 4-30 4-36 0z"/><path fill="#2AAE73" d="M18 33c5-7 10-10 16-15-2 7-2 12 1 19H22z"/><path fill={C.greenDark} d="M24 34l-6 15h7l5-15zM37 34l7 14h-7l-5-14z"/></IconBase> },
  "과일": { className: "fruit", art: <IconBase><path fill={C.orange} d="M10 35c0-13 9-21 22-21s22 8 22 21-10 21-22 21S10 48 10 35z"/><path fill={C.orangeDark} d="M13 38c4 9 12 14 22 14 8 0 14-3 18-9-3 9-10 13-21 13-11 0-18-6-19-18z"/><path fill={C.green} d="M31 17c-6-7-2-13 5-15-2 5-1 8 2 12 5-4 10-3 14 1-7 0-10 3-13 6z"/><path fill={C.greenDark} d="M31 19c-5-4-10-3-15 1 7 0 11 2 15 5z"/></IconBase> },
  "음료": { className: "drink", art: <IconBase><path fill={C.greenDark} d="M24 7h16v8l5 7v35H19V22l5-7z"/><path fill={C.green} d="M22 23h20v31H22z"/><path fill={C.yellow} d="M25 29h14v18H25z"/><path fill="#F8E6BA" d="M27 31h10v14H27z"/><path fill="#3A5C52" d="M23 7h18v5H23z"/></IconBase> },
  "반찬": { className: "meal", art: <IconBase><path fill={C.orangeDark} d="M9 25h46l-5 31H14z"/><path fill={C.orange} d="M7 22h50v9H7z"/><path fill={C.yellow} d="M18 10h6l5 14h-6zM40 10h6l-6 14h-6z"/><rect x="18" y="37" width="5" height="13" rx="2" fill="#FFF4D9"/><rect x="30" y="37" width="5" height="13" rx="2" fill="#FFF4D9"/><rect x="42" y="37" width="5" height="13" rx="2" fill="#FFF4D9"/></IconBase> },
  "냉동식품": { className: "frozen", art: <IconBase><path fill={C.blue} d="M22 7h20l4 8v38c0 4-3 7-7 7H25c-4 0-7-3-7-7V15z"/><path fill={C.blueLight} d="M18 17h28v12H18z"/><path fill="#F7F1DD" d="M22 32h20v21H22z"/><path fill={C.orange} d="M25 43c4-7 10-9 16-7-2 8-7 12-16 12z"/><path fill={C.green} d="M28 39c2-3 5-4 8-4-1 3-3 5-6 6z"/><path fill="#FFF" d="M23 8h18v5H23z"/></IconBase> },
  "기타": { className: "other", art: <IconBase><path fill={C.brown} d="M10 29c0-10 8-18 19-18 6 0 10 2 13 6 8 0 13 6 12 13-1 8-7 13-15 13H23c-8 0-13-6-13-14z"/><path fill={C.yellow} d="M11 34c10-4 21-4 31 1v19H17z"/><path fill="#F8C65C" d="M17 30c4-4 9-6 15-6 6 0 11 2 15 6-8-2-20-2-30 0z"/><circle cx="23" cy="39" r="2" fill={C.brown}/><circle cx="34" cy="33" r="2" fill={C.brown}/><circle cx="41" cy="42" r="2" fill={C.brown}/></IconBase> },
}

export default function FoodIcon({ category = "기타", emoji, size = "medium" }: Props) {
  if (emoji) return <span className={`food-icon catalog-emoji ${size}`} role="img" aria-label={`${category} 아이콘`}><span>{emoji}</span></span>
  const item = icons[category] ?? icons["기타"]
  return <span className={`food-icon ${item.className} ${size}`} role="img" aria-label={`${category} 아이콘`}>{item.art}</span>
}
