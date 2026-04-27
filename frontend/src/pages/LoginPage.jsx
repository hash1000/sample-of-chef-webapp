import { useMemo, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { login } from '../auth/authService'
import { roleHomePath } from '../auth/roles'
import { useAuth } from '../context/AuthContext'
import { getApiErrorMessage } from '../services/api'
import './ui.css'

export default function LoginPage() {
  const { isBootstrapping, isAuthenticated, role, loginSuccess } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const from = useMemo(() => location.state?.from?.pathname, [location.state]);

  if (!isBootstrapping && isAuthenticated) {
    return <Navigate to={from || roleHomePath(role)} replace />;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const data = await login({ email, password });
      if (!data?.token || !data?.user) {
        throw new Error("Invalid server response");
      }
      loginSuccess({ token: data.token, user: data.user });
      navigate(from || roleHomePath(data.user.role), { replace: true });
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">Login</h1>
        <p className="muted">Sign in to continue.</p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              className="border border-gray-500 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              className="border border-gray-500 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isSubmitting}
              minLength={6}
            />
          </div>

          {error ? (
            <div className="error" role="alert">
              {error}
            </div>
          ) : null}

          <div className="row">
            <button className="btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in…" : "Login"}
            </button>
            <Link className="link" to="/signup">
              Create account
            </Link>
            <Link className="link" to="/register-restaurant">
              Register Restaurant
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
