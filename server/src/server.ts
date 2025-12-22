import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './config/database.js';
import config from './config/index.js';

// ES Modules __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app: Express = express();
const PORT = config.port;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - للملفات المرفوعة
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'OK', 
    message: 'نظام إدارة دار أبي الفداء للعلوم الشرعية يعمل بنجاح',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ 
    message: 'مرحباً بك في نظام إدارة دار أبي الفداء للعلوم الشرعية',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      students: '/api/students',
      teachers: '/api/teachers',
      courses: '/api/courses',
      attendance: '/api/attendance',
      grades: '/api/grades',
      finance: '/api/finance',
      archive: '/api/archive',
      reports: '/api/reports',
    }
  });
});

// TODO: Import and use routes
// import authRoutes from './routes/auth.js';
// import studentRoutes from './routes/students.js';
// import teacherRoutes from './routes/teachers.js';
// etc...
// app.use('/api/auth', authRoutes);
// app.use('/api/students', studentRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'حدث خطأ في الخادم',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'الصفحة غير موجودة - Route not found' });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ فشل بدء الخادم بسبب عدم الاتصال بقاعدة البيانات');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log('\n==============================================');
      console.log('🕌 نظام إدارة دار أبي الفداء للعلوم الشرعية');
      console.log('==============================================');
      console.log(`🚀 الخادم يعمل على المنفذ: ${PORT}`);
      console.log(`🌐 الرابط: http://localhost:${PORT}`);
      console.log(`📚 API: http://localhost:${PORT}/api`);
      console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      console.log('==============================================\n');
    });
  } catch (error) {
    console.error('❌ فشل بدء الخادم:', error);
    process.exit(1);
  }
};

startServer();

export default app;
