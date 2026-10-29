import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/account', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page"><div className="auth-card"><span className="eyebrow">JOIN EASYBUY</span><h1>Create your account</h1><p>Use a demo account for this portfolio project or connect the included Node/MongoDB backend.</p>{error && <div className="form-alert error">{error}</div>}<form className="auth-form" onSubmit={submit}>
      <label>Full name<input className="input" required minLength="2" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} /></label>
      <label>Email<input className="input" type="email" autoComplete="email" required value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} /></label>
      <label>Password<input className="input" type="password" autoComplete="new-password" required minLength="6" value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} /></label>
      <label>Confirm password<input className="input" type="password" autoComplete="new-password" required minLength="6" value={form.confirmPassword} onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))} /></label>
      <button className="btn btn-primary full-width" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
    </form><p className="auth-switch">Already registered? <Link to="/login">Login</Link></p></div></div>
  )
}
