function compactResume(resume) {
  return JSON.stringify(
    {
      personal: resume.personal,
      targetRole: resume.targetRole,
      summary: resume.summary,
      skills: resume.skills,
      experience: resume.experience,
      projects: resume.projects,
      education: resume.education,
      certifications: resume.certifications,
    },
    null,
    2
  );
}

export function summaryPrompt(resume) {
  return `You are an expert resume writer. Write a tight professional summary (3-4 sentences, first person omitted, no fluff) for this candidate. Mirror keywords from the job description when they are honest matches. Do not invent employers, degrees, or tools.

Return JSON: { "summary": "..." }

Target role: ${resume.targetRole || "Not specified"}
Job description:
${resume.jobDescription || "None provided"}

Candidate:
${compactResume(resume)}`;
}

export function generatePrompt(resume) {
  return `You are a professional resume writer. The user filled in their real details and pasted a job description. Write a complete resume from those facts.

Write:
- a headline (short target title for the role)
- a professional summary (3-4 sentences)
- a skills list that includes tools from the job description the candidate can honestly claim from their jobs, projects, or listed skills
- stronger experience bullets (keep the same jobs, companies, dates, and ids)
- project one-liners and bullets (keep the same project names, links, and ids)

Use the job description for wording and keywords. Do not invent employers, titles, dates, schools, or tools the candidate has no basis for. If a section is empty, return an empty array for it.

Return JSON with this exact shape:
{
  "title": "string",
  "summary": "string",
  "skills": ["string"],
  "experience": [{ "id": "same id", "bullets": ["string"] }],
  "projects": [{ "id": "same id", "description": "string", "bullets": ["string"] }]
}

Keep the same experience and project ids. 3-5 bullets per role, 2-4 per project. Start bullets with strong verbs. No first person.

Target role: ${resume.targetRole || "Not specified"}
Job description:
${resume.jobDescription || "None provided"}

Candidate:
${compactResume(resume)}`;
}

export function tailorPrompt(resume) {
  return generatePrompt(resume);
}

export function bulletsPrompt(resume, section, item) {
  return `Rewrite these resume bullets so they are specific and aligned to the job. Do not invent technologies or metrics that are not implied.

Return JSON: { "bullets": ["string", "string", "string"] }

Section: ${section}
Item: ${JSON.stringify(item, null, 2)}
Target role: ${resume.targetRole || "Not specified"}
Job description:
${resume.jobDescription || "None provided"}`;
}

export function skillsPrompt(resume) {
  return `From the job description, suggest 10-16 skills this candidate can honestly claim based on their projects, jobs, and current skills. Mix tools, languages, and soft skills that appear in the JD.

Return JSON: { "skills": ["string"] }

Job description:
${resume.jobDescription || "None provided"}

Current skills: ${(resume.skills || []).join(", ")}
Experience/projects snapshot:
${compactResume(resume)}`;
}
