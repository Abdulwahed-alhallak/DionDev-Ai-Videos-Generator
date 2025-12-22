import React from 'react';
import { 
  FaUserGraduate, 
  FaChalkboardTeacher, 
  FaBook, 
  FaCalendarCheck,
  FaChartBar,
  FaMoneyBillWave,
  FaFolder,
  FaFileAlt,
  FaMosque,
  FaBell,
  FaUser,
  FaSignOutAlt
} from 'react-icons/fa';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard: React.FC = () => {
  // بيانات تجريبية للإحصائيات
  const stats = [
    {
      title: 'إجمالي الطلاب',
      value: '248',
      active: '235 نشط',
      icon: FaUserGraduate,
      color: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    {
      title: 'المدرسين',
      value: '24',
      active: '22 نشط',
      icon: FaChalkboardTeacher,
      color: 'bg-green-500',
      textColor: 'text-green-500'
    },
    {
      title: 'المقررات',
      value: '18',
      active: '16 فعال',
      icon: FaBook,
      color: 'bg-purple-500',
      textColor: 'text-purple-500'
    },
    {
      title: 'نسبة الحضور',
      value: '87%',
      active: 'هذا الأسبوع',
      icon: FaCalendarCheck,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    {
      title: 'الإيرادات الشهرية',
      value: '12.5M',
      active: 'ليرة سورية',
      icon: FaMoneyBillWave,
      color: 'bg-red-500',
      textColor: 'text-red-500'
    },
    {
      title: 'الوثائق المؤرشفة',
      value: '1,245',
      active: 'ملف',
      icon: FaFolder,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-500'
    }
  ];

  // بيانات الرسوم البيانية
  const attendanceData = [
    { day: 'السبت', حضور: 92 },
    { day: 'الأحد', حضور: 88 },
    { day: 'الاثنين', حضور: 85 },
    { day: 'الثلاثاء', حضور: 90 },
    { day: 'الأربعاء', حضور: 87 },
  ];

  const gradeDistribution = [
    { name: 'ممتاز', value: 45, color: '#10b981' },
    { name: 'جيد جداً', value: 78, color: '#3b82f6' },
    { name: 'جيد', value: 62, color: '#f59e0b' },
    { name: 'مقبول', value: 35, color: '#ef4444' },
  ];

  const recentActivities = [
    { id: 1, action: 'تسجيل طالب جديد', student: 'محمد أحمد الخطيب', time: 'منذ 5 دقائق' },
    { id: 2, action: 'إدخال علامات', course: 'علوم الحديث', time: 'منذ 15 دقيقة' },
    { id: 3, action: 'رفع وثيقة جديدة', doc: 'كشف علامات الفصل الأول', time: 'منذ ساعة' },
    { id: 4, action: 'دفع رسوم', student: 'فاطمة علي السيد', amount: '500,000 ل.س', time: 'منذ ساعتين' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FaMosque className="text-4xl text-islamic-green" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  دار أبي الفداء للعلوم الشرعية
                </h1>
                <p className="text-sm text-gray-600">
                  لوحة التحكم - Dashboard
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-islamic-green transition-colors">
                <FaBell className="text-xl" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
                <FaUser className="text-gray-600" />
                <span className="font-medium">المدير العام</span>
              </div>
              <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                <FaSignOutAlt className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8 bg-gradient-to-r from-islamic-green to-islamic-darkGreen rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                السلام عليكم ورحمة الله وبركاته 🌙
              </h2>
              <p className="text-islamic-lightGreen">
                اليوم: {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="text-left">
              <p className="text-sm opacity-90">آية اليوم</p>
              <p className="text-lg font-arabic italic mt-2">
                "وَقُل رَّبِّ زِدْنِي عِلْمًا"
              </p>
              <p className="text-sm opacity-75 mt-1">سورة طه - آية 114</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card fade-in hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p className={`text-sm ${stat.textColor}`}>{stat.active}</p>
                </div>
                <div className={`${stat.color} p-4 rounded-xl`}>
                  <stat.icon className="text-3xl text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Attendance Chart */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartBar className="text-islamic-green" />
              نسبة الحضور الأسبوعية
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="حضور" stroke="#0F6B3E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Grade Distribution */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaChartBar className="text-islamic-green" />
              توزيع التقديرات
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FaFileAlt className="text-islamic-green" />
            النشاطات الأخيرة
          </h3>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-600">
                    {activity.student || activity.course || activity.doc}
                    {activity.amount && ` - ${activity.amount}`}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            © 2025 دار أبي الفداء للعلوم الشرعية - حماة، سوريا 🇸🇾
          </p>
          <p className="text-xs mt-1">
            نسخة تجريبية - Demo Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
