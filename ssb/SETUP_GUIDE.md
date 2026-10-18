# SSB (Syrian Student Bureau) Platform - Complete Documentation

## 📋 Project Overview

This is a complete web and admin platform for the Syrian Student Bureau (SSB) that manages:
- **Activities**: Timeline of upcoming events and activities
- **News**: Publication and management of news articles
- **Events**: Event management with capacity tracking

The platform consists of two main components:
1. **Frontend**: React + TypeScript + Vite (User-facing website + Admin Dashboard)
2. **Backend**: Django REST API (Data management and API endpoints)

---

## 🏗️ Project Structure

```
ssb/
├── ssb-react/                 # Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/        # Admin Dashboard Components
│   │   │   ├── home/         # Home Page Components
│   │   │   ├── layout/       # Layout Components
│   │   │   ├── news/         # News Components
│   │   │   └── shared/       # Shared Components
│   │   ├── pages/            # Page Components
│   │   ├── services/         # API Services
│   │   └── App.tsx           # Main App Component
│   └── package.json
│
└── ssb-backend/              # Backend Application
    ├── ssb_backend/          # Project Settings
    ├── content/              # Main App (Models, Views, Serializers)
    ├── manage.py
    └── requirements.txt
```

---

## 🚀 Quick Start

### Option 1: Using Both Frontend and Backend (Recommended)

#### Backend Setup (Django)

1. **Navigate to backend directory:**
   ```bash
   cd ssb-backend
   ```

2. **Create virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser:**
   ```bash
   python manage.py createsuperuser
   ```
   Enter your desired username, email, and password.

6. **Start development server:**
   ```bash
   python manage.py runserver
   ```
   Backend is now running at: `http://localhost:8000`
   Admin panel: `http://localhost:8000/admin`

#### Frontend Setup (React)

1. **In a new terminal, navigate to frontend directory:**
   ```bash
   cd ssb-react
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend is now running at: `http://localhost:5173`

#### Access the Application

- **Main Website**: http://localhost:5173
- **Admin Dashboard**: Click "لوحة التحكم" button in the header (or go to Admin Page)
- **API Documentation**: http://localhost:8000/api/v1/
- **Django Admin**: http://localhost:8000/admin

---

### Option 2: Frontend Only (Without Backend)

If you want to run only the frontend with mock data:

```bash
cd ssb-react
npm install
npm run dev
```

The admin panel will work with local state management (data resets on refresh).

---

## 📊 Admin Dashboard Features

### Access Admin Panel
- Click the "لوحة التحكم" button in the website header
- Or navigate directly to the admin page when running frontend

### Manage Activities
- ✅ View all activities
- ➕ Add new activities
- ✏️ Edit existing activities
- 🗑️ Delete activities
- Search and filter by type, date, time

### Manage News
- ✅ View all news articles
- ➕ Add new news with image and category
- ✏️ Edit existing news
- 🗑️ Delete news articles
- Track view counts
- Filter by category

### Manage Events
- ✅ View all events
- ➕ Add new events with capacity management
- ✏️ Edit existing events
- 🗑️ Delete events
- Track attendees vs capacity
- Filter by status (upcoming, ongoing, completed)

---

## 🔌 API Endpoints

### Fully RESTful API

#### Activities
```
GET    /api/v1/activities/              # List all activities
POST   /api/v1/activities/              # Create activity
GET    /api/v1/activities/:id/          # Get activity
PUT    /api/v1/activities/:id/          # Update activity
DELETE /api/v1/activities/:id/          # Delete activity
GET    /api/v1/activities/upcoming/     # Get upcoming activities
```

#### News
```
GET    /api/v1/news/                    # List all news
POST   /api/v1/news/                    # Create news
GET    /api/v1/news/:id/                # Get news
PUT    /api/v1/news/:id/                # Update news
DELETE /api/v1/news/:id/                # Delete news
GET    /api/v1/news/latest/             # Get latest news
GET    /api/v1/news/trending/           # Get trending news
GET    /api/v1/news/by_category/        # Get by category
POST   /api/v1/news/:id/increment_views/ # Increment views
```

#### Events
```
GET    /api/v1/events/                  # List all events
POST   /api/v1/events/                  # Create event
GET    /api/v1/events/:id/              # Get event
PUT    /api/v1/events/:id/              # Update event
DELETE /api/v1/events/:id/              # Delete event
GET    /api/v1/events/upcoming_events/  # Get upcoming events
GET    /api/v1/events/ongoing_events/   # Get ongoing events
POST   /api/v1/events/:id/register_attendee/ # Register attendee
```

### Query Parameters

All list endpoints support:
- **search**: Search by title/description/etc
  ```
  /api/v1/activities/?search=workshop
  ```
