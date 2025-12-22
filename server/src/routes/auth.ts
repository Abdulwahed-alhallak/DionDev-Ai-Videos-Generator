import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/index.js';
import { JwtPayload } from '../middleware/auth.js';

const router = express.Router();

/**
 * تسجيل الدخول - Login
 * POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // التحقق من البيانات المدخلة
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'الرجاء إدخال اسم المستخدم وكلمة المرور',
        message: 'Username and password are required' 
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ 
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        message: 'Invalid credentials' 
      });
    }

    // التحقق من أن المستخدم نشط
    if (!user.is_active) {
      return res.status(403).json({ 
        error: 'الحساب غير نشط',
        message: 'Account is inactive' 
      });
    }

    // التحقق من كلمة المرور
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'اسم المستخدم أو كلمة المرور غير صحيحة',
        message: 'Invalid credentials' 
      });
    }

    // إنشاء JWT token
    const payload: JwtPayload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwtSecret, { 
      expiresIn: config.jwtExpiry 
    });

    // تحديث آخر تسجيل دخول
    await user.update({ last_login: new Date() });

    // إرسال الاستجابة
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      data: {
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      },
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'حدث خطأ في تسجيل الدخول',
      message: 'Internal server error' 
    });
  }
});

/**
 * تسجيل مستخدم جديد - Register (Admin only)
 * POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, password, role, email } = req.body;

    // التحقق من البيانات المدخلة
    if (!username || !password || !role) {
      return res.status(400).json({ 
        error: 'الرجاء إدخال جميع البيانات المطلوبة',
        message: 'Username, password, and role are required' 
      });
    }

    // التحقق من أن اسم المستخدم غير مستخدم
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'اسم المستخدم مستخدم بالفعل',
        message: 'Username already exists' 
      });
    }

    // تشفير كلمة المرور
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // إنشاء المستخدم
    const user = await User.create({
      username,
      password_hash,
      role,
      email,
      is_active: true,
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      data: {
        user: {
          user_id: user.user_id,
          username: user.username,
          role: user.role,
          email: user.email,
        },
      },
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      error: 'حدث خطأ في إنشاء الحساب',
      message: 'Internal server error' 
    });
  }
});

/**
 * تغيير كلمة المرور - Change password
 * POST /api/auth/change-password
 */
router.post('/change-password', async (req: Request, res: Response) => {
  try {
    const { username, oldPassword, newPassword } = req.body;

    if (!username || !oldPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'الرجاء إدخال جميع البيانات المطلوبة',
        message: 'All fields are required' 
      });
    }

    // البحث عن المستخدم
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ 
        error: 'المستخدم غير موجود',
        message: 'User not found' 
      });
    }

    // التحقق من كلمة المرور القديمة
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'كلمة المرور القديمة غير صحيحة',
        message: 'Old password is incorrect' 
      });
    }

    // تشفير كلمة المرور الجديدة
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    // تحديث كلمة المرور
    await user.update({ password_hash });

    res.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      error: 'حدث خطأ في تغيير كلمة المرور',
      message: 'Internal server error' 
    });
  }
});

/**
 * تسجيل الخروج - Logout
 * POST /api/auth/logout
 */
router.post('/logout', (req: Request, res: Response) => {
  // في نظام JWT، تسجيل الخروج يتم من جانب العميل بحذف التوكن
  // هنا يمكن إضافة التوكن إلى قائمة سوداء إذا لزم الأمر
  res.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح',
  });
});

export default router;
