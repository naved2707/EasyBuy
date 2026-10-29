export default function QuantitySelector({ value, onChange, max = 99, ariaLabel = 'Quantity' }) {
  return (
    <div className="quantity-selector" aria-label={ariaLabel}>
      <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1}>−</button>
      <span>{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}>+</button>
    </div>
  )
}
