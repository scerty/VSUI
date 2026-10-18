# Django SSB Backend - Setup Guide

## Overview
This is a Django REST API backend for the Syrian Student Bureau (SSB) website. It manages activities, news articles, and events data.

## Features
- **Activities Management**: Create, read, update, delete activities/events timeline
- **News Management**: Manage news articles with categories, views tracking, and author information
- **Events Management**: Handle events with capacity management and attendance tracking
- **REST API**: Full RESTful API with search, filtering, and ordering capabilities
- **CORS Support**: Configured for React frontend
- **Django Admin**: Full admin interface for managing content

## Technology Stack
- Django 4.2.7
- Django REST Framework 3.14.0
- Django CORS Headers 4.3.1
- Python 3.9+
- SQLite (development) / PostgreSQL (production recommended)

## Installation

### 1. Prerequisites
- Python 3.9 or higher
- pip (Python package manager)
- Virtual environment (recommended)

### 2. Clone and Setup

```bash
cd ssb-backend
```

### 3. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Linux/Mac:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Environment Configuration

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Edit `.env` file with your settings:
```
SECRET_KEY=your-production-secret-key
DEBUG=False
ALLOWED_HOSTS=your-domain.com,www.your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 6. Database Setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 7. Create Superuser

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

### 8. Run Development Server

```bash
python manage.py runserver
```

The API will be available at: `http://localhost:8000`
Admin panel: `http://localhost:8000/admin`

## API Endpoints

### Activities
- `GET /api/v1/activities/` - List all activities
- `POST /api/v1/activities/` - Create new activity
- `GET /api/v1/activities/{id}/` - Get activity details
- `PUT /api/v1/activities/{id}/` - Update activity
- `DELETE /api/v1/activities/{id}/` - Delete activity
- `GET /api/v1/activities/upcoming/` - Get upcoming activities

**Activity Fields:**
```json
{
  "id": 1,
  "date": "نوفمبر 15",
  "year": "2025",
  "title": "لقاء الطلاب المستجدين",
  "description": "جلسة تعريفية للطلاب الجدد",
  "activity_type": "حضوري",
  "time": "6:00 مساءً",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### News
- `GET /api/v1/news/` - List all news
- `POST /api/v1/news/` - Create news article
- `GET /api/v1/news/{id}/` - Get news details
- `PUT /api/v1/news/{id}/` - Update news
- `DELETE /api/v1/news/{id}/` - Delete news
- `GET /api/v1/news/latest/` - Get latest news
- `GET /api/v1/news/trending/` - Get trending news
- `GET /api/v1/news/by_category/?category=منح دراسية` - Filter by category
- `POST /api/v1/news/{id}/increment_views/` - Increment view count

**News Fields:**
```json
{
  "id": 1,
  "category": "منح دراسية",
  "date": "2025-01-15",
  "views": 1200,
  "title": "منحة ممولة بالكامل",
  "description": "فرصة مميزة للطلاب السوريين",
  "image": "https://example.com/image.jpg",
  "category_color": "yellow",
  "author_name": "فريق SSB",
  "author_image": "https://example.com/author.jpg",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### Events
- `GET /api/v1/events/` - List all events
- `POST /api/v1/events/` - Create new event
- `GET /api/v1/events/{id}/` - Get event details
- `PUT /api/v1/events/{id}/` - Update event
- `DELETE /api/v1/events/{id}/` - Delete event
- `GET /api/v1/events/upcoming_events/` - Get upcoming events
- `GET /api/v1/events/ongoing_events/` - Get ongoing events
- `POST /api/v1/events/{id}/register_attendee/` - Register attendee

**Event Fields:**
```json
{
  "id": 1,
  "title": "ملتقى الخريجين السنوي",
  "description": "فرصة للتواصل مع خريجين ناجحين",
  "date": "2025-01-25",
  "time": "16:00:00",
  "location": "القاعة الرئيسية",
  "capacity": 200,
  "attendees": 45,
  "status": "upcoming",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

## Search and Filtering

### Search
```
GET /api/v1/activities/?search=workshop
GET /api/v1/news/?search=منحة
GET /api/v1/events/?search=meeting
```

### Ordering
```
GET /api/v1/activities/?ordering=-created_at
GET /api/v1/news/?ordering=-date
GET /api/v1/events/?ordering=-date
```

## Pagination
By default, the API returns 10 items per page:
```
GET /api/v1/activities/?page=2
```

## Admin Panel
Access Django admin at `/admin` with your superuser credentials. Here you can manage all content without using the API.

## Production Deployment

### Steps:
1. Update `.env` with production settings
2. Set `DEBUG=False`
3. Use a production-grade database (PostgreSQL recommended)
4. Collect static files: `python manage.py collectstatic`
5. Use a production WSGI server like Gunicorn

### Gunicorn Setup:
```bash
pip install gunicorn
gunicorn ssb_backend.wsgi:application --bind 0.0.0.0:8000
```

## Common Issues

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :8000   # Windows
```

### Missing Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Database Reset
```bash
python manage.py flush
python manage.py migrate
```

## Contributing
When adding new features:
1. Create models in `content/models.py`
2. Create serializers in `content/serializers.py`
3. Create viewsets in `content/views.py`
4. Register routes in `content/urls.py`

## Support
For issues or questions, please check the project documentation or contact the development team.
