# 📗 وثائق API - API Documentation

## نظرة عامة - Overview

هذه الوثيقة تشرح جميع نقاط النهاية (Endpoints) المتاحة في نظام إدارة دار أبي الفداء للعلوم الشرعية.

**Base URL:** `http://localhost:5000/api`

**التنسيق:** JSON

**المصادقة:** JWT (JSON Web Token)

---

## 🔐 المصادقة - Authentication

### 1. تسجيل الدخول - Login

**Endpoint:** `POST /api/auth/login`

**الوصف:** تسجيل دخول المستخدم والحصول على JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "user_id": 1,
      "username": "admin",
      "role": "admin",
      "email": "admin@dar-abi-alfadaa.sy"
    }
  }
}
```

**Response (Error):**
```json
{
  "error": "اسم المستخدم أو كلمة المرور غير صحيحة",
  "message": "Invalid credentials"
}
```

---

### 2. تسجيل مستخدم جديد - Register

**Endpoint:** `POST /api/auth/register`

**الوصف:** إنشاء حساب مستخدم جديد (مدير النظام فقط)

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "username": "teacher1",
  "password": "password123",
  "role": "teacher",
  "email": "teacher1@example.com"
}
```

**الأدوار المتاحة:** `admin`, `academic`, `accounting`, `teacher`, `student`, `archivist`

**Response (Success):**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "data": {
    "user": {
      "user_id": 5,
      "username": "teacher1",
      "role": "teacher",
      "email": "teacher1@example.com"
    }
  }
}
```

---

### 3. تغيير كلمة المرور - Change Password

**Endpoint:** `POST /api/auth/change-password`

**Request Body:**
```json
{
  "username": "admin",
  "oldPassword": "oldpass123",
  "newPassword": "newpass456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

---

### 4. تسجيل الخروج - Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## 👥 الطلاب - Students

### 1. قائمة الطلاب - List Students

**Endpoint:** `GET /api/students`

**Query Parameters:**
- `page` (optional): رقم الصفحة (افتراضي: 1)
- `limit` (optional): عدد النتائج في الصفحة (افتراضي: 30)
- `status` (optional): حالة الطالب (نشط، متخرج، منسحب)
- `level` (optional): المستوى الدراسي
- `search` (optional): البحث في الاسم أو رقم التسجيل

**Example:**
```
GET /api/students?page=1&limit=20&status=نشط&level=المستوى الأول
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": 1,
      "registration_number": "25_10_L1_m_1",
      "name_ar": "محمد أحمد الخطيب",
      "id_number": "123456789",
      "status": "نشط",
      "level": "المستوى الأول",
      "phone": "+963-XXX-XXXXXX",
      "email": "student@example.com"
    }
  ],
  "pagination": {
    "total": 248,
    "page": 1,
    "limit": 20,
    "totalPages": 13
  }
}
```

---

### 2. تفاصيل طالب - Get Student

**Endpoint:** `GET /api/students/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "student_id": 1,
    "registration_number": "25_10_L1_m_1",
    "name_ar": "محمد أحمد الخطيب",
    "id_number": "123456789",
    "birthdate": "2000-05-15",
    "gender": "ذكر",
    "address": "حماة، سوريا",
    "phone": "+963-XXX-XXXXXX",
    "email": "student@example.com",
    "guardian_name": "أحمد الخطيب",
    "guardian_phone": "+963-XXX-XXXXXX",
    "status": "نشط",
    "level": "المستوى الأول",
    "enrollment_date": "2024-09-01"
  }
}
```

---

### 3. إضافة طالب - Create Student

**Endpoint:** `POST /api/students`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "registration_number": "25_10_L1_m_1",
  "name_ar": "محمد أحمد الخطيب",
  "id_number": "123456789",
  "birthdate": "2000-05-15",
  "gender": "ذكر",
  "address": "حماة، سوريا",
  "phone": "+963-XXX-XXXXXX",
  "email": "student@example.com",
  "guardian_name": "أحمد الخطيب",
  "guardian_phone": "+963-XXX-XXXXXX",
  "level": "المستوى الأول"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إضافة الطالب بنجاح",
  "data": {
    "student_id": 249
  }
}
```

---

### 4. تحديث بيانات طالب - Update Student

**Endpoint:** `PUT /api/students/:id`

**Request Body:** (نفس إضافة طالب)

---

### 5. حذف طالب - Delete Student

**Endpoint:** `DELETE /api/students/:id`

**Response:**
```json
{
  "success": true,
  "message": "تم حذف الطالب بنجاح"
}
```

---

## 👨‍🏫 المدرسين - Teachers

مشابه لـ API الطلاب مع الاختلافات في البيانات.

**Endpoints:**
- `GET /api/teachers` - قائمة المدرسين
- `GET /api/teachers/:id` - تفاصيل مدرس
- `POST /api/teachers` - إضافة مدرس
- `PUT /api/teachers/:id` - تحديث مدرس
- `DELETE /api/teachers/:id` - حذف مدرس

---

## 📚 المقررات - Courses

**Endpoints:**
- `GET /api/courses` - قائمة المقررات
- `GET /api/courses/:id` - تفاصيل مقرر
- `POST /api/courses` - إضافة مقرر
- `PUT /api/courses/:id` - تحديث مقرر
- `DELETE /api/courses/:id` - حذف مقرر

---

## 📊 الحضور - Attendance

### 1. تسجيل حضور طالب

**Endpoint:** `POST /api/attendance/students`

**Request Body:**
```json
{
  "student_id": 1,
  "course_id": 3,
  "date": "2025-01-15",
  "time_in": "08:00:00",
  "status": "حاضر",
  "fingerprint_verified": true
}
```

---

### 2. تسجيل حضور مدرس

**Endpoint:** `POST /api/attendance/teachers`

**Request Body:**
```json
{
  "teacher_id": 5,
  "course_id": 3,
  "date": "2025-01-15",
  "time_in": "08:00:00",
  "session_number": 1,
  "fingerprint_verified": true
}
```

---

### 3. تقرير حضور

**Endpoint:** `GET /api/attendance/report`

**Query Parameters:**
- `student_id` or `teacher_id`
- `course_id` (optional)
- `start_date`
- `end_date`

**Example:**
```
GET /api/attendance/report?student_id=1&start_date=2025-01-01&end_date=2025-01-31
```

---

## 🎓 العلامات - Grades

### 1. إدخال علامات

**Endpoint:** `POST /api/grades`

**Request Body:**
```json
{
  "student_id": 1,
  "course_id": 3,
  "practical_mark": 25,
  "theoretical_mark": 65,
  "participation_mark": 8,
  "exam_date": "2025-01-20"
}
```

**Note:** العلامات الكلية والنسبة تُحسب تلقائياً

---

### 2. كشف علامات طالب

**Endpoint:** `GET /api/grades/student/:student_id`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "course_name": "علوم الحديث",
      "practical_mark": 25,
      "theoretical_mark": 65,
      "participation_mark": 8,
      "total_mark": 98,
      "percentage": 98,
      "grade_letter": "ممتاز",
      "status": "ناجح"
    }
  ]
}
```

