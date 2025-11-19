# Expo AI — Architecture Plan & MVP Readme

**Project:** Expo AI — AI-driven exam & test preparation platform (MERN)

**Purpose:** Provide a complete architecture plan (frontend, backend, data models, data flow, deployment, security, tests, and roadmap) so the team can build an accessible, scalable MVP and iterate toward a revenue-ready product.

---

## Table of contents
1. Vision & Goals
2. MVP Scope
3. Tech stack
4. High-level architecture (diagram & explanation)
5. Frontend architecture (pages, components, state management)
6. Backend architecture (API, controllers, services)
7. Database design (Mongoose schemas & relationships)
8. Data flow (request → AI → storage → analytics)
9. AI & External integrations (how question generation works)
10. Authentication & Security
11. Dev / Deploy / CI-CD
12. Monitoring, logging, analytics
13. Accessibility & UX considerations
14. Colors & Design tokens (light + dark modes)
15. Testing strategy
16. Environment variables
17. Next 90-day roadmap (milestones)
18. Appendix: example API schemas, sample JSON payloads, snippet mongoose models

---

## 1. Vision & Goals
- **Vision:** Enable learners to prepare for exams (school, scholarship, job, professional certifications) using AI-generated tailored quizzes, explanations, and progress tracking.
- **Primary goals for MVP:**
  - Let users generate a tailored quiz by specifying exam type and organization.
  - Present test questions, accept answers, compute results, and show explanations.
  - Persist tests and results for later review.
  - Simple account system (signup/login) with progress tracking.

## 2. MVP Scope
**Must-have features:**
- Landing (Home) page with clear value messaging and CTA to start a test.
- New Test form to collect user inputs (exam type, organization, topics, upload sample question PDF/image).
- Test runner UI (questions, options, submit, time limit optional).
- Result page with detailed per-question feedback and score.
- Previous tests list and detail view.
- Authentication (email + password); simple JWT based sessions.
- Admin/seed script to create sample exam templates.

**Nice-to-have (post-MVP):**
- Payment/ Pricing page and subscriptions
- Organization/Institute dashboard (B2B upload of exam patterns)
- Adaptive learning (AI picks questions based on performance)
- Mobile app or PWA optimization

## 3. Tech stack
- Frontend: React (Vite), React Router, TailwindCSS, Redux Toolkit (or Zustand for lighter state), react-query (TanStack Query) for server state
- Backend: Node.js + Express
- Database: MongoDB (Atlas) + Mongoose
- AI: OpenAI (or similar LLM) for question generation; optional local fine-tuned model later
- Auth: JWT (httpOnly cookie) + refresh tokens
- File storage: Cloud Storage (AWS S3 / Cloudinary) for PDF/images
- Deployment: Vercel / Netlify (frontend), Render / Railway / Heroku / Fly.io (backend) or Docker + cloud infra
- CI/CD: GitHub Actions
- Monitoring: Sentry (errors), Prometheus + Grafana (advanced), Logflare / Papertrail for logs
- Analytics: PostHog / Google Analytics / Plausible

## 4. High-level architecture

```
[React Client] <--> [Express API (REST)] <--> [MongoDB Atlas]
                     |                       
                     +---> [AI Provider (OpenAI)]
                     +---> [File Storage (S3/Cloudinary)]
                     +---> [Background Worker / Queue (BullMQ + Redis)]
```

**Notes:**
- Use a queue for long-running tasks (PDF parsing, AI generation) to keep API responsive.
- The client uses react-query to trigger generation and poll status of background job.

## 5. Frontend architecture

**Pages (8+):**
1. `Home` — hero, summary, start test CTA, features, testimonials, footer, left vertical navbar.
2. `NewTest` — multi-step form (exam meta → optional upload → review & submit).
3. `Test` — question renderer, option selection, progress bar, timer (optional).
4. `Result` — score, accordion per-question with user answer, correct answer, explanation.
5. `Previous` — list of past tests with search & filters (by exam type, organization, date).
6. `Pricing` — subscription plans and benefits (MVP: placeholder)
7. `Login` — auth form
8. `Signup` — auth form

**Core components:**
- `VerticalNavbar`, `Hero`, `TestCard`, `QuestionCard`, `OptionButton`, `ResultAccordion`, `FileUploader`, `FormWizard`, `Modal`, `Toast`.

**State & Data fetching:**
- Use Redux Toolkit for auth + local UI state (theme, preferences).
- Use react-query for server data (tests list, create-test job status, results).
- Keep question selection local to the `Test` page until submit.

**Routing & Code-splitting:**
- React Router with lazy-loaded routes for each page.
- Protect `Previous`, `NewTest`, `Test`, and `Result` behind auth where needed.

**Folder structure (suggested):**
```
/src
  /components
  /pages
  /hooks
  /lib (api clients)
  /features (redux slices)
  /styles (tailwind + design tokens)
  /utils
  /services (file upload, parse)
```

