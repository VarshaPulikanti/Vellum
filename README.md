# Vellum

A MERN resume builder that uses **Google Gemini** to write a resume from your facts and a pasted job description.

Sign in, fill in profile, skills, projects, education, and experience. Paste the posting. Click **Generate resume**. Gemini rewrites the headline, summary, bullets, and skills without inventing employers or degrees. Preview three templates, save drafts to MongoDB, and print to PDF.

## Stack

- **MongoDB** — users and saved resumes
- **Express** — auth, CRUD, Gemini proxy
- **React + Vite** — builder, live preview, library
- **Node.js** — API server
- **Gemini API** — `gemini-3.6-flash` by default

## Setup

You need **Node.js 18+**, **MongoDB** (local or [Atlas](https://www.mongodb.com/atlas)), and a free [Gemini API key](https://aistudio.google.com/apikey).

```bash
cd Project3
npm install
npm run install:all
```

Copy environment variables:

```bash
copy backend\.env.example backend\.env
```

On macOS/Linux use `cp backend/.env.example backend/.env`.

Edit `backend/.env` and paste your Gemini key:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/vellum
JWT_SECRET=a-long-random-string
GEMINI_API_KEY=paste_your_key_here
GEMINI_MODEL=gemini-3.6-flash
CLIENT_URL=http://localhost:5173
```

If `gemini-3.6-flash` is not available on your account, try `gemini-2.5-flash` or `gemini-1.5-flash`.

Start MongoDB locally if you are not using Atlas, then run both apps:

```bash
npm run dev
```

- App: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Using it

1. Create an account and sign in.
2. Open the builder. Click **Load sample** or fill in your own details.
3. Paste a job description under **Job target**.
4. Click **Generate resume** — Gemini writes summary, skills, and bullets.
5. Switch templates, then **PDF** (browser print → Save as PDF).
6. **Save** to keep the resume in your library.

AI still works if MongoDB is down. Sign-in and save need a working `MONGO_URI`.

## API

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | no | Create account |
| POST | `/api/auth/login` | no | Sign in |
| GET | `/api/resumes` | yes | List resumes |
| POST | `/api/ai` | no | `{ action, resume }` where action is `summary`, `generate`, `bullets`, or `skills` |