---

## 💰 النظام المالي - Finance

### 1. إضافة معاملة مالية

**Endpoint:** `POST /api/finance/transactions`

**Request Body:**
```json
{
  "student_id": 1,
  "type": "دفعة",
  "amount": 500000,
  "payment_method": "نقدي",
  "description": "دفعة الفصل الأول"
}
```

---

### 2. حساب راتب مدرس

**Endpoint:** `POST /api/finance/teacher-salary`

**Request Body:**
```json
{
  "teacher_id": 5,
  "month": 1,
  "year": 2025
}
```

**Note:** عدد الجلسات والتعويضات تُحسب تلقائياً من جدول الحضور

---

## 📁 الأرشفة - Archive

### 1. رفع وثيقة

**Endpoint:** `POST /api/archive/upload`

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file`: الملف
- `title`: عنوان الوثيقة
- `description`: الوصف
- `category`: التصنيف
- `tags`: الوسوم (array)
- `linked_person_id`: (optional)
- `linked_person_type`: (optional)

---

### 2. البحث في الوثائق

**Endpoint:** `GET /api/archive/search`

**Query Parameters:**
- `q`: نص البحث
- `category`: التصنيف
- `tags`: الوسوم
- `start_date`, `end_date`: الفترة الزمنية

---

## 📈 التقارير - Reports

### 1. تقرير شامل للطالب

**Endpoint:** `GET /api/reports/student/:id`

يشمل: البيانات الشخصية، العلامات، الحضور، المدفوعات

---

### 2. تقرير مالي شهري

**Endpoint:** `GET /api/reports/financial/:year/:month`

---

### 3. تصدير تقرير PDF

**Endpoint:** `GET /api/reports/export/pdf/:type/:id`

---

### 4. تصدير تقرير Excel

**Endpoint:** `GET /api/reports/export/excel/:type/:id`

---

## ⚠️ رموز الأخطاء - Error Codes

| Code | الوصف |
|------|--------|
| 200 | نجحت العملية |
| 201 | تم الإنشاء بنجاح |
| 400 | خطأ في البيانات المدخلة |
| 401 | غير مصرح - الرجاء تسجيل الدخول |
| 403 | ليس لديك صلاحية |
| 404 | غير موجود |
| 500 | خطأ في الخادم |

---

## 🔑 المصادقة في الطلبات

جميع الطلبات (ماعدا /api/auth/login) تتطلب JWT token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📝 ملاحظات

- جميع التواريخ بتنسيق `YYYY-MM-DD`
- جميع الأوقات بتنسيق `HH:MM:SS`
- الاستجابات دائماً بتنسيق JSON
- الترميز UTF-8 لدعم العربية

---

<div align="center">

**للمزيد من المعلومات، راجع التوثيق الكامل**

© 2025 دار أبي الفداء للعلوم الشرعية

</div>