**Tailwind & themes:**
- Use CSS variables for theme tokens; Tailwind config for colors.
- Provide `ThemeProvider` or use `class` strategy for dark/light toggling.

## 6. Backend architecture

**API style:** RESTful endpoints, following standard separation: routes → controllers → services → models.

**Key endpoints:**
- `POST /api/auth/signup` — create user
- `POST /api/auth/login` — login (return httpOnly JWT)
- `POST /api/tests` — create a new test (accept metadata + optional file upload)
- `GET /api/tests/:id/status` — get generation status
- `GET /api/tests/:id` — get test details (questions)
- `POST /api/tests/:id/submit` — submit answers, compute score, save result
- `GET /api/users/:id/tests` — list previous tests
- `POST /api/upload` — upload file (PDF/image)
- `GET /api/admin/templates` — (admin only) exam templates

**Background workers:**
- Use BullMQ + Redis for queues (job: parse file, call AI, create question JSON, store)
- Workers call OpenAI and persist generated question documents in DB

**Services:**
- `aiService.js` — handles prompt engineering, rate-limiting, retry logic
- `parserService.js` — extract text from PDF/images (tesseract/ocr or 3rd party)
- `storageService.js` — handle upload to S3/Cloudinary and return URL

## 7. Database design (Mongoose)

**Guiding principles:**
- Optimize for reading a test (fetch test + questions in one query).
- Keep Questions embedded in Test as sub-documents unless questions are shared across tests.
- Use referencing for Users ↔ Tests and for organization templates.

**Schemas (high-level):**

### User
```js
{
  _id: ObjectId,
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, default: 'user' },
  createdAt: Date
}
```

### Test (primary document)
```js
{
  _id: ObjectId,
  user: ObjectId, // ref User
  title: String,
  examType: String,
  organization: String,
  metadata: { topics: [String], timeLimit: Number, difficulty: String },
  questions: [
    {
      _id: ObjectId,
      text: String,
      options: [{ id: String, text: String }],
      correctOptionId: String,
      explanation: String,
      tags: [String]
    }
  ],
  status: { type: String, enum: ['pending','ready','failed'], default: 'pending' },
  aiJob: { jobId: String, logs: [] },
  createdAt: Date
}
```

### Result (optional as separate collection)
```js
{
  _id: ObjectId,
  test: ObjectId,
  user: ObjectId,
  answers: [ { questionId: ObjectId, chosenOptionId: String } ],
  score: Number,
  duration: Number,
  createdAt: Date
}
```

**Why embed questions?** Embedding keeps test retrieval atomic and fast. If later questions are shared across tests or become large, we can refactor to a `Question` collection and reference.

## 8. Data flow (sequence)

**Create test flow (short):**
1. User fills NewTest form → `POST /api/tests` (body with metadata)
2. Backend creates Test doc with `status: pending` and enqueues `generate-questions` job (jobId)
3. Worker picks job → parse uploaded files (if any) → call AI provider with crafted prompt → receives JSON of questions → validate + sanitize → save into Test.questions, set `status: ready`
4. Frontend polls `GET /api/tests/:id/status` (or uses websocket) until ready
5. User hits `Start Test` → fetch `GET /api/tests/:id` and begin answering
6. On submit → `POST /api/tests/:id/submit` calculates score and persists Result

**Test execution:** client keeps answers until final submit; optionally allow autosave to prevent lost work.

## 9. AI & External integrations

**OpenAI usage pattern (recommended MVP):**
- Use structured prompt that asks for JSON output with a strict schema: question, options, answer index, explanation, tags.
- Validate LLM output with a JSON schema validator (ajv) before saving.
- If uploaded sample PDFs/images exist, extract text with OCR/parser and include the text snippet in prompt.

**Prompt engineering (short):**
- Provide exam metadata, organization specifics, and sample question text (if present) to the model.
- Ask for 10-20 questions in varying difficulty; require concise explanations (30–120 words each).

**Quota & costs:**
- Use server-side rate limiting and batching to reduce calls.
- Record tokens used per job for cost monitoring.

## 10. Authentication & Security

- Use JWT stored in httpOnly secure cookies to prevent XSS read.
- Protect sensitive endpoints and role-check admin routes.
- Input validation & sanitization with Joi / celebrate / yup.
- Escape outputs and avoid rendering raw HTML.
- Ensure file uploads are validated (size, type) and scanned if possible.
- Enable HTTPS everywhere. Use CORS allow-list for frontend origin.
- Implement rate-limiting (express-rate-limit) and bot protections (reCAPTCHA for signup).

## 11. Dev / Deploy / CI-CD

**Local dev:**
- `frontend` and `backend` as separate packages (monorepo optional)
- `dev.env` & local scripts to run both servers concurrently (concurrently or turbo)

