function contactLine(personal) {
  return [
    personal.email,
    personal.phone,
    personal.location,
    personal.website,
    personal.linkedin,
    personal.github,
  ].filter(Boolean);
}

function HeaderBlock({ personal, accent, serif }) {
  return (
    <header className="text-center">
      <h1
        className={`${serif ? "font-serif" : "font-sans"} text-[28px] font-semibold tracking-tight`}
        style={{ color: accent }}
      >
        {personal.fullName || "Your name"}
      </h1>
      <p className="mt-0.5 text-[12px] uppercase tracking-[0.18em] text-neutral-600">
        {personal.title || "Target title"}
      </p>
      <p className="mt-2 text-[10.5px] leading-relaxed text-neutral-600">
        {contactLine(personal).join("  ·  ")}
      </p>
    </header>
  );
}

function Section({ title, accent, children, rule = true }) {
  if (!children) return null;
  return (
    <section className="mt-3">
      <h2
        className="text-[11px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: accent }}
      >
        {title}
      </h2>
      {rule && <div className="mt-1 mb-1.5 h-px" style={{ background: accent, opacity: 0.35 }} />}
      {children}
    </section>
  );
}

function ExperienceList({ items }) {
  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id}>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[12px] font-semibold">
              {item.role}
              {item.company ? ` · ${item.company}` : ""}
            </p>
            <p className="shrink-0 text-[10px] text-neutral-500">
              {item.start}
              {item.start && (item.current || item.end) ? " – " : ""}
              {item.current ? "Present" : item.end}
            </p>
          </div>
          {item.location && (
            <p className="text-[10px] italic text-neutral-500">{item.location}</p>
          )}
          <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-snug text-neutral-800">
            {(item.bullets || []).filter(Boolean).map((bullet, i) => (
              <li key={`${item.id}-b-${i}`}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function Editorial({ resume, accent }) {
  const { personal } = resume;
  return (
    <div className="h-full px-[16mm] py-[14mm] text-neutral-900">
      <HeaderBlock personal={personal} accent={accent} serif />
      <Section title="Summary" accent={accent}>
        {resume.summary && (
          <p className="text-[11.5px] leading-relaxed">{resume.summary}</p>
        )}
      </Section>
      {resume.skills?.length > 0 && (
        <Section title="Skills" accent={accent}>
          <p className="text-[11px] leading-relaxed">{resume.skills.join("  ·  ")}</p>
        </Section>
      )}
      {resume.experience?.length > 0 && (
        <Section title="Experience" accent={accent}>
          <ExperienceList items={resume.experience} />
        </Section>
      )}
      {resume.projects?.length > 0 && (
        <Section title="Projects" accent={accent}>
          <div className="space-y-2">
            {resume.projects.map((item) => (
              <div key={item.id}>
                <div className="flex justify-between gap-3">
                  <p className="text-[12px] font-semibold">
                    {item.name}
                    {item.tech ? <span className="font-normal text-neutral-500"> — {item.tech}</span> : null}
                  </p>
                  {item.link && <p className="text-[10px] text-neutral-500">{item.link}</p>}
                </div>
                {item.description && (
                  <p className="text-[11px] italic text-neutral-600">{item.description}</p>
                )}
                <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-snug">
                  {(item.bullets || []).filter(Boolean).map((bullet, i) => (
                    <li key={`${item.id}-b-${i}`}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}
      {resume.education?.length > 0 && (
        <Section title="Education" accent={accent}>
          {resume.education.map((item) => (
            <div key={item.id} className="flex justify-between gap-3 text-[11.5px]">
              <p>
                <span className="font-semibold">{item.school}</span>
                {(item.degree || item.field) &&
                  ` — ${[item.degree, item.field].filter(Boolean).join(" in ")}`}
                {item.details ? ` · ${item.details}` : ""}
              </p>
              <p className="shrink-0 text-[10px] text-neutral-500">
                {[item.start, item.end].filter(Boolean).join(" – ")}
              </p>
            </div>
          ))}
        </Section>
      )}
      {resume.certifications?.length > 0 && (
        <Section title="Certifications" accent={accent}>
          <p className="text-[11px]">
            {resume.certifications
              .map((item) => [item.name, item.issuer, item.year].filter(Boolean).join(", "))
              .join("  ·  ")}
          </p>
        </Section>
      )}
    </div>
  );
}

function Minimal({ resume, accent }) {
  return (
    <div className="h-full px-[18mm] py-[16mm] text-neutral-900">
      <h1 className="text-[26px] font-medium tracking-tight">{resume.personal.fullName || "Your name"}</h1>
      <p className="text-[12px]" style={{ color: accent }}>
        {resume.personal.title}
      </p>
      <p className="mt-2 max-w-[150mm] text-[10px] text-neutral-500">
        {contactLine(resume.personal).join("  /  ")}
      </p>
      {resume.summary && <p className="mt-5 text-[11.5px] leading-relaxed">{resume.summary}</p>}
      {resume.skills?.length > 0 && (
        <p className="mt-4 text-[11px] text-neutral-700">{resume.skills.join(" · ")}</p>
      )}
      {resume.experience?.length > 0 && (
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Experience</p>
          <div className="mt-2">
            <ExperienceList items={resume.experience} />
          </div>
        </div>
      )}
      {resume.projects?.length > 0 && (
        <div className="mt-5">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Projects</p>
          <div className="mt-2 space-y-2">
            {resume.projects.map((item) => (
              <div key={item.id} className="text-[11px]">
                <p className="font-medium">
                  {item.name} {item.tech && <span className="text-neutral-500">({item.tech})</span>}
                </p>
                <ul className="list-disc pl-4">
                  {(item.bullets || []).filter(Boolean).map((b, i) => (
                    <li key={`${item.id}-b-${i}`}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      {resume.education?.length > 0 && (
        <div className="mt-5 text-[11px]">
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">Education</p>
          {resume.education.map((item) => (
            <p key={item.id} className="mt-1">
              {item.school} — {[item.degree, item.field].filter(Boolean).join(" ")}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

function Technical({ resume, accent }) {
  const { personal } = resume;
  return (
    <div className="grid h-full grid-cols-[62mm_1fr]">
      <aside className="px-5 py-8 text-white" style={{ background: accent }}>
        <h1 className="text-[20px] font-semibold leading-tight">{personal.fullName || "Your name"}</h1>
        <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/80">{personal.title}</p>
        <div className="mt-6 space-y-1 text-[10px] leading-relaxed text-white/90">
          {contactLine(personal).map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        {resume.skills?.length > 0 && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Skills</p>
            <ul className="mt-2 space-y-1 text-[11px]">
              {resume.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        )}
        {resume.education?.length > 0 && (
          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">Education</p>
            {resume.education.map((item) => (
              <p key={item.id} className="mt-2 text-[11px] leading-snug">
                {item.school}
                <br />
                {[item.degree, item.field].filter(Boolean).join(" ")}
              </p>
            ))}
          </div>
        )}
      </aside>
      <div className="px-6 py-8">
        {resume.summary && (
          <>
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">Profile</p>
            <p className="mt-2 text-[11.5px] leading-relaxed">{resume.summary}</p>
          </>
        )}
        {resume.experience?.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">Experience</p>
            <div className="mt-2">
              <ExperienceList items={resume.experience} />
            </div>
          </div>
        )}
        {resume.projects?.length > 0 && (
          <div className="mt-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-neutral-400">Projects</p>
            <div className="mt-2 space-y-2 text-[11px]">
              {resume.projects.map((item) => (
                <div key={item.id}>
                  <p className="font-semibold">{item.name}</p>
                  <ul className="list-disc pl-4">
                    {(item.bullets || []).filter(Boolean).map((b, i) => (
                      <li key={`${item.id}-b-${i}`}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
        {resume.certifications?.length > 0 && (
          <p className="mt-5 text-[11px] text-neutral-600">
            {resume.certifications.map((c) => c.name).filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}

export default function ResumePaper({ resume, template, accent }) {
  const body =
    template === "minimal" ? (
      <Minimal resume={resume} accent={accent} />
    ) : template === "technical" ? (
      <Technical resume={resume} accent={accent} />
    ) : (
      <Editorial resume={resume} accent={accent} />
    );

  return <div className="resume-sheet overflow-hidden shadow-paper">{body}</div>;
}
