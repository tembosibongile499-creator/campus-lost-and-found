import { useEffect, useState } from 'react';

const apiBase = import.meta.env.VITE_API_URL || '';

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'lost', title: '', description: '', location: '', contact: '' });
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const res = await fetch(`${apiBase}/api/items`);
    const data = await res.json();
    setItems(data);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    await fetch(`${apiBase}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ type: 'lost', title: '', description: '', location: '', contact: '' });
    await fetchItems();
    setLoading(false);
  };

  const handleClaim = async (id) => {
    const claimedBy = prompt('Enter your name or contact information');
    if (!claimedBy) return;
    setLoading(true);
    await fetch(`${apiBase}/api/items/${id}/claim`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ claimedBy })
    });
    await fetchItems();
    setLoading(false);
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Campus Lost & Found</h1>
        <p>Report, browse, and resolve items on campus.</p>
      </header>
      <main>
        <section className="report-panel">
          <h2>Report an item</h2>
          <form onSubmit={handleSubmit}>
            <label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
            <label>Contact (email or phone)</label>
            <input name="contact" value={form.contact} onChange={handleChange} />
            <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Submit report'}</button>
          </form>
        </section>

        <section className="items-panel">
          <h2>Reported Items</h2>
          <div className="items-grid">
            {items.length === 0 ? (
              <p>No reports yet.</p>
            ) : (
              items.slice().reverse().map(item => (
                <article key={item.id} className={`item-card ${item.type}`}>
                  <div className="item-header">
                    <strong>{item.type.toUpperCase()}</strong>
                    <span>{item.title}</span>
                  </div>
                  <p>{item.description || 'No description provided.'}</p>
                  <p><strong>Location:</strong> {item.location || 'N/A'}</p>
                  <p><strong>Contact:</strong> {item.contact || 'N/A'}</p>
                  <p><strong>Status:</strong> {item.claimed ? `Claimed by ${item.claimedBy}` : 'Available'}</p>
                  {!item.claimed && (
                    <button onClick={() => handleClaim(item.id)} disabled={loading}>Claim</button>
                  )}
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
