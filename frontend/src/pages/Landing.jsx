import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";

const features = [
  {
    kicker: "01",
    title: "Paste the posting",
    body: "Drop in the job description. Vellum reads the role, then Gemini rewrites your summary, bullets, and skills to match the language recruiters already use.",
  },
  {
    kicker: "02",
    title: "Keep the facts honest",
    body: "The model is instructed not to invent employers or degrees. It sharpens what you actually did — projects, internships, coursework — so the page still sounds like you.",
  },
  {
    kicker: "03",
    title: "Watch it on paper",
    body: "Three live templates in the same sitting. Print to PDF when the page looks right.",
  },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="relative overflow-hidden">
        <div className="grain pointer-events-none absolute inset-0 opacity-30 mix-blend-multiply" />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:py-28">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-rust">MERN · Gemini</p>
            <h1 className="mt-5 font-serif text-5xl leading-[1.05] tracking-tight md:text-7xl">
              Write the resume
              <span className="italic text-sage"> after </span>
              you read the job.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
              Sign in, fill in who you are and the job you want, then generate
              a resume. Gemini writes the page from your facts.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {user ? (
                <Link to="/builder" className="btn-ink px-6 py-3">
                  Open the builder
                </Link>
              ) : (
                <Link to="/login" state={{ from: "/builder" }} className="btn-ink px-6 py-3">
                  Sign in to write
                </Link>
              )}
              {!user && (
                <Link to="/register" state={{ from: "/builder" }} className="btn-ghost px-6 py-3">
                  Create an account
                </Link>
              )}
              {user && (
                <Link to="/dashboard" className="btn-ghost px-6 py-3">
                  Your library
                </Link>
              )}
            </div>
          </div>
          <aside className="rounded-[28px] border border-ink/10 bg-cream p-8 shadow-paper">
            <p className="font-serif text-2xl leading-snug">
              “A posting is a vocabulary. Your resume should speak it without
              becoming fiction.”
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.2em] text-ink/40">
              How Vellum uses Gemini
            </p>
            <ul className="mt-3 space-y-2 text-sm text-ink/70">
              <li>Professional summary from your facts + the JD</li>
              <li>Bullet rewrite per job or project</li>
              <li>Skill suggestions you can actually defend</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="border-t border-ink/10 bg-ink text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
          {features.map((item) => (
            <article key={item.kicker}>
              <p className="text-gold text-xs tracking-[0.25em]">{item.kicker}</p>
              <h2 className="mt-3 font-serif text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/70">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