**CI/CD (GitHub Actions example):**
- Lint + unit tests → build → deploy to staging
- On main branch merge → deploy to production

**Hosting recommendations:**
- Frontend: Vercel or Netlify
- Backend: Render / Railway / Fly.io or Docker to AWS ECS
- MongoDB: Atlas cluster
- Redis: Upstash / Redis Cloud for queue

## 12. Monitoring, logging, analytics
- Error tracking: Sentry
- Request logging: pino / winston with Logflare or similar
- Audit logs for admin actions
- Analytics: basic events for `test_create`, `test_start`, `test_submit`, `purchase` (if any)

## 13. Accessibility & UX
- Keyboard accessible components, large tap targets, readable font sizes.
- Use semantic HTML and ARIA roles in custom components.
- Ensure contrast ratios meet WCAG AA (especially for color choices).
- Offer dyslexia-friendly font and adjustable text sizes later.

## 14. Colors & Design tokens
**Light mode:**
- Base: `--bg: #ffffff` (soft white)
- Surface: `--surface: #F8FAFC` (very light gray)
- Primary: muted indigo/blue — e.g. `--primary: #4F46E5` (indigo-600) or slightly muted `#3B82F6` (blue-500)
- Accent: `--accent: #6366F1`
- Text primary: `#0F172A` (slate-900)

**Dark mode:**
- Base: `--bg-dark: #0b1220` (deep navy)
- Surface: `--surface-dark: #0f1724` (charcoal)
- Primary highlight: bright cyan/purple — e.g. `--primary-dark: #06B6D4` (cyan-500) or `#7C3AED` (purple-600)
- Accent: `--accent-dark: #22D3EE` or `#A78BFA`
- Text on dark: `#E6EEF8`

**Tailwind notes:** map tokens in `tailwind.config.js` under `theme.extend.colors` for consistent usage.

## 15. Testing strategy
- Unit tests: Jest for backend, React Testing Library for frontend
- Integration tests: API contract tests (supertest)
- E2E: Playwright or Cypress for core flows (signup, new test, take test, submit)
- Add linting (ESLint + Prettier) and commit hooks (husky)

## 16. Environment variables (examples)
```
# Backend
PORT=5000
MONGO_URI=...
JWT_SECRET=...
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=...
OPENAI_API_KEY=...
S3_BUCKET=...
S3_KEY=...
S3_SECRET=...
REDIS_URL=...
```

## 17. Next 90-day roadmap (high-level)
**Week 1-2:** Project setup, skeleton frontend + backend, auth, tailwind config, basic landing page
**Week 3-5:** NewTest form, backend test creation, queue integration, worker stub
**Week 6-8:** AI integration (OpenAI), question generation flow, Test runner UI
**Week 9-10:** Results page, previous tests, polish UI, accessibility audit
**Week 11-12:** Beta testing, feedback, basic analytics, README + docs, deploy to staging

## 18. Appendix — example schemas & sample payloads

### Example AI response JSON (strict format to request from LLM)
```json
{
  "questions": [
    {
      "id": "q1",
      "text": "What is the capital of France?",
      "options": [
        {"id":"a","text":"Paris"},
        {"id":"b","text":"Lyon"},
        {"id":"c","text":"Marseille"},
        {"id":"d","text":"Bordeaux"}
      ],
      "correctOptionId":"a",
      "explanation":"Paris is the capital city of France since ...",
      "difficulty":"easy",
      "tags":["geography","europe"]
    }
  ]
}
```

### Sample `POST /api/tests` request body
```json
{
  "title":"JAMB 2026 Practice Test - Physics",
  "examType":"JAMB",
  "organization":"Joint Admissions",
  "metadata":{"topics":["Mechanics","Waves"],"timeLimit":3600}
}
```

### Sample `POST /api/tests/:id/submit` request body
```json
{
  "answers":[{"questionId":"q1","chosenOptionId":"a"},{"questionId":"q2","chosenOptionId":"c"}]
}
```

### Mongoose model snippets (Test schema)
```js
const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  options: [{ id: String, text: String }],
  correctOptionId: String,
  explanation: String,
  tags: [String]
});

const TestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  examType: String,
  organization: String,
  metadata: Object,
  questions: [QuestionSchema],
  status: { type: String, default: 'pending' },
  aiJob: Object
}, { timestamps: true });
```

---

## Final notes & next steps
- This README contains a full, practical blueprint for the Expo AI MVP. It balances speed-to-market (MVP) with extensibility (queue, AI integration, modular backend).
- When you give the signal, I’ll convert this plan into:
  1. A GitHub repo skeleton with `frontend` and `backend` folders and starter code.
  2. Terraform / Dockerfile suggestions for infra (if you want infra-as-code).
  3. A UI design token file & tailwind config.

---

*Prepared by: Your co-founder — ready to build when you say go.*

