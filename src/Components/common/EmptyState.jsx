import { Link } from 'react-router-dom'

export default function EmptyState({ title, message, actionLabel = 'Browse products', actionTo = '/products' }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" aria-hidden="true">○</div>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link className="btn btn-primary" to={actionTo}>{actionLabel}</Link>
    </div>
  )
}
