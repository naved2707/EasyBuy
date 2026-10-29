import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(form)
      navigate(location.state?.from || '/account', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <span className="eyebrow">WELCOME BACK</span><h1>Login to EasyBuy</h1><p>Access your orders, wishlist and saved account information.</p>
        {error && <div className="form-alert error">{error}</div>}
        <form className="auth-form" onSubmit={submit}>
          <label>Email<input className="input" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
          <label>Password<input className="input" type="password" autoComplete="current-password" required minLength="6" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></label>
          <button className="btn btn-primary full-width" type="submit" disabled={submitting}>{submitting ? 'Signing in…' : 'Login'}</button>
        </form>
        <p className="auth-switch">New to EasyBuy? <Link to="/register">Create an account</Link></p>
        <div className="demo-note"><strong>Portfolio note:</strong> the app tries the Node/MongoDB API first. If the API is offline, it uses a local demo account so the deployed frontend can still be explored. LocalStorage authentication is not secure for a real production app.</div>
      </div>
    </div>
  )
}
