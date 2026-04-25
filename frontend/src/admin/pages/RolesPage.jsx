import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import '../../pages/ui.css'

const STORAGE_KEY = 'americandemofood.admin.roles'

const DEFAULT_PERMS = ['users', 'restaurants', 'orders', 'roles', 'payments', 'reports']
const DEFAULT_ACTIONS = ['create', 'read', 'update', 'delete']

function loadRoles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveRoles(roles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles))
}

function roleKey(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
}

export default function RolesPage() {
  const [roles, setRoles] = useState(() => loadRoles())
  const [name, setName] = useState('')
  const [perm, setPerm] = useState(DEFAULT_PERMS[0])
  const [actions, setActions] = useState(() => new Set(['read']))

  useEffect(() => {
    saveRoles(roles)
  }, [roles])

  const canCreate = useMemo(() => roleKey(name).length >= 3, [name])

  function toggleAction(a) {
    setActions((prev) => {
      const next = new Set(prev)
      if (next.has(a)) next.delete(a)
      else next.add(a)
      return next
    })
  }

  function onCreateRole() {
    if (!canCreate) return
    const id = roleKey(name)
    if (roles.some((r) => r.id === id)) return
    setRoles((prev) => [
      ...prev,
      {
        id,
        name: name.trim(),
        permissions: {},
        createdAt: new Date().toISOString(),
      },
    ])
    setName('')
  }

  function grant(roleId) {
    const acts = Array.from(actions)
    if (!acts.length) return
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r
        const next = { ...(r.permissions || {}) }
        next[perm] = Array.from(new Set([...(next[perm] || []), ...acts]))
        return { ...r, permissions: next }
      }),
    )
  }

  function revoke(roleId, p, a) {
    setRoles((prev) =>
      prev.map((r) => {
        if (r.id !== roleId) return r
        const next = { ...(r.permissions || {}) }
        next[p] = (next[p] || []).filter((x) => x !== a)
        return { ...r, permissions: next }
      }),
    )
  }

  function removeRole(roleId) {
    setRoles((prev) => prev.filter((r) => r.id !== roleId))
  }

  return (
    <AdminLayout
      title="Roles & Permissions"
      subtitle="Low-fi RBAC UI (persisted locally). Hook to backend when ready."
    >
      <div className="grid2">
        <div className="statCard">
          <strong>Create role</strong>
          <div className="field">
            <label>Role name</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. support-admin"
            />
          </div>
          <div className="row" style={{ marginTop: 12 }}>
            <button className="btn" type="button" disabled={!canCreate} onClick={onCreateRole}>
              Create
            </button>
            <span className="muted" style={{ fontSize: 13 }}>
              Stored in localStorage for now.
            </span>
          </div>
        </div>

        <div className="statCard">
          <strong>Grant permissions</strong>
          <div className="field">
            <label>Resource</label>
            <select className="input" value={perm} onChange={(e) => setPerm(e.target.value)}>
              {DEFAULT_PERMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Actions</label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {DEFAULT_ACTIONS.map((a) => (
                <label key={a} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={actions.has(a)}
                    onChange={() => toggleAction(a)}
                  />
                  <span>{a}</span>
                </label>
              ))}
            </div>
          </div>
          <p className="muted" style={{ margin: '10px 0 0', fontSize: 13 }}>
            Select a role below to apply this grant.
          </p>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div className="tableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Role</th>
              <th>Permissions</th>
              <th style={{ width: 280 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'grid', gap: 6 }}>
                    <strong>{r.name}</strong>
                    <span className="muted" style={{ fontSize: 12 }}>
                      {r.id}
                    </span>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {Object.entries(r.permissions || {}).flatMap(([p, acts]) =>
                      (acts || []).map((a) => (
                        <button
                          key={`${p}:${a}`}
                          type="button"
                          className="badge"
                          onClick={() => revoke(r.id, p, a)}
                          title="Click to revoke"
                        >
                          {p}:{a}
                        </button>
                      )),
                    )}
                    {!Object.keys(r.permissions || {}).length ? (
                      <span className="muted">—</span>
                    ) : null}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="btnSecondary" type="button" onClick={() => grant(r.id)}>
                      Grant selected
                    </button>
                    <button className="btnDanger" type="button" onClick={() => removeRole(r.id)}>
                      Delete role
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!roles.length ? (
              <tr>
                <td colSpan={3} className="muted">
                  No custom roles created yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  )
}

