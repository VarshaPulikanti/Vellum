import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="no-print sticky top-0 z-30 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="font-serif text-2xl tracking-tight">
          Vellum
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              <NavLink to="/builder" className="btn-ghost">
                Builder
              </NavLink>
              <NavLink to="/dashboard" className="btn-ghost">
                Library
              </NavLink>
              <button type="button" className="btn-ghost" onClick={logout}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn-ghost">
                Sign in
              </NavLink>
              <NavLink to="/register" className="btn-ink">
                Create account
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
