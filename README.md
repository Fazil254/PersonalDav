# 🌱 PersonalDev — Full-Stack Django + React Project

A complete personal development tracking application built with **Django REST Framework** + **React.js (Vite)**, following Techolas Technologies project guidelines.

---

## 📁 Project Structure

```
personal-dev/
├── backend/               # Django project
│   ├── config/            # Settings, URLs, WSGI
│   ├── users/             # Custom User, Profile, JWT auth
│   ├── goals/             # Goals, Milestones, Notes
│   ├── habits/            # Habits, HabitLogs
│   ├── journal/           # Journal entries, Tags, Mood
│   ├── dashboard/         # Aggregated stats API
│   ├── requirements.txt
│   ├── manage.py
│   └── .env.example
│
└── frontend/              # React (Vite) project
    ├── src/
    │   ├── api/           # Axios instance + all API calls
    │   ├── context/       # AuthContext (JWT in memory)
    │   ├── components/    # Layout, LoadingScreen
    │   ├── pages/         # All page components
    │   └── styles/        # Global CSS
    ├── index.html
    ├── package.json
    └── vite.config.js
```

---

## ✅ Features Implemented

| Requirement | Status |
|---|---|
| Django MVT + DRF APIs | ✅ |
| JWT Authentication (React track) | ✅ |
| Custom User model + Roles | ✅ |
| Django Admin (4+ modules) | ✅ |
| Custom Admin Panel (React) | ✅ |
| Role-Based Access Control | ✅ |
| Search & Filter | ✅ |
| Pagination | ✅ |
| Image Upload | ✅ |
| Form Validation (frontend + backend) | ✅ |
| Protected Routes | ✅ |
| RESTful API with HTTP status codes | ✅ |
| PDF Export (ReportLab) | ✅ |
| Email notifications | ✅ |
| Dashboard with Charts (Recharts) | ✅ |
| Mobile-responsive UI | ✅ |
| React Router v6 | ✅ |
| Context API for auth state | ✅ |
| Axios interceptors (auto token refresh) | ✅ |

### 📦 Admin Modules (4+)
1. **User Management** — view all users, activate/deactivate
2. **Goal Management** — all goals across users, filter by status/priority
3. **Habit Management** — all habits, streaks, frequency
4. **Journal Management** — all journal entries, mood filter
5. Django Admin: Users, Profiles, Goals, Categories, Milestones, Habits, HabitLogs, Journal

---

## 🚀 Backend Setup

### 1. Create virtualenv & install dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your values (DB credentials, email, etc.)
```

### 3. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Create superuser
```bash
python manage.py createsuperuser
```

### 5. Start Django server
```bash
python manage.py runserver
```

> API available at: `http://localhost:8000/api/`  
> Django Admin at: `http://localhost:8000/admin/`

---

## ⚛️ Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Start dev server
```bash
npm run dev
```

> App available at: `http://localhost:5173`

---

## 🔐 Authentication Flow

- **Register/Login** → returns `access` + `refresh` JWT tokens
- **Access token** stored in **memory** (not localStorage — secure)
- **Refresh token** stored in `localStorage` (used to silently refresh)
- **Axios interceptor** auto-refreshes access token on 401

---

## 🌐 API Endpoints

| Module | Endpoint | Methods |
|---|---|---|
| Auth | `/api/auth/register/` | POST |
| Auth | `/api/auth/login/` | POST |
| Auth | `/api/auth/logout/` | POST |
| Auth | `/api/auth/token/refresh/` | POST |
| Auth | `/api/auth/me/` | GET, PATCH |
| Auth | `/api/auth/profile/` | GET, PATCH |
| Auth | `/api/auth/change-password/` | POST |
| Goals | `/api/goals/` | GET, POST |
| Goals | `/api/goals/<id>/` | GET, PATCH, DELETE |
| Goals | `/api/goals/<id>/milestones/` | GET, POST |
| Goals | `/api/goals/<id>/notes/` | GET, POST |
| Goals | `/api/goals/export/pdf/` | GET |
| Goals | `/api/goals/categories/` | GET, POST |
| Habits | `/api/habits/` | GET, POST |
| Habits | `/api/habits/<id>/` | GET, PATCH, DELETE |
| Habits | `/api/habits/<id>/log/` | POST (toggle) |
| Habits | `/api/habits/stats/weekly/` | GET |
| Journal | `/api/journal/` | GET, POST |
| Journal | `/api/journal/<id>/` | GET, PATCH, DELETE |
| Journal | `/api/journal/tags/` | GET, POST |
| Journal | `/api/journal/stats/mood/` | GET |
| Dashboard | `/api/dashboard/` | GET |
| Dashboard | `/api/dashboard/admin/` | GET (admin only) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.11+, Django 4.2 |
| API | Django REST Framework |
| Auth | JWT (djangorestframework-simplejwt) |
| Database | SQLite (dev) / MySQL (prod) |
| Frontend | React 18, Vite |
| Routing | React Router v6 |
| HTTP | Axios with interceptors |
| State | Context API |
| Charts | Recharts |
| Forms | React Hook Form |
| Styling | Custom CSS (dark theme) |
| PDF | ReportLab |
| Fonts | Syne + DM Sans |

---

## 🚢 Deployment

### Backend → PythonAnywhere / Render
```bash
pip install gunicorn
gunicorn config.wsgi:application
```

### Frontend → Vercel / Netlify
```bash
npm run build
# Upload /dist folder
```

---

## 📌 Week-by-Week Plan

| Week | Focus | Status |
|---|---|---|
| Week 1 | Planning, models, Django admin, auth | ✅ |
| Week 2 | DRF APIs, JWT, CRUD, search/filter/pagination | ✅ |
| Week 3A | React frontend — all pages | ✅ |
| Week 4 | Admin panel, PDF export, charts, polish | ✅ |

---

## 👨‍💻 Author

Built for Techolas Technologies Django Training Program  
*Django Full-Stack Final Project — Personal Development App*
