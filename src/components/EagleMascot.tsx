import eagleImg from '@/imports/Dormmeal_character-1.png'

interface EagleMascotProps {
  size?: number
  mood?: 'happy' | 'alert' | 'wave' | 'sleep'
  className?: string
}

export default function EagleMascot({ size = 80, className = '' }: EagleMascotProps) {
  return (
    <img
      src={eagleImg}
      alt="냉큼 독수리 마스코트"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block' }}
    />
  )
}
