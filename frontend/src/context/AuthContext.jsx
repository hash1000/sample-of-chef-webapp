import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import {
  clearAuthStorage,
  getAuthSnapshot,
  setAuthSnapshot,
} from '../auth/authStorage'

const AuthContext = createContext(null)

const initialState = {
  isBootstrapping: true,
  token: null,
  user: null, // { id, name, email, role }
}

function reducer(state, action) {
  switch (action.type) {
    case 'BOOTSTRAP_DONE':
      return {
        isBootstrapping: false,
        token: action.payload?.token ?? null,
        user: action.payload?.user ?? null,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isBootstrapping: false,
        token: action.payload.token,
        user: action.payload.user,
      }
    case 'LOGOUT':
      return {
        isBootstrapping: false,
        token: null,
        user: null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const snapshot = getAuthSnapshot()
    dispatch({ type: 'BOOTSTRAP_DONE', payload: snapshot })
  }, [])

  useEffect(() => {
    if (state.isBootstrapping) return
    if (state.token && state.user) {
      setAuthSnapshot({ token: state.token, user: state.user })
    } else {
      clearAuthStorage()
    }
  }, [state.isBootstrapping, state.token, state.user])

  const value = useMemo(() => {
    const role = state.user?.role ?? null
    return {
      isBootstrapping: state.isBootstrapping,
      isAuthenticated: Boolean(state.token && state.user),
      token: state.token,
      user: state.user,
      role,
      loginSuccess: ({ token, user }) =>
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } }),
      logout: () => dispatch({ type: 'LOGOUT' }),
    }
  }, [state.isBootstrapping, state.token, state.user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

