import { useRef, useState, type ChangeEvent } from "react"

interface Props {
  value?: string
  onChange: (dataUrl: string, fileName: string) => void
  label?: string
}

export default function CameraCapture({ value, onChange, label = "음식 사진" }: Props) {
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")

  async function compressFile(file: File) {
    const objectUrl = URL.createObjectURL(file)
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const nextImage = new Image()
        nextImage.onload = () => resolve(nextImage)
        nextImage.onerror = reject
        nextImage.src = objectUrl
      })
      const maxSide = 960
      const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight))
      const canvas = document.createElement("canvas")
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale))
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale))
      const context = canvas.getContext("2d")
      if (!context) throw new Error("canvas unavailable")
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      return canvas.toDataURL("image/jpeg", 0.72)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    event.target.value = ""
    setError("")
    if (!file.type.startsWith("image/")) return setError("이미지 파일만 등록할 수 있습니다.")
    setProcessing(true)
    try {
      onChange(await compressFile(file), file.name || `food-${Date.now()}.jpg`)
    } catch {
      setError("사진을 불러오지 못했습니다. 다른 사진으로 다시 시도해 주세요.")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="camera-capture simple-camera">
      <div className="camera-head">
        <div><strong>{label}</strong><small>선택 사항 · 등록 후 자동으로 용량을 줄여요</small></div>
        {value && <span className="camera-done">✓ 등록됨</span>}
      </div>
      {value && <div className="camera-preview-wrap"><img src={value} alt={`${label} 미리보기`} className="camera-preview" /><button type="button" onClick={() => onChange("", "")}>사진 삭제</button></div>}
      <div className="camera-actions two">
        <button type="button" className="camera-primary" onClick={() => cameraInputRef.current?.click()} disabled={processing}><span>📷</span><b>{processing ? "처리 중" : "지금 촬영"}</b><small>휴대폰 카메라 열기</small></button>
        <button type="button" onClick={() => galleryInputRef.current?.click()} disabled={processing}><span>🖼️</span><b>갤러리</b><small>저장된 사진 선택</small></button>
      </div>
      <input ref={cameraInputRef} className="camera-native-input" type="file" accept="image/*" capture="environment" onChange={readFile} />
      <input ref={galleryInputRef} className="camera-native-input" type="file" accept="image/*" onChange={readFile} />
      {error && <p className="camera-error">{error}</p>}
    </div>
  )
}
