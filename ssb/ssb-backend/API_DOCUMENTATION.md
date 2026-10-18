# SSB API Documentation

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Currently, the API is open without authentication. For production, add token-based authentication.

## Response Format
All responses are in JSON format.

### Success Response
```json
{
  "id": 1,
  "field": "value"
}
```

### Error Response
```json
{
  "error": "Error message"
}
```

---

## Resources

### 1. Activities (الأنشطة)

#### Get All Activities
```
GET /activities/
```

**Query Parameters:**
- `search`: Search by title or description
- `ordering`: Order by field (use `-` for descending)
- `page`: Page number for pagination

**Example:**
```
GET /activities/?search=workshop&ordering=-created_at
```

**Response:**
```json
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
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
  ]
}
```

#### Get Upcoming Activities
```
GET /activities/upcoming/
```

**Response:**
```json
[
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
]
```

#### Get Single Activity
```
GET /activities/:id/
```

#### Create Activity
```
POST /activities/
Content-Type: application/json

{
  "date": "نوفمبر 15",
  "year": "2025",
  "title": "لقاء الطلاب المستجدين",
  "description": "جلسة تعريفية للطلاب الجدد",
  "activity_type": "حضوري",
  "time": "6:00 مساءً"
}
```

**Response:** (201 Created)
```json
{
  "id": 2,
  "date": "نوفمبر 15",
  "year": "2025",
  "title": "لقاء الطلاب المستجدين",
  "description": "جلسة تعريفية للطلاب الجدد",
  "activity_type": "حضوري",
  "time": "6:00 مساءً",
  "created_at": "2024-01-16T10:30:00Z",
  "updated_at": "2024-01-16T10:30:00Z"
}
```

#### Update Activity
```
PUT /activities/:id/
Content-Type: application/json

{
  "title": "لقاء الطلاب - تحديث",
  "description": "وصف محدث"
}
```

#### Delete Activity
```
DELETE /activities/:id/
```

**Response:** (204 No Content)

---

### 2. News (الأخبار)

#### Get All News
```
GET /news/
```

**Query Parameters:**
- `search`: Search by title, description, or category
- `ordering`: Order by field (use `-` for descending)
- `page`: Page number

**Example:**
```
GET /news/?search=منحة&ordering=-date
```

#### Get Latest News
```
GET /news/latest/
```

Gets the 5 most recent news articles.

#### Get Trending News
```
GET /news/trending/
```

Gets the 5 most viewed news articles.

#### Get News by Category
```
GET /news/by_category/?category=منح دراسية
```

**Categories:**
- منح دراسية
- فرص تدريب
- مسابقات
- نشاطات طلابية
- أخرى

#### Get Single News
```
GET /news/:id/
```

#### Create News
```
POST /news/
Content-Type: application/json

{
  "category": "منح دراسية",
  "date": "2025-01-15",
  "title": "منحة ممولة بالكامل",
  "description": "فرصة مميزة للطلاب السوريين",
  "image": "https://example.com/image.jpg",
  "category_color": "yellow",
  "author_name": "فريق SSB",
  "author_image": "https://example.com/author.jpg"
}
```

**Category Colors:**
- yellow
- green
- blue
- purple

#### Update News
```
PUT /news/:id/
Content-Type: application/json

{
  "title": "منحة محدثة",
  "views": 1500
}
```

#### Delete News
```
DELETE /news/:id/
```

#### Increment Views
```
POST /news/:id/increment_views/
```

**Response:**
```json
{
  "id": 1,
  "views": 1201,
  "...": "..."
}
```

---

### 3. Events (الفعاليات)

#### Get All Events
```
GET /events/
```

#### Get Upcoming Events
```
GET /events/upcoming_events/
```

Gets all events with status "upcoming".

#### Get Ongoing Events
```
GET /events/ongoing_events/
```

Gets all events with status "ongoing".

#### Get Single Event
```
GET /events/:id/
```

#### Create Event
```
POST /events/
Content-Type: application/json

{
  "title": "ملتقى الخريجين",
  "description": "فرصة للتواصل مع الخريجين",
  "date": "2025-01-25",
  "time": "16:00:00",
  "location": "القاعة الرئيسية",
  "capacity": 200,
  "attendees": 0,
  "status": "upcoming"
}
```

**Status Values:**
- upcoming (قادم)
- ongoing (جاري الآن)
- completed (مكتمل)

#### Update Event
```
PUT /events/:id/
Content-Type: application/json

{
  "title": "ملتقى الخريجين - تحديث",
  "attendees": 50
}
```

#### Delete Event
```
DELETE /events/:id/
```

#### Register Attendee
```
POST /events/:id/register_attendee/
```

**Response:**
```json
{
  "message": "تم تسجيلك بنجاح",
  "current_attendees": 46,
  "capacity": 200
}
```

**Error Response (when full):**
```json
{
  "error": "العرض قد امتلأ"
}
```

---

## Error Handling

### Common HTTP Status Codes

- `200 OK` - Successful GET request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Invalid request format or parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Error Examples

**Not Found:**
```json
{
  "detail": "Not found."
}
```

**Invalid Data:**
```json
{
  "field_name": ["Required field"]
}
```

---

## Pagination

Responses are paginated with 10 items per page by default.

```json
{
  "count": 50,
  "next": "http://localhost:8000/api/v1/activities/?page=2",
  "previous": null,
  "results": [...]
}
```

**Access specific page:**
```
GET /activities/?page=2
```

---

## Filtering & Searching

### Search
```
GET /activities/?search=workshop
GET /news/?search=منحة
GET /events/?search=meeting
```

### Ordering
```
GET /activities/?ordering=created_at        # Ascending
GET /activities/?ordering=-created_at       # Descending
GET /news/?ordering=-date
GET /events/?ordering=-attendees
```

---

## Example cURL Requests

### Get all activities
```bash
curl http://localhost:8000/api/v1/activities/
```

### Create new activity
```bash
curl -X POST http://localhost:8000/api/v1/activities/ \
  -H "Content-Type: application/json" \
  -d '{
    "date": "نوفمبر 15",
    "year": "2025",
    "title": "ورشة عمل",
    "description": "ورشة عمل مفيدة",
    "activity_type": "حضوري",
    "time": "6:00 مساءً"
  }'
```

### Update activity
```bash
curl -X PUT http://localhost:8000/api/v1/activities/1/ \
  -H "Content-Type: application/json" \
  -d '{"title": "ورشة عمل محدثة"}'
```

### Delete activity
```bash
curl -X DELETE http://localhost:8000/api/v1/activities/1/
```

---

## Testing with Postman

1. Open Postman
2. Import the following base URL: `http://localhost:8000/api/v1`
3. Create requests for each endpoint
4. Use the examples above

---

## Rate Limiting
No rate limiting is currently implemented. For production, consider adding rate limiting.

---

## CORS
The API supports CORS requests from:
- http://localhost:5173 (React dev server)
- http://localhost:3000
- http://127.0.0.1:5173

---

For more information, visit the DRF documentation: https://www.django-rest-framework.org/
