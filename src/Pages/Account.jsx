import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'
import { useShop } from '../Context/ShopContext'
import { readStorage, writeStorage } from '../utils/storage'
import { useToast } from '../Context/ToastContext'

const emptyAddress = { label: 'Home', address: '', city: '', pincode: '' }
const ADDRESS_KEY = 'easybuy_saved_addresses'

export default function Account() {
  const { user, logout } = useAuth()
  const { wishlistCount } = useShop()
  const { notify } = useToast()
  const [addresses, setAddresses] = useState(() => readStorage(ADDRESS_KEY, []))
  const [form, setForm] = useState(emptyAddress)

  const addAddress = (event) => {
    event.preventDefault()
    if (form.address.trim().length < 6 || !form.city.trim() || !/^\d{6}$/.test(form.pincode)) {
      notify('Enter a complete address, city and 6-digit PIN code.', 'error')
      return
    }
    const next = [...addresses, { ...form, id: Date.now() }]
    setAddresses(next)
    writeStorage(ADDRESS_KEY, next)
    setForm(emptyAddress)
    notify('Address saved for this demo browser.')
  }

  const removeAddress = (id) => {
    const next = addresses.filter((address) => address.id !== id)
    setAddresses(next)
    writeStorage(ADDRESS_KEY, next)
    notify('Saved address removed.', 'info')
  }

  return (
    <div className="page-section container">
      <div className="account-header">
        <div className="account-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div><span className="eyebrow">MY ACCOUNT</span><h1>{user?.name}</h1><p>{user?.email}</p></div>
      </div>

      <div className="account-grid">
        <section className="account-card">
          <h2>Quick links</h2>
          <Link to="/orders">Orders <span>→</span></Link>
          <Link to="/wishlist">Wishlist <span>{wishlistCount}</span></Link>
          <Link to="/cart">Cart <span>→</span></Link>
          <button type="button" className="account-link-button" onClick={logout}>Logout <span>→</span></button>
        </section>

        <section className="account-card">
          <h2>Profile</h2>
          <div className="profile-row"><span>Name</span><strong>{user?.name}</strong></div>
          <div className="profile-row"><span>Email</span><strong>{user?.email}</strong></div>
          <p className="small-note">Profile editing is intentionally minimal; authentication and order history are the backend-focused parts of this portfolio build.</p>
        </section>

        <section className="account-card span-2">
          <div className="account-section-head"><div><h2>Saved addresses</h2><p>Add delivery addresses for faster demo checkout.</p></div><span>{addresses.length} saved</span></div>
          {addresses.length > 0 && <div className="saved-address-grid">
            {addresses.map((address) => (
              <article className="saved-address" key={address.id}>
                <div><strong>{address.label}</strong><p>{address.address}</p><p>{address.city} - {address.pincode}</p></div>
                <button type="button" className="text-button danger" onClick={() => removeAddress(address.id)}>Remove</button>
              </article>
            ))}
          </div>}
          <form className="form-grid two-col address-form" onSubmit={addAddress}>
            <label>Label<input className="input" value={form.label} onChange={(event) => setForm((current) => ({ ...current, label: event.target.value }))} /></label>
            <label>City<input className="input" value={form.city} onChange={(event) => setForm((current) => ({ ...current, city: event.target.value }))} /></label>
            <label className="span-2">Address<input className="input" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} /></label>
            <label>PIN code<input className="input" inputMode="numeric" maxLength="6" value={form.pincode} onChange={(event) => setForm((current) => ({ ...current, pincode: event.target.value.replace(/\D/g, '') }))} /></label>
            <div className="form-action-align"><button className="btn btn-primary" type="submit">Add address</button></div>
          </form>
        </section>
      </div>
    </div>
  )
}
