# ⚡ QuizForge — Full-Stack v3.0

A complete full-stack quiz application built with **HTML · CSS · JavaScript · Node.js · Express · MongoDB**.

---

## 📁 Project Structure

```
quizforge/
├── backend/
│   ├── server.js                  ← Entry point (also serves frontend)
│   ├── db.js                      ← Mongoose connection
│   ├── seed.js                    ← Seeds questions + admin user
│   ├── .env                       ← Environment config
│   ├── data/
│   │   └── questions.js           ← 36 seed questions
│   ├── models/
│   │   ├── Question.js            ← Question schema
│   │   └── User.js                ← User schema (bcrypt hashed)
│   ├── routes/
│   │   ├── auth.js                ← Register / Login / Me / Logout
│   │   ├── questions.js           ← CRUD + search (admin-protected)
│   │   ├── scores.js              ← Submit / leaderboard
│   │   └── dashboard.js          ← Aggregate stats (admin-protected)
│   └── middleware/
│       ├── auth.js                ← JWT verify + admin guard
│       ├── validate.js            ← Body / param validation
│       ├── errorHandler.js        ← Central 404 + error handler
│       └── logger.js              ← Colored request logger
│
└── frontend/
    ├── index.html                 ← Home — subject selector
    ├── quiz.html                  ← Quiz page
    ├── result.html                ← Results + score ring
    ├── login.html                 ← Login form
    ├── register.html              ← Register form
    ├── dashboard.html             ← Stats dashboard (admin)
    ├── search.html                ← Full-text question search
    ├── leaderboard.html          ← Top scores per subject
    ├── admin.html                 ← Question CRUD panel (admin)
    ├── css/
    │   ├── shared.css             ← Design system for all pages
    │   └── quiz.css               ← Quiz-specific styles
    └── js/
        ├── api.js                 ← Shared fetch wrapper + auth helpers
        ├── nav.js                 ← Injects navbar into every page
        ├── app.js                 ← Quiz engine
        └── result.js              ← Result page logic
```

---

## 🚀 Run Instructions

### 1 — Install dependencies
```bash
cd quizforge/backend
npm install
```

### 2 — Start MongoDB
```bash
# macOS (Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod

# Direct
mongod --dbpath /data/db
```

### 3 — Seed the database
```bash
npm run seed
```

This inserts 36 questions (12 per subject) and creates an **admin user**:
```
email:    admin@quizforge.com
password: admin123
```
> ⚠️ Change the password after first login!

### 4 — Start the server
```bash
node server.js
# or with auto-restart:
npm run dev
```

### 5 — Open the app
```
http://localhost:3000
```

The backend serves the frontend automatically — **no separate web server needed.**

---

## 🔗 All Pages

| URL | Page | Access |
|-----|------|--------|
| `/` or `/index.html` | Subject selector | Public |
| `/quiz.html?subject=html` | Quiz | Public |
| `/result.html` | Result + score | Public |
| `/search.html` | Search questions | Public |
| `/leaderboard.html` | Top scores | Public |
| `/login.html` | Login | Public |
| `/register.html` | Register | Public |
| `/dashboard.html` | Stats dashboard | Admin |
| `/admin.html` | Question manager | Admin |

---

## 🔗 All API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create account `{username, email, password}` |
| POST | `/api/auth/login` | Login `{email, password}` → returns JWT |
| GET  | `/api/auth/me` | Get current user (requires token) |
| POST | `/api/auth/logout` | Logout (client drops token) |

### Questions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/questions` | List subjects with counts |
| GET | `/api/questions/:subject` | Fetch questions (html/css/javascript) |
| GET | `/api/questions/search?q=` | Full-text search |
| GET | `/api/questions/all` | All questions including inactive **(admin)** |
| POST | `/api/questions` | Add question **(admin)** |
| PUT | `/api/questions/:id` | Edit question **(admin)** |
| DELETE | `/api/questions/:id` | Soft-delete **(admin)** |

### Scores
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scores` | Submit score `{subject, score, total}` |
| GET | `/api/scores` | Get scores `?subject=&limit=` |
| GET | `/api/scores/leaderboard` | Top 10 per subject |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Aggregate stats **(admin)** |

---

## 🔐 Authentication Flow

```
Register/Login → receive JWT token
                       ↓
         stored in localStorage via api.js
                       ↓
         sent as: Authorization: Bearer <token>
                       ↓
    middleware/auth.js verifies → attaches req.user
                       ↓
    requireAdmin checks req.user.role === 'admin'
```

---

## ⚠️ Text Safety

Questions can contain characters like `<`, `>`, `&` as plain text (e.g. HTML tag names written in question body). The entire pipeline is safe:

1. **MongoDB** stores them as plain strings — no interpretation
2. **JSON.stringify** transmits them as-is
3. **Frontend always uses `textContent`** — never `innerHTML`

This applies to: `app.js`, `search.html`, `admin.html`, `leaderboard.html`
