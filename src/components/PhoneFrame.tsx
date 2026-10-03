import { type ReactNode } from "react"

interface PhoneFrameProps {
  children: ReactNode
  statusLabel?: string
}

export default function PhoneFrame({ children, statusLabel }: PhoneFrameProps) {
  return (
    <div className="phone-frame">
      <div className="phone-notch"><i /><b /></div>
      <div className="phone-screen">
        <div className="phone-status">
          <span>9:41</span>
          <div><i /><i /><i /><i /><b /></div>
        </div>
        <div className="phone-scroll">{children}</div>
      </div>
      {statusLabel && <div className="phone-label">{statusLabel}</div>}
    </div>
  )
}