- **ordering**: Sort results
  ```
  /api/v1/news/?ordering=-date
  ```
- **page**: Pagination
  ```
  /api/v1/activities/?page=2
  ```

---

## 💻 Frontend Technologies

- **React 19.1.1** - UI Library
- **TypeScript** - Type safety
- **Vite** - Build tool (ultra-fast)
- **Tailwind CSS** - Styling
- **React Big Calendar** - Calendar component
- **Moment.js** - Date handling

### Key Components

**Layout Components:**
- `Header.tsx` - Navigation bar with admin button
- `Footer.tsx` - Footer section
- `Sidebar.tsx` - Sidebar navigation

**Home Components:**
- `Hero.tsx` - Hero section
- `Activities.tsx` - Activities timeline
- `News.tsx` - News articles grid
- `Partners.tsx` - Partner organizations

**Admin Components:**
- `AdminLayout.tsx` - Admin dashboard layout
- `ActivitiesManager.tsx` - Activities management
- `NewsManager.tsx` - News management
- `EventsManager.tsx` - Events management
- Form components for adding/editing

---

## 🐍 Backend Technologies

- **Django 4.2.7** - Web framework
- **Django REST Framework 3.14.0** - API toolkit
- **PostgreSQL** - Database (SQLite for development)
- **Django CORS Headers** - CORS support

### Models

**Activity Model:**
```python
- id (auto)
- date (string)
- year (string)
- title (string)
- description (text)
- activity_type (حضوري/عن بعد/هجين)
- time (string)
- created_at (auto)
- updated_at (auto)
```

**News Model:**
```python
- id (auto)
- category (منح/فرص/مسابقات/etc)
- date (date field)
- views (integer)
- title (string)
- description (text)
- image (URL)
- category_color (yellow/green/blue/purple)
- author_name (string)
- author_image (URL)
- created_at (auto)
- updated_at (auto)
```

**Event Model:**
```python
- id (auto)
- title (string)
- description (text)
- date (date field)
- time (time field)
- location (string)
- capacity (integer)
- attendees (integer)
- status (upcoming/ongoing/completed)
- created_at (auto)
- updated_at (auto)
```

---

## 🔧 Configuration

### Frontend Configuration

Edit `.env` file in `ssb-react/`:
```
VITE_API_URL=http://localhost:8000/api/v1
```

### Backend Configuration

Edit `.env` file in `ssb-backend/`:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 📱 Features Overview

### Public Features
- ✨ Beautiful, responsive website
- 📰 Read latest news and announcements
- 📅 View upcoming activities and events
- 🔍 Search functionality
- 📊 View statistics and trending content
- 👥 See partner organizations

### Admin Features
- 🛡️ Protected admin panel
- ➕ Create new content
- ✏️ Edit existing content
- 🗑️ Delete content
- 📊 Manage capacity and attendance
- 🔢 Track view statistics

---

## 🐛 Troubleshooting

### Backend Issues

**Port 8000 already in use:**
```bash
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Database issues:**
```bash
python manage.py flush --noinput
python manage.py migrate
```

**Import errors:**
```bash
pip install -r requirements.txt --upgrade
```

### Frontend Issues

**Port 5173 already in use:**
```bash
npm run dev -- --port 5174
```

**Dependencies broken:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 🚀 Deployment

### Backend Deployment

1. Create `.env` with production settings
2. Set `DEBUG=False`
3. Use PostgreSQL database
4. Collect static files:
   ```bash
   python manage.py collectstatic
   ```
5. Use Gunicorn/Nginx for production

### Frontend Deployment

1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy `dist/` folder to hosting service
3. Update API URL to production backend

---

## 📚 Additional Resources

### API Testing
- Use Postman or Thunder Client
- Import collection from API endpoints
- Test all CRUD operations

### Database Management
- Django Admin: http://localhost:8000/admin
- Full CRUD operations available
- User-friendly interface

### Documentation
- Backend: `/ssb-backend/README.md`
- API: Available at http://localhost:8000/api/v1/
- DRF Browsable API: http://localhost:8000/api/v1/activities/

---

## 👥 Support

For issues or questions:
1. Check troubleshooting section
2. Review documentation files
3. Check API response messages
4. Review console logs

---

## 📄 License

This project is developed for the Syrian Student Bureau.

---

## ✅ Checklist for Running

- [ ] Backend installed and migrations run
- [ ] Superuser created for admin panel
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend server running on port 5173
- [ ] Admin button visible in header
- [ ] Can access admin panel
- [ ] Can add/edit/delete content
- [ ] API responses working correctly

---

**Enjoy managing your SSB platform! 🎉**
