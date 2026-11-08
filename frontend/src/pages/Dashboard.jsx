import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { createResume, deleteResume, fetchResumes } from "../api";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { emptyResume } from "../lib/defaults";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    fetchResumes()
      .then((data) => setResumes(data.resumes))
      .catch((err) => setError(err.message));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const createNew = async () => {
    const data = await createResume({
      title: "Untitled resume",
      data: emptyResume(),
    });
    navigate(`/builder/${data.resume._id}`);
  };

  const remove = async (id) => {
    await deleteResume(id);
    setResumes((list) => list.filter((item) => item._id !== id));
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gold">Your library</p>
            <h1 className="mt-2 font-serif text-4xl">Hello, {user.name.split(" ")[0]}.</h1>
          </div>
          <button type="button" className="btn-ink" onClick={createNew}>
            <Plus size={16} /> New resume
          </button>
        </div>
        {error && <p className="mt-6 text-sm text-rust">{error}</p>}
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((item) => (
            <article
              key={item._id}
              className="rounded-3xl border border-ink/10 bg-cream p-6"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-ink/40">
                {item.template}
              </p>
              <h2 className="mt-2 font-serif text-2xl">{item.title}</h2>
              <p className="mt-1 text-sm text-ink/50">
                {item.data?.targetRole || "No target role yet"}
              </p>
              <p className="mt-4 text-xs text-ink/40">
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </p>
              <div className="mt-5 flex gap-2">
                <Link className="btn-sage flex-1" to={`/builder/${item._id}`}>
                  Edit
                </Link>
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() => remove(item._id)}
                  aria-label="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </article>
          ))}
          {resumes.length === 0 && (
            <button
              type="button"
              onClick={createNew}
              className="rounded-3xl border border-dashed border-ink/20 p-8 text-left text-ink/50 hover:bg-cream"
            >
              Nothing saved yet. Start a draft and Gemini can tailor it to the posting.
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
