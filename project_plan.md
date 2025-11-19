# 🚀 EXPO AI --- 10-DAY COMPLETE BUILD PLAN

**Backend → Frontend → MVP → Deployment**\
Designed for clarity, speed, and zero surprises.

------------------------------------------------------------------------

## ✅ **DAY 1 --- Backend Foundation (Architecture + Setup)**

**Goal:** Establish backend structure with no future rewrites.

### Tasks

-   Create folder structure:\
    `/config`, `/models`, `/routes`, `/controllers`, `/middleware`,
    `/utils`
-   Install core backend packages\
    `express, mongoose, dotenv, cors, bcryptjs, jsonwebtoken, nodemon`
-   Implement utilities
    -   API response formatter\
    -   Global error handler\
-   MongoDB Atlas connection\
-   Create `.env.example`\
-   Add basic role system (`user`, `admin`)\
-   Commit: **"Backend: initial architecture + configs"**

### Deliverables

✔ Server running on `/api/health`

------------------------------------------------------------------------

## ✅ **DAY 2 --- Auth System (JWT + RBAC)**

**Goal:** Full authentication system.

### Tasks

-   User model (`name, email, password, role`)\
-   Routes:
    -   `POST /auth/signup`\
    -   `POST /auth/login`\
    -   `GET /auth/me`\
-   Middleware:
    -   `protect`\
    -   `roleAuth("admin")`\
-   Postman testing\
-   Commit: **"Auth: signup/login/me + roles + secure middleware"**

### Deliverables

✔ JWT auth ready for frontend

------------------------------------------------------------------------

## ✅ **DAY 3 --- Test Creation & Question Generation Structure**

**Goal:** Build structure for generating exam questions.

### Tasks

-   Test model (exam info + metadata)\
-   Question model\
-   Endpoints:
    -   `POST /tests`\
    -   `GET /tests/:id`\
    -   `POST /tests/generate` (mock AI JSON)
-   Commit: **"Tests: models + creation + mock generator"**

### Deliverables

✔ Test structure + generation pipeline ready

------------------------------------------------------------------------

## ✅ **DAY 4 --- AI Integration + Question Saving**

**Goal:** Connect real AI and save results.

### Tasks

-   Implement OpenAI strict JSON generator\
-   Update test with questions\
-   Add pagination query params\
-   Commit: **"AI: JSON generation + save + pagination"**

### Deliverables

✔ AI → DB → Ready for quiz

------------------------------------------------------------------------

## ✅ **DAY 5 --- Quiz Engine + Result Processing**

**Goal:** Users can take tests and get results.

### Tasks

-   Submission endpoint
    -   Calculate score\
    -   Correct vs incorrect\
-   Result endpoint\
-   Save user history\
-   Commit: **"Quiz: scoring + results"**

### Deliverables

✔ Complete backend

------------------------------------------------------------------------

# 🔥 **DAY 6 --- Frontend Setup + Auth Pages**

**Goal:** Begin frontend with stable backend.

### Tasks

-   Vite + React + Tailwind setup\
-   Add dark/light mode\
-   React Router\
-   `api.js` with interceptors\
-   `authService.js`\
-   Pages: Login, Signup\
-   Commit: **"Frontend: setup + theme + auth"**

### Deliverables

✔ Login/signup fully working

------------------------------------------------------------------------

# ⚡ **DAY 7 --- Core Pages: Home → New Test → Test**

### Tasks

-   Home page (hero + sidebar + CTA)
-   New Test page (forms + AI trigger)
-   Test page (MCQs + submit)
-   Commit: **"Frontend: Home + Test Flow"**

### Deliverables

✔ User generates + takes tests

------------------------------------------------------------------------

# 🚀 **DAY 8 --- Results + Previous Tests + Polish**

### Tasks

-   Results page\
-   Previous tests page (pagination + filters)\
-   Role-based UI\
-   UI polish\
-   Commit: **"Frontend: Results + History + polish"**

### Deliverables

✔ Core Expo AI complete

------------------------------------------------------------------------

# 🧪 **DAY 9 --- Testing + Hosting**

### Tasks

-   Backend Postman tests\
-   Deploy backend (Render/Railway)\
-   Deploy frontend (Vercel/Netlify)\
-   Setup ENV\
-   Commit: **"Deployment complete"**

### Deliverables

✔ Live production Expo AI

------------------------------------------------------------------------

# 🎤 **DAY 10 --- MVP Finalization + Pitch Deck**

### Tasks

-   Loading skeletons\
-   Empty states\
-   User tour\
-   Pitch deck\
-   Commit: **"Final MVP + Deck"**

------------------------------------------------------------------------

# 🏆 **FINAL RESULT AFTER 10 DAYS**

✔ Fully working backend\
✔ JWT auth + roles\
✔ AI-powered generator\
✔ Test creation + quiz engine\
✔ Results + history\
✔ Tailwind UI with dark/light\
✔ Fully deployed\
✔ Pitch-ready MVP
