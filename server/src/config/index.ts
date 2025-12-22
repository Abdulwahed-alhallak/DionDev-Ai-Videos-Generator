import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',

  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || 'your_very_strong_secret_key_here',
  jwtExpiry: process.env.JWT_EXPIRY || '24h',

  // Database Configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    name: process.env.DB_NAME || 'dar_abi_alfadaa_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
  },

  // File Upload Configuration
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 
                   'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                   'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  },

  // Email Configuration
  email: {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    user: process.env.EMAIL_USER || '',
    password: process.env.EMAIL_PASSWORD || '',
  },

  // Backup Configuration
  backup: {
    dir: process.env.BACKUP_DIR || './backups',
    schedule: process.env.BACKUP_SCHEDULE || '0 2 * * *', // 2 AM daily
  },

  // System Settings
  system: {
    name: process.env.SYSTEM_NAME || 'دار أبي الفداء للعلوم الشرعية',
    city: process.env.SYSTEM_CITY || 'حماة، سوريا',
    phone: process.env.SYSTEM_PHONE || '',
    email: process.env.SYSTEM_EMAIL || '',
  },
};

export default config;
