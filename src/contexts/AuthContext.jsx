import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const USERS_KEY = 'tt_users'
const SESSION_KEY = 'tt_session'

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

function saveSession(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getSession())

  useEffect(() => {
    saveSession(user)
  }, [user])

  function signup({ name, email, password, zipCode }) {
    const users = getUsers()
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: email.toLowerCase(),
      password,
      zipCode,
      avatar: null,
      createdAt: new Date().toISOString(),
    }
    saveUsers([...users, newUser])
    const { password: _, ...sessionUser } = newUser
    setUser(sessionUser)
    return { ok: true }
  }

  function login({ email, password }) {
    const users = getUsers()
    const found = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const { password: _, ...sessionUser } = found
    setUser(sessionUser)
    return { ok: true }
  }

  function logout() {
    setUser(null)
  }

  function updateProfile(updates) {
    const users = getUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx === -1) return { ok: false, error: 'User not found.' }

    if (updates.email && updates.email.toLowerCase() !== user.email) {
      const duplicate = users.find(
        (u, i) => i !== idx && u.email.toLowerCase() === updates.email.toLowerCase()
      )
      if (duplicate) return { ok: false, error: 'Email already in use.' }
    }

    const updated = { ...users[idx], ...updates }
    users[idx] = updated
    saveUsers(users)
    const { password: _, ...sessionUser } = updated
    setUser(sessionUser)
    return { ok: true }
  }

  function updateAvatar(dataUrl) {
    return updateProfile({ avatar: dataUrl })
  }

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updateProfile, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
