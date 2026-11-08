import { Sparkles, Trash2 } from "lucide-react";
import { Field, TagInput, TextArea, TextInput } from "./Field";
import {
  emptyCert,
  emptyEducation,
  emptyExperience,
  emptyProject,
} from "../lib/defaults";

const sections = [
  ["job", "Job target"],
  ["profile", "Profile"],
  ["summary", "Summary"],
  ["skills", "Skills"],
  ["experience", "Experience"],
  ["projects", "Projects"],
  ["education", "Education"],
];

export default function Editor({
  resume,
  setResume,
  section,
  setSection,
  onAi,
  busy,
}) {
  const p = resume.personal;
  const setPersonal = (patch) =>
    setResume({ ...resume, personal: { ...p, ...patch } });

  const updateList = (key, id, patch) => {
    setResume({
      ...resume,
      [key]: resume[key].map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  };

  return (
    <div className="flex min-h-0 flex-1">
      <aside className="hidden w-44 shrink-0 border-r border-ink/10 p-3 md:block">
        {sections.map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSection(id)}
            className={`mb-1 w-full rounded-xl px-3 py-2 text-left text-sm ${
              section === id ? "bg-ink text-cream" : "hover:bg-ink/5"
            }`}
          >
            {label}
          </button>
        ))}
      </aside>

      <div className="min-h-0 flex-1 overflow-y-auto p-5 space-y-4">
        <div className="flex gap-2 overflow-x-auto md:hidden">
          {sections.map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={`whitespace-nowrap rounded-full px-3 py-1 text-xs ${
                section === id ? "bg-ink text-cream" : "bg-ink/5"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {section === "job" && (
          <div className="space-y-4">
            <p className="text-sm text-ink/60">
              Fill your profile, skills, jobs, and projects first. Paste the posting below,
              then click Generate resume. Gemini writes the summary, skills, and bullets
              from your details.
            </p>
            <Field label="Target role">
              <TextInput
                placeholder="e.g. Frontend intern"
                value={resume.targetRole}
                onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
              />
            </Field>
            <Field
              label="Job description"
              hint="Paste the full posting. Gemini needs this to write the resume."
            >
              <TextArea
                rows={12}
                placeholder="Paste the full job description…"
                value={resume.jobDescription}
                onChange={(e) => setResume({ ...resume, jobDescription: e.target.value })}
              />
            </Field>
            <button
              type="button"
              className="btn-gold w-full py-3"
              disabled={busy}
              onClick={() => onAi("generate")}
            >
              <Sparkles size={16} /> Generate resume
            </button>
          </div>
        )}

        {section === "profile" && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Full name">
              <TextInput value={p.fullName} onChange={(e) => setPersonal({ fullName: e.target.value })} />
            </Field>
            <Field label="Headline">
              <TextInput value={p.title} onChange={(e) => setPersonal({ title: e.target.value })} />
            </Field>
            <Field label="Email">
              <TextInput value={p.email} onChange={(e) => setPersonal({ email: e.target.value })} />
            </Field>
            <Field label="Phone">
              <TextInput value={p.phone} onChange={(e) => setPersonal({ phone: e.target.value })} />
            </Field>
            <Field label="Location">
              <TextInput value={p.location} onChange={(e) => setPersonal({ location: e.target.value })} />
            </Field>
            <Field label="Website">
              <TextInput value={p.website} onChange={(e) => setPersonal({ website: e.target.value })} />
            </Field>
            <Field label="LinkedIn">
              <TextInput value={p.linkedin} onChange={(e) => setPersonal({ linkedin: e.target.value })} />
            </Field>
            <Field label="GitHub">
              <TextInput value={p.github} onChange={(e) => setPersonal({ github: e.target.value })} />
            </Field>
          </div>
        )}

        {section === "summary" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button type="button" className="btn-gold" disabled={busy} onClick={() => onAi("summary")}>
                <Sparkles size={14} /> Write with Gemini
              </button>
            </div>
            <Field label="Professional summary">
              <TextArea
                rows={8}
                value={resume.summary}
                onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              />
            </Field>
          </div>
        )}

        {section === "skills" && (
          <div className="space-y-3">
            <div className="flex justify-end">
              <button type="button" className="btn-gold" disabled={busy} onClick={() => onAi("skills")}>
                <Sparkles size={14} /> Suggest from job
              </button>
            </div>
            <Field label="Skills" hint="Press Enter to add. Click a tag to remove.">
              <TagInput
                value={resume.skills}
                onChange={(skills) => setResume({ ...resume, skills })}
                placeholder="React, MongoDB, communication…"
              />
            </Field>
          </div>
        )}

        {section === "experience" && (
          <ListEditor
            items={resume.experience}
            onAdd={() => setResume({ ...resume, experience: [...resume.experience, emptyExperience()] })}
            onRemove={(id) =>
              setResume({ ...resume, experience: resume.experience.filter((item) => item.id !== id) })
            }
            addLabel="Add role"
            render={(item) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Role">
                    <TextInput value={item.role} onChange={(e) => updateList("experience", item.id, { role: e.target.value })} />
                  </Field>
                  <Field label="Company">
                    <TextInput value={item.company} onChange={(e) => updateList("experience", item.id, { company: e.target.value })} />
                  </Field>
                  <Field label="Location">
                    <TextInput value={item.location} onChange={(e) => updateList("experience", item.id, { location: e.target.value })} />
                  </Field>
                  <Field label="Dates">
                    <div className="flex gap-2">
                      <TextInput placeholder="Start" value={item.start} onChange={(e) => updateList("experience", item.id, { start: e.target.value })} />
                      <TextInput placeholder="End" value={item.current ? "Present" : item.end} onChange={(e) => updateList("experience", item.id, { end: e.target.value, current: false })} />
                    </div>
                  </Field>
                </div>
                <BulletEditor
                  bullets={item.bullets}
                  onChange={(bullets) => updateList("experience", item.id, { bullets })}
                  onRewrite={() => onAi("bullets", { section: "experience", item })}
                  busy={busy}
                />
              </div>
            )}
          />
        )}

        {section === "projects" && (
          <ListEditor
            items={resume.projects}
            onAdd={() => setResume({ ...resume, projects: [...resume.projects, emptyProject()] })}
            onRemove={(id) =>
              setResume({ ...resume, projects: resume.projects.filter((item) => item.id !== id) })
            }
            addLabel="Add project"
            render={(item) => (
              <div className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Name">
                    <TextInput value={item.name} onChange={(e) => updateList("projects", item.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Link">
                    <TextInput value={item.link} onChange={(e) => updateList("projects", item.id, { link: e.target.value })} />
                  </Field>
                  <Field label="Tech">
                    <TextInput value={item.tech} onChange={(e) => updateList("projects", item.id, { tech: e.target.value })} />
                  </Field>
                  <Field label="One-liner">
                    <TextInput value={item.description} onChange={(e) => updateList("projects", item.id, { description: e.target.value })} />
                  </Field>
                </div>
                <BulletEditor
                  bullets={item.bullets}
                  onChange={(bullets) => updateList("projects", item.id, { bullets })}
                  onRewrite={() => onAi("bullets", { section: "projects", item })}
                  busy={busy}
                />
              </div>
            )}
          />
        )}

        {section === "education" && (
          <div className="space-y-4">
            <ListEditor
              items={resume.education}
              onAdd={() => setResume({ ...resume, education: [...resume.education, emptyEducation()] })}
              onRemove={(id) =>
                setResume({ ...resume, education: resume.education.filter((item) => item.id !== id) })
              }
              addLabel="Add school"
              render={(item) => (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="School">
                    <TextInput value={item.school} onChange={(e) => updateList("education", item.id, { school: e.target.value })} />
                  </Field>
                  <Field label="Degree">
                    <TextInput value={item.degree} onChange={(e) => updateList("education", item.id, { degree: e.target.value })} />
                  </Field>
                  <Field label="Field">
                    <TextInput value={item.field} onChange={(e) => updateList("education", item.id, { field: e.target.value })} />
                  </Field>
                  <Field label="Years">
                    <div className="flex gap-2">
                      <TextInput placeholder="Start" value={item.start} onChange={(e) => updateList("education", item.id, { start: e.target.value })} />
                      <TextInput placeholder="End" value={item.end} onChange={(e) => updateList("education", item.id, { end: e.target.value })} />
                    </div>
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Details">
                      <TextInput value={item.details} onChange={(e) => updateList("education", item.id, { details: e.target.value })} />
                    </Field>
                  </div>
                </div>
              )}
            />
            <ListEditor
              items={resume.certifications}
              onAdd={() =>
                setResume({ ...resume, certifications: [...resume.certifications, emptyCert()] })
              }
              onRemove={(id) =>
                setResume({
                  ...resume,
                  certifications: resume.certifications.filter((item) => item.id !== id),
                })
              }
              addLabel="Add certification"
              render={(item) => (
                <div className="grid gap-3 sm:grid-cols-3">
                  <Field label="Name">
                    <TextInput value={item.name} onChange={(e) => updateList("certifications", item.id, { name: e.target.value })} />
                  </Field>
                  <Field label="Issuer">
                    <TextInput value={item.issuer} onChange={(e) => updateList("certifications", item.id, { issuer: e.target.value })} />
                  </Field>
                  <Field label="Year">
                    <TextInput value={item.year} onChange={(e) => updateList("certifications", item.id, { year: e.target.value })} />
                  </Field>
                </div>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function ListEditor({ items, onAdd, onRemove, addLabel, render }) {
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-2xl border border-ink/10 bg-white/70 p-4">
          <div className="mb-3 flex justify-end">
            <button type="button" className="text-ink/40 hover:text-rust" onClick={() => onRemove(item.id)}>
              <Trash2 size={16} />
            </button>
          </div>
          {render(item)}
        </div>
      ))}
      <button type="button" className="btn-ghost" onClick={onAdd}>
        {addLabel}
      </button>
    </div>
  );
}

function BulletEditor({ bullets, onChange, onRewrite, busy }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-ink/50">
          Bullets
        </span>
        <button type="button" className="btn-ghost py-1 text-xs" disabled={busy} onClick={onRewrite}>
          <Sparkles size={12} /> Rewrite with Gemini
        </button>
      </div>
      {bullets.map((bullet, i) => (
        <div key={i} className="flex gap-2">
          <TextArea
            rows={2}
            value={bullet}
            onChange={(e) => {
              const next = [...bullets];
              next[i] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            className="text-ink/30 hover:text-rust"
            onClick={() => onChange(bullets.filter((_, idx) => idx !== i))}
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button type="button" className="text-xs text-sage" onClick={() => onChange([...bullets, ""])}>
        + bullet
      </button>
    </div>
  );
}
