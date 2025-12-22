-- نظام إدارة دار أبي الفداء للعلوم الشرعية
-- Database Schema for Dar Abi Al-Fadaa Islamic Sciences Institute Management System

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For full-text search

-- 1. جدول المستخدمين - Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'academic', 'accounting', 'teacher', 'student', 'archivist')),
    email VARCHAR(100) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول الطلاب - Students Table
CREATE TABLE students (
    student_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL, -- مثل: 25_10_L1_m_1
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    id_number VARCHAR(50) UNIQUE NOT NULL,
    birthdate DATE NOT NULL,
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('ذكر', 'أنثى')),
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(100),
    photo_url VARCHAR(255),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_relationship VARCHAR(50),
    status VARCHAR(20) DEFAULT 'نشط' CHECK (status IN ('نشط', 'متخرج', 'منسحب', 'مفصول')),
    enrollment_date DATE DEFAULT CURRENT_DATE,
    level VARCHAR(50) NOT NULL, -- المستوى الأول، الثاني، إلخ
    department VARCHAR(100) DEFAULT 'العلوم الشرعية',
    session VARCHAR(50), -- الدورة/الفصل
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول المدرسين - Teachers Table
CREATE TABLE teachers (
    teacher_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    name_ar VARCHAR(100) NOT NULL,
    name_en VARCHAR(100),
    id_number VARCHAR(50) UNIQUE NOT NULL,
    photo_url VARCHAR(255),
    specialty VARCHAR(100) NOT NULL, -- التخصص العلمي
    qualifications TEXT, -- المؤهلات العلمية
    experience_years INTEGER,
    phone VARCHAR(20),
    email VARCHAR(100),
    address TEXT,
    hire_date DATE DEFAULT CURRENT_DATE,
    contract_type VARCHAR(50), -- دوام كامل، جزئي، إلخ
    contract_start DATE,
    contract_end DATE,
    base_salary DECIMAL(10, 2) DEFAULT 0, -- الراتب الأساسي الشهري
    session_rate DECIMAL(10, 2) DEFAULT 0, -- مبلغ تعويض الجلسة (50,000 - 200,000)
    status VARCHAR(20) DEFAULT 'نشط' CHECK (status IN ('نشط', 'متقاعد', 'مستقيل')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول الكتب - Books Table
CREATE TABLE books (
    book_id SERIAL PRIMARY KEY,
    title_ar VARCHAR(200) NOT NULL,
    title_en VARCHAR(200),
    author_ar VARCHAR(100),
    author_en VARCHAR(100),
    publisher VARCHAR(100),
    publish_year INTEGER,
    isbn VARCHAR(20) UNIQUE,
    category VARCHAR(50), -- تفسير، حديث، فقه، سيرة، إلخ
    cover_image_url VARCHAR(255),
    description TEXT,
    pages INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول المقررات - Courses Table
CREATE TABLE courses (
    course_id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL, -- مثل: 25_c1
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    book_id INTEGER REFERENCES books(book_id) ON DELETE SET NULL,
    level VARCHAR(50) NOT NULL,
    credit_hours INTEGER DEFAULT 3,
    practical_hours INTEGER DEFAULT 0,
    theoretical_hours INTEGER DEFAULT 0,
    teacher_id INTEGER REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    description TEXT,
    syllabus TEXT,
    prerequisites TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. جدول تسجيل الطلاب في المقررات - Student Courses Enrollment
CREATE TABLE student_courses (
    enrollment_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'مسجل' CHECK (status IN ('مسجل', 'منسحب', 'مكتمل')),
    UNIQUE(student_id, course_id)
);

-- 7. جدول حضور الطلاب - Student Attendance Table
CREATE TABLE attendance_students (
    attendance_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_in TIME,
    time_out TIME,
    status VARCHAR(20) DEFAULT 'حاضر' CHECK (status IN ('حاضر', 'غائب', 'غائب بعذر', 'متأخر')),
    fingerprint_verified BOOLEAN DEFAULT false,
    session_number INTEGER,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. جدول حضور المدرسين - Teacher Attendance Table
CREATE TABLE attendance_teachers (
    attendance_id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    course_id INTEGER REFERENCES courses(course_id) ON DELETE SET NULL,
    date DATE NOT NULL,
    time_in TIME,
    time_out TIME,
    session_number INTEGER DEFAULT 1,
    fingerprint_verified BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. جدول البصمات - Fingerprints Table
CREATE TABLE fingerprints (
    fingerprint_id SERIAL PRIMARY KEY,
    person_id INTEGER NOT NULL,
    person_type VARCHAR(20) NOT NULL CHECK (person_type IN ('student', 'teacher')),
    fingerprint_data TEXT, -- بيانات البصمة (معرف أو hash)
    finger_name VARCHAR(50), -- اليد اليمنى إبهام، إلخ
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

-- 10. جدول العلامات - Grades Table
CREATE TABLE grades (
    grade_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    practical_mark DECIMAL(5, 2) DEFAULT 0, -- العملي
    theoretical_mark DECIMAL(5, 2) DEFAULT 0, -- النظري
    participation_mark DECIMAL(5, 2) DEFAULT 0, -- المشاركة/الحفظ
    total_mark DECIMAL(5, 2) GENERATED ALWAYS AS (practical_mark + theoretical_mark + participation_mark) STORED,
    percentage DECIMAL(5, 2) GENERATED ALWAYS AS ((practical_mark + theoretical_mark + participation_mark) * 100.0 / 
        NULLIF(
            (SELECT COALESCE(practical_hours, 0) + COALESCE(theoretical_hours, 0) FROM courses WHERE course_id = grades.course_id),
            0
        )) STORED,
    grade_letter VARCHAR(10), -- ممتاز، جيد جداً، جيد، مقبول، راسب
    status VARCHAR(20) DEFAULT 'راسب' CHECK (status IN ('ناجح', 'راسب')),
    attempt_number INTEGER DEFAULT 1, -- المحاولة (أولى، إعادة، إعادة ثانية)
    exam_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. جدول المعاملات المالية - Financial Transactions Table
CREATE TABLE financial_transactions (
    transaction_id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(student_id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('رسوم دراسية', 'دفعة', 'قسط', 'خصم', 'غرامة')),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50), -- نقدي، بنكي، إلخ
    date DATE DEFAULT CURRENT_DATE,
    receipt_number VARCHAR(50) UNIQUE,
    description TEXT,
    created_by INTEGER REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. جدول رواتب المدرسين - Teacher Salaries Table
CREATE TABLE teacher_salaries (
    salary_id SERIAL PRIMARY KEY,
    teacher_id INTEGER NOT NULL REFERENCES teachers(teacher_id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    base_salary DECIMAL(10, 2) DEFAULT 0,
    session_count INTEGER DEFAULT 0, -- عدد الجلسات من جدول attendance_teachers
    session_total DECIMAL(10, 2) DEFAULT 0, -- session_count × session_rate
    bonuses DECIMAL(10, 2) DEFAULT 0, -- الحوافز والمكافآت
    deductions DECIMAL(10, 2) DEFAULT 0, -- الخصومات
    net_salary DECIMAL(10, 2) GENERATED ALWAYS AS (base_salary + session_total + bonuses - deductions) STORED,
    paid_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(teacher_id, month, year)
);

-- 13. جدول الوثائق - Documents Table
CREATE TABLE documents (
    document_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50), -- PDF, Word, Excel, JPG, PNG
    file_size BIGINT, -- بالبايت
    category VARCHAR(100), -- طلاب، مدرسين، أكاديمي، مالية، إداري
    subcategory VARCHAR(100), -- 2025/المستوى الأول/ذكور، إلخ
    tags TEXT[], -- وسوم للبحث
    linked_person_id INTEGER, -- ربط بطالب أو مدرس
    linked_person_type VARCHAR(20) CHECK (linked_person_type IN ('student', 'teacher', NULL)),
    linked_course_id INTEGER REFERENCES courses(course_id) ON DELETE SET NULL,
    uploaded_by INTEGER REFERENCES users(user_id),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    extracted_text TEXT, -- النص المستخرج من OCR
    ocr_processed BOOLEAN DEFAULT false,
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. جدول الشهادات - Certificates Table
CREATE TABLE certificates (
    certificate_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- إتمام مستوى، تخرج، حضور دورة، تفوق
    reference_number UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    course_id INTEGER REFERENCES courses(course_id),
    level VARCHAR(50),
    gpa DECIMAL(4, 2),
    qr_code_url VARCHAR(255),
    template VARCHAR(50) DEFAULT 'default',
    status VARCHAR(20) DEFAULT 'صالحة' CHECK (status IN ('صالحة', 'ملغاة')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. جدول الجداول الدراسية - Schedules Table
CREATE TABLE schedules (
    schedule_id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(course_id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES teachers(teacher_id) ON DELETE SET NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=الأحد، 6=السبت
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(50),
    semester VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 16. جدول التقويم الأكاديمي - Academic Calendar Table
CREATE TABLE academic_calendar (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    end_date DATE,
    event_type VARCHAR(50), -- امتحان، عطلة، اجتماع، ندوة
    is_holiday BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 17. جدول الإشعارات - Notifications Table
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- تنبيه، معلومة، تحذير
    is_read BOOLEAN DEFAULT false,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 18. جدول سجلات الأنشطة - Audit Logs Table
CREATE TABLE audit_logs (
    log_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id),
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT
    table_name VARCHAR(50),
    record_id INTEGER,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 19. جدول إعدادات النظام - System Settings Table
CREATE TABLE system_settings (
    setting_id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 20. جدول النسخ الاحتياطية - Backups Table
CREATE TABLE backups (
    backup_id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    size BIGINT, -- بالبايت
    type VARCHAR(50) DEFAULT 'full', -- full, database, files
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('completed', 'failed', 'in_progress')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_students_registration ON students(registration_number);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_level ON students(level);
CREATE INDEX idx_teachers_employee ON teachers(employee_number);
CREATE INDEX idx_teachers_status ON teachers(status);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_attendance_students_date ON attendance_students(date);
CREATE INDEX idx_attendance_students_student ON attendance_students(student_id);
CREATE INDEX idx_attendance_teachers_date ON attendance_teachers(date);
CREATE INDEX idx_attendance_teachers_teacher ON attendance_teachers(teacher_id);
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_course ON grades(course_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_uploaded_at ON documents(uploaded_at);
CREATE INDEX idx_financial_transactions_student ON financial_transactions(student_id);
CREATE INDEX idx_financial_transactions_date ON financial_transactions(date);

-- Full-text search indexes
CREATE INDEX idx_students_search ON students USING gin(to_tsvector('arabic', name_ar));
CREATE INDEX idx_teachers_search ON teachers USING gin(to_tsvector('arabic', name_ar));
CREATE INDEX idx_documents_search ON documents USING gin(to_tsvector('arabic', coalesce(extracted_text, '')));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('system_name', 'دار أبي الفداء للعلوم الشرعية', 'اسم النظام'),
('system_city', 'حماة، سوريا', 'موقع النظام'),
('min_attendance_percentage', '75', 'الحد الأدنى لنسبة الحضور'),
('passing_grade', '60', 'درجة النجاح'),
('max_attempts', '3', 'الحد الأقصى لمحاولات الامتحان'),
('semester_start_date', '2025-09-01', 'تاريخ بدء الفصل الدراسي'),
('semester_end_date', '2026-06-30', 'تاريخ نهاية الفصل الدراسي');
