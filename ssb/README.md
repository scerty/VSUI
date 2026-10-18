# 🎓 SSB (Syrian Student Bureau) Platform

> منصة متكاملة لإدارة أخبار وأنشطة وفعاليات الرابطة السورية للطلاب

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()
[![Version](https://img.shields.io/badge/Version-1.0.0-blue)]()
[![License](https://img.shields.io/badge/License-MIT-green)]()

---

## 📋 مقدمة

منصة SSB هي تطبيق ويب كامل يجمع بين:
- **موقع ويب حديث** للزوار العام
- **لوحة تحكم إدارية** متقدمة لإدارة المحتوى  
- **API RESTful قوي** للتكامل مع تطبيقات أخرى

---

## ✨ المميزات الرئيسية

### 🌐 الموقع الرئيسي
- صفحة رئيسية جميلة مع تصميم عصري
- عرض الأخبار والمستجدات
- عرض الأنشطة القادمة في خط زمني
- عرض الشركاء والمنظمات المتعاونة
- بحث وتصفية محتوى
- واجهة مستجيبة (Responsive Design)

### 🛡️ لوحة التحكم الإدارية
- إدارة الأنشطة (إضافة، تعديل، حذف)
- إدارة الأخبار مع الصور والفئات
- إدارة الفعاليات مع تتبع الحضور
- واجهة سهلة وجميلة
- دعم كامل للغة العربية (RTL)

### 🔌 API RESTful
- أكثر من 30 endpoint متقدم
- دعم Search و Filtering
- Pagination
- CORS جاهز للتكامل

---

## 🚀 البدء السريع

### المتطلبات الأساسية
- Python 3.9+
- Node.js 18+
- npm أو yarn

### التثبيت التلقائي (Windows)
```bash
# انقر مرتين على الملف
setup.bat
```

### التثبيت التلقائي (Linux/Mac)
```bash
chmod +x setup.sh
./setup.sh
```

### التثبيت اليدوي

**الخلفية (Django):**
```bash
cd ssb-backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**الواجهة الأمامية (React):**
```bash
cd ..
cd ssb-react
npm install
npm run dev
```

---

## 📍 نقاط الوصول

بعد التشغيل، يمكنك الوصول إلى:

| المكون | الرابط | الوصف |
|--------|-------|--------|
| 🌐 الموقع | http://localhost:5173 | الموقع الرئيسي |
| 🛡️ لوحة التحكم | http://localhost:5173 | انقر على "لوحة التحكم" |
| 📡 API | http://localhost:8000/api/v1 | جميع الـ Endpoints |
| 👨‍💼 Django Admin | http://localhost:8000/admin | إدارة Django |

---

## 🏗️ بنية المشروع

```
ssb/
├── ssb-react/                 # تطبيق الواجهة الأمامية (React)
│   ├── src/
│   │   ├── components/        # مكونات React
│   │   ├── pages/             # الصفحات
│   │   ├── services/          # خدمات API
│   │   └── App.tsx            # المكون الرئيسي
│   └── package.json
│
├── ssb-backend/               # تطبيق الخلفية (Django)
│   ├── content/               # تطبيق Django الرئيسي
│   ├── ssb_backend/           # إعدادات المشروع
│   ├── manage.py              # أداة إدارة Django
│   └── requirements.txt       # المكتبات المطلوبة
│
└── التوثيق والأدلة
    ├── SETUP_GUIDE.md         # دليل التثبيت الكامل
    ├── PROJECT_SUMMARY.md     # ملخص المشروع
    ├── API_DOCUMENTATION.md   # توثيق API
    └── DEVELOPER_QUICK_REFERENCE.md # دليل المطور
```

---

## 📊 الميزات التفصيلية

### إدارة الأنشطة
- ✅ إنشاء نشاط جديد
- ✅ تحديث معلومات النشاط
- ✅ حذف النشاط
- ✅ تحديد نوع النشاط (حضوري/عن بعد/هجين)
- ✅ إضافة وقت ومكان النشاط

### إدارة الأخبار
- ✅ إنشاء خبر جديد مع صورة
- ✅ تحديد فئة الخبر
- ✅ تتبع عدد المشاهدات
- ✅ تحديث الخبر
- ✅ حذف الخبر
- ✅ عرض الأخبار الأخيرة والشهيرة

### إدارة الفعاليات
- ✅ إنشاء فعالية جديدة
- ✅ تحديد السعة والتاريخ والوقت
- ✅ تتبع عدد الحضور
- ✅ تحديث حالة الفعالية
- ✅ حذف الفعالية

---

## 🔌 API Endpoints

### الأنشطة (Activities)
```
GET    /api/v1/activities/              # الحصول على جميع الأنشطة
POST   /api/v1/activities/              # إنشاء نشاط جديد
GET    /api/v1/activities/:id/          # الحصول على نشاط
PUT    /api/v1/activities/:id/          # تحديث نشاط
DELETE /api/v1/activities/:id/          # حذف نشاط
GET    /api/v1/activities/upcoming/     # الأنشطة القادمة
```

### الأخبار (News)
```
GET    /api/v1/news/                    # جميع الأخبار
POST   /api/v1/news/                    # خبر جديد
GET    /api/v1/news/:id/                # تفاصيل خبر
PUT    /api/v1/news/:id/                # تحديث خبر
DELETE /api/v1/news/:id/                # حذف خبر
GET    /api/v1/news/latest/             # أحدث الأخبار
GET    /api/v1/news/trending/           # الأخبار الشهيرة
GET    /api/v1/news/by_category/        # أخبار حسب الفئة
POST   /api/v1/news/:id/increment_views/ # تتبع المشاهدات
```

### الفعاليات (Events)
```
GET    /api/v1/events/                  # جميع الفعاليات
POST   /api/v1/events/                  # فعالية جديدة
GET    /api/v1/events/:id/              # تفاصيل فعالية
PUT    /api/v1/events/:id/              # تحديث فعالية
DELETE /api/v1/events/:id/              # حذف فعالية
GET    /api/v1/events/upcoming_events/  # الفعاليات القادمة
GET    /api/v1/events/ongoing_events/   # الفعاليات الجارية
POST   /api/v1/events/:id/register_attendee/ # تسجيل الحضور
```

---

## 💻 التكنولوجيا المستخدمة

### الواجهة الأمامية
- **React 19.1** - مكتبة الواجهات
- **TypeScript** - للأمان والموثوقية
- **Vite** - أداة البناء السريعة
- **Tailwind CSS** - لتنسيق الألوان والتصاميم
- **React Big Calendar** - تقويم الأحداث

### الخلفية
- **Django 4.2** - إطار العمل
- **Django REST Framework** - لبناء API
- **SQLite** - قاعدة البيانات (التطوير)
- **PostgreSQL** - قاعدة البيانات (الإنتاج)

---

## 📚 التوثيق

يوجد توثيق شامل للمشروع:

1. **SETUP_GUIDE.md** - دليل التثبيت والتشغيل الكامل
2. **API_DOCUMENTATION.md** - توثيق كل endpoints
3. **PROJECT_SUMMARY.md** - ملخص شامل للمشروع
4. **DEVELOPER_QUICK_REFERENCE.md** - دليل سريع للمطورين
5. **ssb-backend/README.md** - توثيق Django بالتفصيل

---

## 🐛 استكشاف الأخطاء

### الخادم يقول "Port already in use"
```bash
# Windows
netstat -ano | findstr :8000

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### خطأ في قاعدة البيانات
```bash
python manage.py migrate
```

### مكتبات مفقودة
```bash
pip install -r requirements.txt
```

راجع SETUP_GUIDE.md لحلول أكثر

---

## 🚀 النشر (Deployment)

### للنشر على الإنتاج:

1. **الخلفية:**
   - استخدم PostgreSQL بدلاً من SQLite
   - اضبط SECRET_KEY والإعدادات الأمان
   - استخدم Gunicorn و Nginx

2. **الواجهة الأمامية:**
   - قم ببناء المشروع: `npm run build`
   - دمج مع CDN أو خادم ويب
   - تحديث رابط API

انظر دليل التثبيت للمزيد من التفاصيل.

---

## 🤝 المساهمة

إذا كنت تريد المساهمة:

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📄 الترخيص

هذا المشروع مرخص تحت MIT License.

---

## 👥 الدعم

للأسئلة والدعم:
- 📖 اقرأ التوثيق في المجلد
- 🔍 افحص API Documentation
- 💬 تحقق من الأخطاء والرسائل

---

## 🎯 ما بعد التثبيت

بعد تشغيل المشروع بنجاح:

1. ✅ انتقل إلى http://localhost:5173
2. ✅ انقر على "لوحة التحكم" للدخول للإدارة
3. ✅ جرب إنشاء نشاط أو خبر جديد
4. ✅ اختبر جميع العمليات (إضافة، تعديل، حذف)
5. ✅ تحقق من API في DevTools

---

## 📊 إحصائيات المشروع

- 🔧 **10+ مكونات React**
- 📱 **قوائم إدارة كاملة**
- 🔌 **30+ API endpoint**
- 📚 **أكثر من 1000 سطر توثيق**
- 🎨 **تصميم عصري واحترافي**

---

## ✨ شكراً لاستخدام SSB Platform!

هذا المشروع مصمم بعناية فائقة لتقديم أفضل تجربة ممكنة.

**نسعد باستخدامك وملاحظاتك!** 🎉

---

**آخر تحديث**: فبراير 2026
**الإصدار**: 1.0.0
**الحالة**: ✅ جاهز للاستخدام
