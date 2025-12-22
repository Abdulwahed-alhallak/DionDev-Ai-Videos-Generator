import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// إعداد الاتصال بقاعدة البيانات - Database Connection Setup
export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'dar_abi_alfadaa_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
});

// اختبار الاتصال - Test Connection
export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح - Database connection established successfully');
    return true;
  } catch (error) {
    console.error('❌ فشل الاتصال بقاعدة البيانات - Unable to connect to database:', error);
    return false;
  }
};

export default sequelize;
