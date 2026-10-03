import EagleMascot from "./EagleMascot"

export type MascotBadgeVariant = "sprout" | "guardian" | "carbon" | "leader"

const accessories: Record<MascotBadgeVariant, { main: string; spark: string; prop: string; label: string }> = {
  sprout: { main: "🌱", spark: "＋1", prop: "👋", label: "손을 흔드는 냉큼" },
  guardian: { main: "❄️", spark: "✓", prop: "🛡️", label: "냉장고를 지키는 냉큼" },
  carbon: { main: "🍃", spark: "CO₂", prop: "♻️", label: "잎을 안고 뛰는 냉큼" },
  leader: { main: "👑", spark: "★", prop: "🏆", label: "트로피를 든 냉큼" },
}

interface Props {
  variant: MascotBadgeVariant
  locked?: boolean
  size?: "small" | "large"
}

export default function MascotBadge({ variant, locked = false, size = "large" }: Props) {
  const accessory = accessories[variant]
  return (
    <span className={`mascot-badge ${variant} ${locked ? "locked" : ""} ${size}`} role="img" aria-label={locked ? `잠긴 배지: ${accessory.label}` : accessory.label}>
      <span className="badge-rays" />
      <span className="badge-mascot-stage"><EagleMascot size={size === "large" ? 68 : 45} className="badge-mascot" /></span>
      <span className="badge-pose-prop">{accessory.prop}</span>
      <span className="badge-accessory">{accessory.main}</span>
      <b>{accessory.spark}</b>
    </span>
  )
}
