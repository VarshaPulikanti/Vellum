import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { login, register, setToken } from "../api";
import Navbar from "../components/Navbar";
import { Field, TextInput } from "../components/Field";
import { useAuth } from "../context/AuthContext";

export default function Auth({ mode }) {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const next = location.state?.from || "/builder";
  const isLogin = mode === "login";

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={next} replace />;

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = isLogin
        ? await login(form.email, form.password)
        : await register(form.name, form.email, form.password);
      setToken(data.token);
      setUser(data.user);
      navigate(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold">Library</p>
          <h1 className="mt-3 font-serif text-5xl">
            {isLogin ? "Welcome back." : "Keep every draft."}
          </h1>
          <p className="mt-4 max-w-md text-ink/65">
            Sign in to open the builder. Your resumes are saved in MongoDB so
            you can come back and edit them later.
          </p>
        </div>
        <form
          onSubmit={onSubmit}
          className="rounded-[28px] border border-ink/10 bg-cream p-8 shadow-paper space-y-4"
        >
          {!isLogin && (
            <Field label="Name">
              <TextInput
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
          )}
          <Field label="Email">
            <TextInput
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Password" hint="At least 6 characters">
            <TextInput
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>
          {error && <p className="text-sm text-rust">{error}</p>}
          <button className="btn-ink w-full py-3" disabled={busy} type="submit">
            {busy ? "Working…" : isLogin ? "Sign in" : "Create account"}
          </button>
          <p className="text-center text-sm text-ink/50">
            {isLogin ? (
              <>
                New here?{" "}
                <Link className="text-sage" to="/register" state={location.state}>
                  Create an account
                </Link>
              </>
            ) : (
              <>
                Already have one?{" "}
                <Link className="text-sage" to="/login" state={location.state}>
                  Sign in
                </Link>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
}
