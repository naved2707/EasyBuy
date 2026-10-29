export default function Rating({ value = 0, reviews, compact = false }) {
  const rounded = Math.round(value)
  return (
    <div className={`rating ${compact ? 'rating-compact' : ''}`} aria-label={`${value} out of 5 stars`}>
      <span className="rating-stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < rounded ? 'star-filled' : 'star-empty'}>★</span>
        ))}
      </span>
      <span className="rating-value">{value.toFixed(1)}</span>
      {typeof reviews === 'number' && <span className="rating-reviews">({reviews})</span>}
    </div>
  )
}
