import { Link } from 'react-router-dom'

export default function NotFound() {
  return <div className="page-section container"><div className="not-found-card"><span className="not-found-code">404</span><h1>Page not found</h1><p>The page you requested does not exist or the URL may be incorrect.</p><Link className="btn btn-primary" to="/">Go to homepage</Link></div></div>
}
