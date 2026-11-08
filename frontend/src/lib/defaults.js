export function uid() {
  return crypto.randomUUID();
}

export function emptyResume() {
  return {
    personal: {
      fullName: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    targetRole: "",
    jobDescription: "",
    summary: "",
    skills: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
  };
}

export function emptyExperience() {
  return {
    id: uid(),
    company: "",
    role: "",
    location: "",
    start: "",
    end: "",
    current: false,
    bullets: [""],
  };
}

export function emptyProject() {
  return {
    id: uid(),
    name: "",
    link: "",
    tech: "",
    description: "",
    bullets: [""],
  };
}

export function emptyEducation() {
  return {
    id: uid(),
    school: "",
    degree: "",
    field: "",
    start: "",
    end: "",
    details: "",
  };
}

export function emptyCert() {
  return { id: uid(), name: "", issuer: "", year: "" };
}

export function sampleResume() {
  return {
    personal: {
      fullName: "Aanya Mehta",
      title: "Full-stack developer",
      email: "aanya.mehta@email.com",
      phone: "+91 98765 43210",
      location: "Bengaluru, India",
      website: "aanyamehta.dev",
      linkedin: "linkedin.com/in/aanyamehta",
      github: "github.com/aanyamehta",
    },
    targetRole: "Software Engineer intern / junior full-stack",
    jobDescription: `We are hiring a Software Engineer Intern to join our product team. You will build React interfaces, Node.js APIs, and ship features with MongoDB. Nice to have: REST APIs, JWT auth, Tailwind, Git, and comfort with an LLM API such as Gemini. You will write clean code, review PRs, and talk to designers.`,
    summary:
      "Full-stack developer who ships MERN apps from sketch to deploy. Comfortable owning React UIs, Express APIs, and MongoDB models, with a bias for clear writing and measurable outcomes.",
    skills: [
      "JavaScript",
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "REST APIs",
      "Tailwind CSS",
      "Git",
      "JWT auth",
      "Gemini API",
    ],
    experience: [
      {
        id: uid(),
        company: "Campus Labs",
        role: "Web developer intern",
        location: "Remote",
        start: "Jan 2025",
        end: "May 2025",
        current: false,
        bullets: [
          "Built a React dashboard used by 400+ students to track club events and attendance.",
          "Designed REST endpoints in Express and cut average page load from 2.4s to 0.9s with caching.",
          "Added JWT auth and role-based routes so faculty could publish without sharing admin credentials.",
        ],
      },
    ],
    projects: [
      {
        id: uid(),
        name: "Vellum",
        link: "github.com/aanyamehta/vellum",
        tech: "MERN, Gemini API, Tailwind",
        description: "AI resume builder that tailors copy to a pasted job description.",
        bullets: [
          "Wired Gemini to rewrite summaries and bullets from structured resume JSON.",
          "Compared the draft to the posting so users could align skills and bullets to the role.",
        ],
      },
      {
        id: uid(),
        name: "Shelf",
        link: "github.com/aanyamehta/shelf",
        tech: "React, Node, MongoDB",
        description: "Campus book-swap marketplace with chat and listings.",
        bullets: [
          "Implemented listing CRUD, image URLs, and search filters for 1,200 mock inventory items.",
        ],
      },
    ],
    education: [
      {
        id: uid(),
        school: "National Institute of Technology",
        degree: "B.Tech",
        field: "Computer Science",
        start: "2022",
        end: "2026",
        details: "CGPA 8.7 / 10 · Coursework: DSA, DBMS, Networks",
      },
    ],
    certifications: [
      {
        id: uid(),
        name: "Google Cloud Generative AI",
        issuer: "Google",
        year: "2025",
      },
    ],
  };
}
