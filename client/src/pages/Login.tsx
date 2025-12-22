import React, { useState } from 'react';
import { FaMosque, FaUser, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('الرجاء إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any credentials
      toast.success('تم تسجيل الدخول بنجاح');
      onLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-islamic-green to-islamic-darkGreen islamic-pattern">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-islamic-lightGreen rounded-full mb-4">
              <FaMosque className="text-4xl text-islamic-darkGreen" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              دار أبي الفداء للعلوم الشرعية
            </h1>
            <p className="text-gray-600">
              نظام الإدارة الإلكتروني
            </p>
            <p className="text-sm text-gray-500 mt-1">
              حماة، سوريا 🇸🇾
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pr-10"
                  placeholder="أدخل اسم المستخدم"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-10"
                  placeholder="أدخل كلمة المرور"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>© 2025 دار أبي الفداء للعلوم الشرعية</p>
            <p className="mt-1">جميع الحقوق محفوظة</p>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-4 bg-white/90 rounded-lg p-4 text-center">
          <p className="text-sm text-gray-700">
            <strong>نسخة تجريبية:</strong> يمكنك استخدام أي اسم مستخدم وكلمة مرور للدخول
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
