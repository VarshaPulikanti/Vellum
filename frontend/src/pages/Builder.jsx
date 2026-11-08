import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Download, Loader2, Save, Wand2 } from "lucide-react";
import { createResume, fetchResume, runAi, updateResume } from "../api";
import { useAuth } from "../context/AuthContext";
import { emptyResume, sampleResume } from "../lib/defaults";
import Editor from "../components/Editor";
import ResumePaper from "../components/preview/ResumePaper";

const TEMPLATES = [
  ["editorial", "Editorial"],
  ["minimal", "Minimal"],
  ["technical", "Technical"],
];

const ACCENTS = ["#2c4a40", "#161412", "#b85c38", "#1d4e89", "#5c3d2e"];
const DRAFT_KEY = "vellum_draft";

export default function Builder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [resume, setResume] = useState(emptyResume);
  const [title, setTitle] = useState("Untitled resume");
  const [template, setTemplate] = useState("editorial");
  const [accent, setAccent] = useState("#2c4a40");
  const [section, setSection] = useState("job");
  const [tab, setTab] = useState("edit");
  const [busy, setBusy] = useState("");
  const [toast, setToast] = useState("");
  const [savedId, setSavedId] = useState(id || null);

  useEffect(() => {
    if (!id) {
      const local = localStorage.getItem(DRAFT_KEY);
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setResume(parsed.resume || emptyResume());
          setTitle(parsed.title || "Untitled resume");
          setTemplate(parsed.template || "editorial");
          setAccent(parsed.accent || "#2c4a40");
        } catch {
          /* ignore */
        }
      }
      return;
    }
    fetchResume(id)
      .then((data) => {
        const doc = data.resume;
        setSavedId(doc._id);
        setTitle(doc.title);
        setTemplate(doc.template);
        setAccent(doc.accent);
        setResume(doc.data);
      })
      .catch((err) => flash(err.message));
  }, [id]);

  useEffect(() => {
    if (savedId) return;
    const handle = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ resume, title, template, accent })
      );
    }, 400);
    return () => clearTimeout(handle);
  }, [resume, title, template, accent, savedId]);

  const flash = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 4200);
  };

  const onAi = async (action, extra = {}) => {
    setBusy(action);
    try {
      const data = await runAi(action, resume, extra);
      const result = data.result || {};
      if (action === "summary" && result.summary) {
        setResume((r) => ({ ...r, summary: result.summary }));
        setSection("summary");
      }
      if (action === "skills" && result.skills) {
        setResume((r) => ({ ...r, skills: result.skills }));
        setSection("skills");
      }
      if (action === "bullets" && result.bullets && extra.item) {
        const key = extra.section;
        setResume((r) => ({
          ...r,
          [key]: r[key].map((item) =>
            item.id === extra.item.id ? { ...item, bullets: result.bullets } : item
          ),
        }));
      }
      if (action === "generate" || action === "tailor") {
        setResume((r) => ({
          ...r,
          personal: {
            ...r.personal,
            title: result.title || r.personal.title,
          },
          summary: result.summary || r.summary,
          skills: result.skills || r.skills,
          experience: (r.experience || []).map((item) => {
            const next = (result.experience || []).find((row) => row.id === item.id);
            return next ? { ...item, bullets: next.bullets || item.bullets } : item;
          }),
          projects: (r.projects || []).map((item) => {
            const next = (result.projects || []).find((row) => row.id === item.id);
            return next
              ? {
                  ...item,
                  description: next.description || item.description,
                  bullets: next.bullets || item.bullets,
                }
              : item;
          }),
        }));
      }
      flash(
        action === "generate" || action === "tailor"
          ? "Gemini wrote your resume."
          : "Gemini updated the draft."
      );
    } catch (err) {
      flash(err.message);
    } finally {
      setBusy("");
    }
  };

  const save = async () => {
    setBusy("save");
    try {
      const payload = { title, template, accent, data: resume };
      if (savedId) {
        await updateResume(savedId, payload);
      } else {
        const data = await createResume(payload);
        setSavedId(data.resume._id);
        window.history.replaceState(null, "", `/builder/${data.resume._id}`);
      }
      flash("Saved to your library.");
    } catch (err) {
      flash(err.message);
    } finally {
      setBusy("");
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#efe8db]">
      <header className="no-print flex flex-wrap items-center gap-3 border-b border-ink/10 bg-paper/90 px-4 py-3 backdrop-blur">
        <Link to="/" className="font-serif text-xl">
          Vellum
        </Link>
        <input
          className="field max-w-[220px] py-1.5"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {TEMPLATES.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTemplate(value)}
              className={`rounded-full px-3 py-1 text-xs ${
                template === value ? "bg-ink text-cream" : "bg-white/70"
              }`}
            >
              {label}
            </button>
          ))}
          {ACCENTS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={color}
              onClick={() => setAccent(color)}
              className="h-5 w-5 rounded-full border border-white"
              style={{ background: color, outline: accent === color ? "2px solid #161412" : "none" }}
            />
          ))}
          <button type="button" className="btn-gold" disabled={!!busy} onClick={() => onAi("generate")}>
            {busy === "generate" ? <Loader2 size={14} className="animate-spin" /> : <Wand2 size={14} />}
            Generate resume
          </button>
          <button type="button" className="btn-sage" disabled={!!busy} onClick={save}>
            <Save size={14} /> Save
          </button>
          <button type="button" className="btn-ink" onClick={() => window.print()}>
            <Download size={14} /> PDF
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {toast && (
        <div className="no-print mx-4 mt-3 rounded-2xl bg-ink px-4 py-2 text-sm text-cream">{toast}</div>
      )}

      <div className="no-print flex gap-2 px-4 pt-3 md:hidden">
        <button type="button" className={tab === "edit" ? "btn-ink flex-1" : "btn-ghost flex-1"} onClick={() => setTab("edit")}>
          Edit
        </button>
        <button type="button" className={tab === "preview" ? "btn-ink flex-1" : "btn-ghost flex-1"} onClick={() => setTab("preview")}>
          Preview
        </button>
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div className={`no-print flex min-h-0 flex-col ${tab === "preview" ? "hidden md:flex" : "flex"}`}>
          <div className="flex gap-2 px-5 pt-4">
            <button type="button" className="btn-ghost text-xs" onClick={() => setResume(sampleResume())}>
              Load sample
            </button>
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => {
                setResume(emptyResume());
                setTitle("Untitled resume");
              }}
            >
              Clear
            </button>
            <Link to="/dashboard" className="btn-ghost text-xs">
              Library
            </Link>
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Sign out
            </button>
          </div>
          <Editor
            resume={resume}
            setResume={setResume}
            section={section}
            setSection={setSection}
            onAi={onAi}
            busy={!!busy}
          />
        </div>

        <div
          className={`print-root min-h-0 overflow-auto bg-[#d9d0c1] p-4 md:p-8 print:block ${
            tab === "edit" ? "hidden md:block" : "block"
          }`}
        >
          <div className="preview-zoom mx-auto w-fit">
            <ResumePaper resume={resume} template={template} accent={accent} />
          </div>
        </div>
      </div>
    </div>
  );
}
