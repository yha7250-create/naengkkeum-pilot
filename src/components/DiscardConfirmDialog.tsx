import type { FoodItem } from "../model"

interface Props {
  food: FoodItem
  onCancel: () => void
  onConfirm: () => void
}

export default function DiscardConfirmDialog({ food, onCancel, onConfirm }: Props) {
  return (
    <div className="discard-dialog-backdrop" role="presentation" onClick={onCancel}>
      <section className="discard-dialog" role="alertdialog" aria-modal="true" aria-labelledby="discard-title" onClick={event => event.stopPropagation()}>
        <span className="discard-dialog-icon">🗑️</span>
        <h3 id="discard-title">진짜 폐기할까요?</h3>
        <p>‘{food.name}’이 냉장고와 내 음식 목록에서 사라집니다. 실수라면 취소해 주세요.</p>
        <div><button type="button" onClick={onCancel}>취소</button><button type="button" className="danger" onClick={onConfirm}>폐기하기</button></div>
      </section>
    </div>
  )
}
