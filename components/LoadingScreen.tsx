import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  status: string;
}

const tips = [
  "💡 نصيحة: وصف الإضاءة (مثل 'ضوء غروب ناعم' أو 'نيون ساطع') يضيف واقعية مذهلة للفيديو.",
  "🎥 نصيحة: جرب تحديد حركة الكاميرا، مثل 'تحليق بطائرة درون' أو 'زوم بطيء' للمزيد من الديناميكية.",
  "يقوم نموذج Veo الآن بمعالجة الفيزياء وحركة العناصر داخل المشهد...",
  "🎨 نصيحة: يمكنك تحديد النمط الفني، مثل 'سينمائي واقعي'، 'رسوم متحركة'، أو 'فن بيكسل'.",
  "جاري دمج الإطارات وضبط معدل الحركة لضمان انسيابية الفيديو...",
  "🔍 نصيحة: التفاصيل الدقيقة مثل 'قطرات المطر على الزجاج' تجعل المشهد ينبض بالحياة.",
  "يتم الآن ضبط الألوان والظلال للحصول على أفضل جودة بصرية...",
  "⏳ عملية التوليد المعقدة تستغرق بعض الوقت لضمان دقة التفاصيل، شكراً لصبرك!"
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ status }) => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Randomize start index
    setTipIndex(Math.floor(Math.random() * tips.length));

    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 md:p-12 text-center animate-fade-in">
      <div className="relative w-16 h-16 md:w-24 md:h-24 mb-6 md:mb-8">
        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl md:text-2xl">🎬</span>
        </div>
      </div>
      
      <h3 className="text-lg md:text-xl font-bold text-white mb-4">{status}</h3>
      
      <div className="h-16 md:h-20 flex items-center justify-center">
        <p className="text-slate-400 max-w-md animate-pulse text-xs md:text-base leading-relaxed px-2">
          {tips[tipIndex]}
        </p>
      </div>
    </div>
  );
};