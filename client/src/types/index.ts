// أنواع البيانات الأساسية - Core Types

// المستخدمين - Users
export interface User {
  user_id: number;
  username: string;
  role: 'admin' | 'academic' | 'accounting' | 'teacher' | 'student' | 'archivist';
  email?: string;
  is_active: boolean;
  last_login?: Date;
  created_at: Date;
}

// الطلاب - Students
export interface Student {
  student_id: number;
  user_id?: number;
  registration_number: string;
  name_ar: string;
  name_en?: string;
  id_number: string;
  birthdate: Date;
  gender: 'ذكر' | 'أنثى';
  address?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relationship?: string;
  status: 'نشط' | 'متخرج' | 'منسحب' | 'مفصول';
  enrollment_date: Date;
  level: string;
  department: string;
  session?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// المدرسين - Teachers
export interface Teacher {
  teacher_id: number;
  user_id?: number;
  employee_number: string;
  name_ar: string;
  name_en?: string;
  id_number: string;
  photo_url?: string;
  specialty: string;
  qualifications?: string;
  experience_years?: number;
  phone?: string;
  email?: string;
  address?: string;
  hire_date: Date;
  contract_type?: string;
  contract_start?: Date;
  contract_end?: Date;
  base_salary: number;
  session_rate: number;
  status: 'نشط' | 'متقاعد' | 'مستقيل';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// الكتب - Books
export interface Book {
  book_id: number;
  title_ar: string;
  title_en?: string;
  author_ar?: string;
  author_en?: string;
  publisher?: string;
  publish_year?: number;
  isbn?: string;
  category?: string;
  cover_image_url?: string;
  description?: string;
  pages?: number;
  created_at: Date;
  updated_at: Date;
}

// المقررات - Courses
export interface Course {
  course_id: number;
  code: string;
  name_ar: string;
  name_en?: string;
  book_id?: number;
  book?: Book;
  level: string;
  credit_hours: number;
  practical_hours: number;
  theoretical_hours: number;
  teacher_id?: number;
  teacher?: Teacher;
  description?: string;
  syllabus?: string;
  prerequisites?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// حضور الطلاب - Student Attendance
export interface StudentAttendance {
  attendance_id: number;
  student_id: number;
  student?: Student;
  course_id: number;
  course?: Course;
  date: Date;
  time_in?: string;
  time_out?: string;
  status: 'حاضر' | 'غائب' | 'غائب بعذر' | 'متأخر';
  fingerprint_verified: boolean;
  session_number?: number;
  notes?: string;
  created_at: Date;
}

// حضور المدرسين - Teacher Attendance
export interface TeacherAttendance {
  attendance_id: number;
  teacher_id: number;
  teacher?: Teacher;
  course_id?: number;
  course?: Course;
  date: Date;
  time_in?: string;
  time_out?: string;
  session_number: number;
  fingerprint_verified: boolean;
  notes?: string;
  created_at: Date;
}

// العلامات - Grades
export interface Grade {
  grade_id: number;
  student_id: number;
  student?: Student;
  course_id: number;
  course?: Course;
  practical_mark: number;
  theoretical_mark: number;
  participation_mark: number;
  total_mark: number;
  percentage: number;
  grade_letter?: string;
  status: 'ناجح' | 'راسب';
  attempt_number: number;
  exam_date?: Date;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// المعاملات المالية - Financial Transactions
export interface FinancialTransaction {
  transaction_id: number;
  student_id?: number;
  student?: Student;
  type: 'رسوم دراسية' | 'دفعة' | 'قسط' | 'خصم' | 'غرامة';
  amount: number;
  payment_method?: string;
  date: Date;
  receipt_number?: string;
  description?: string;
  created_by?: number;
  created_at: Date;
}

// رواتب المدرسين - Teacher Salaries
export interface TeacherSalary {
  salary_id: number;
  teacher_id: number;
  teacher?: Teacher;
  month: number;
  year: number;
  base_salary: number;
  session_count: number;
  session_total: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
  paid_at?: Date;
  notes?: string;
  created_at: Date;
}

// الوثائق - Documents
export interface Document {
  document_id: number;
  title: string;
  description?: string;
  file_path: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  category?: string;
  subcategory?: string;
  tags?: string[];
  linked_person_id?: number;
  linked_person_type?: 'student' | 'teacher';
  linked_course_id?: number;
  uploaded_by?: number;
  uploaded_at: Date;
  extracted_text?: string;
  ocr_processed: boolean;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

// الشهادات - Certificates
export interface Certificate {
  certificate_id: number;
  student_id: number;
  student?: Student;
  type: string;
  reference_number: string;
  issue_date: Date;
  course_id?: number;
  course?: Course;
  level?: string;
  gpa?: number;
  qr_code_url?: string;
  template: string;
  status: 'صالحة' | 'ملغاة';
  notes?: string;
  created_at: Date;
}

// الجداول - Schedules
export interface Schedule {
  schedule_id: number;
  course_id: number;
  course?: Course;
  teacher_id?: number;
  teacher?: Teacher;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room?: string;
  semester?: string;
  is_active: boolean;
  created_at: Date;
}

// التقويم الأكاديمي - Academic Calendar
export interface AcademicEvent {
  event_id: number;
  title: string;
  description?: string;
  event_date: Date;
  end_date?: Date;
  event_type?: string;
  is_holiday: boolean;
  created_at: Date;
}

// الإشعارات - Notifications
export interface Notification {
  notification_id: number;
  user_id?: number;
  title: string;
  message: string;
  type?: string;
  is_read: boolean;
  link?: string;
  created_at: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Dashboard Statistics
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalDocuments: number;
  activeStudents: number;
  activeTeachers: number;
  recentAttendanceRate: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}
