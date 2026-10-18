# SSB Platform - Developer Quick Reference

## 🚀 Quick Commands

### Backend Commands

**Start server:**
```bash
cd ssb-backend
venv\Scripts\activate  # Windows
python manage.py runserver
```

**Create superuser:**
```bash
python manage.py createsuperuser
```

**Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

**Django shell:**
```bash
python manage.py shell
```

**Create new app:**
```bash
python manage.py startapp app_name
```

**Collect static files:**
```bash
python manage.py collectstatic
```

---

### Frontend Commands

**Start dev server:**
```bash
cd ssb-react
npm run dev
```

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

**Lint code:**
```bash
npm run lint
```

**Fix linting issues:**
```bash
npm run lint:fix
```

**Format code:**
```bash
npm run format
```

---

## 📁 Key Files Location

### Backend
```
ssb-backend/
├── content/
│   ├── models.py          # Database models
│   ├── views.py           # API viewsets
│   ├── serializers.py     # Data serialization
│   ├── admin.py           # Admin configuration
│   └── urls.py            # URL routing
├── ssb_backend/
│   ├── settings.py        # Django settings
│   ├── urls.py            # Main URL config
│   └── wsgi.py            # WSGI config
├── manage.py              # Django management
└── requirements.txt       # Dependencies
```

### Frontend
```
ssb-react/
├── src/
│   ├── components/
│   │   ├── admin/         # Admin components
│   │   ├── home/          # Home page components
│   │   ├── layout/        # Layout components
│   │   └── shared/        # Shared components
│   ├── pages/             # Page components
│   ├── services/
│   │   └── api.ts         # API service
│   ├── App.tsx            # Main app
│   └── main.tsx           # Entry point
├── package.json           # Dependencies
├── vite.config.ts         # Vite config
└── tsconfig.json          # TypeScript config
```

---

## 🔧 Common Development Tasks

### Add New API Endpoint

1. **Update models.py:**
```python
# Add field to existing model or create new model
class MyModel(models.Model):
    title = models.CharField(max_length=255)
    # ... more fields
```

2. **Create serializer in serializers.py:**
```python
class MyModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyModel
        fields = ['id', 'title', ...]
```

3. **Create viewset in views.py:**
```python
class MyModelViewSet(viewsets.ModelViewSet):
    queryset = MyModel.objects.all()
    serializer_class = MyModelSerializer
```

4. **Register in urls.py:**
```python
router.register(r'mymodel', MyModelViewSet)
```

5. **Run migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

---

### Add New React Component

1. **Create component file:**
```typescript
// src/components/folder/ComponentName.tsx
import { type FC } from 'react';

interface ComponentProps {
  // Define props
}

const ComponentName: FC<ComponentProps> = ({ prop1, prop2 }) => {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

2. **Import in parent component:**
```typescript
import ComponentName from './ComponentName';
```

---

## 🔐 Environment Variables

### Backend (.env)
```
SECRET_KEY=your-secret-key
DEBUG=True/False
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

---

## 📊 API Usage in Frontend

```typescript
import { activitiesAPI, newsAPI, eventsAPI } from './services/api';

// Get activities
const activities = await activitiesAPI.getAll();

// Create activity
const newActivity = await activitiesAPI.create({
  date: "نوفمبر 15",
  year: "2025",
  title: "عنوان",
  // ... other fields
});

// Update activity
await activitiesAPI.update('1', { title: "عنوان جديد" });

// Delete activity
await activitiesAPI.delete('1');
```

---

## 🧪 Testing API with cURL

```bash
# GET request
curl http://localhost:8000/api/v1/activities/

# POST request
curl -X POST http://localhost:8000/api/v1/activities/ \
  -H "Content-Type: application/json" \
  -d '{"title":"test","...":"..."}'

# PUT request  
curl -X PUT http://localhost:8000/api/v1/activities/1/ \
  -H "Content-Type: application/json" \
  -d '{"title":"updated"}'

# DELETE request
curl -X DELETE http://localhost:8000/api/v1/activities/1/
```

---

## 🎨 Styling with Tailwind

```typescript
// Button example
<button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition">
  Click me
</button>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Items */}
</div>

// Flexbox centering
<div className="flex items-center justify-center min-h-screen">
  {/* Content */}
</div>
```

---

## 📱 Responsive Design

```typescript
// Mobile first approach
<div className="text-sm md:text-base lg:text-lg">
  Responsive text
</div>

// Hide/show on breakpoints
<div className="hidden md:block">
  Only visible on medium and above
</div>

<div className="block md:hidden">
  Only visible on small screens
</div>
```

---

## 🔍 Debugging Tips

### Frontend Debugging
```typescript
// Console logging
console.log('variable:', variable);
console.error('Error message:', error);

// React DevTools browser extension
// TypeScript will catch type errors

// Network tab in DevTools
// Check API requests and responses
```

### Backend Debugging
```bash
# Use Django shell
python manage.py shell

# Query data
from content.models import Activity
Activity.objects.all()

# Debug in views
import logging
logger = logging.getLogger(__name__)
logger.debug("Debug message")
```

---

## 🚨 Common Errors & Solutions

| Error | Solution |
|-------|----------|
| ModuleNotFoundError | `pip install -r requirements.txt` |
| Port in use | Change port or kill process |
| CORS error | Check CORS_ALLOWED_ORIGINS in settings.py |
| Database error | Run `python manage.py migrate` |
| TypeScript errors | Install types: `npm install @types/package` |
| npm ERR! code | Clear cache: `npm cache clean --force` |

---

## 📚 Documentation References

- Django Docs: https://docs.djangoproject.com
- DRF Docs: https://www.django-rest-framework.org
- React Docs: https://react.dev
- TypeScript: https://www.typescriptlang.org
- Tailwind: https://tailwindcss.com

---

## 🔄 Git Workflow (if using version control)

```bash
# Clone repository
git clone <repo-url>

# Create feature branch
git checkout -b feature/feature-name

# Make changes
# Run tests
# Commit changes
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/feature-name

# Create pull request
```

---

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions

### TypeScript (Frontend)
- Use const over let/var
- Define interfaces for props
- Use meaningful component names
- Add JSDoc comments

---

## 🚀 Deployment Checklist

Before deploying:
- [ ] Set DEBUG = False
- [ ] Change SECRET_KEY
- [ ] Update ALLOWED_HOSTS
- [ ] Configure database (PostgreSQL)
- [ ] Set environment variables
- [ ] Run migrations
- [ ] Collect static files
- [ ] Test API endpoints
- [ ] Run build: `npm run build`

---

## 💡 Pro Tips

1. **Hot Reload**: Both dev servers support hot reload
2. **Browser DevTools**: Essential for frontend debugging
3. **Postman**: Use for API testing
4. **DRF Browsable API**: Great for API exploration
5. **TypeScript**: Catches many errors at compile time
6. **Django Admin**: Quick way to manage data

---

## ❓ Quick Q&A

**Q: How do I add a new field to a model?**
A: Edit models.py, makemigrations, migrate

**Q: How do I create a new API endpoint?**
A: Create serializer, viewset, register in urls.py

**Q: How do I use the API in React?**
A: Import from services/api.ts and call the function

**Q: How do I change styling?**
A: Update className with Tailwind classes

**Q: How do I run both servers?**
A: Open two terminals, one for backend, one for frontend

---

**Last Updated**: February 2026
**Version**: 1.0
