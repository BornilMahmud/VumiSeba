import React from 'react';
import { AlertTriangle, CheckCircle, AlertOctagon, Info } from 'lucide-react';

interface RiskBadgeProps {
  level: 'low' | 'medium' | 'high' | 'critical';
  score?: number;
  showScore?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  level,
  score,
  showScore = true,
  className = '',
}) => {
  let label = '';
  let colorClass = '';
  let Icon = Info;

  switch (level) {
    case 'low':
      label = 'কম ঝুঁকি (প্রাথমিকভাবে নিরাপদ)';
      colorClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      Icon = CheckCircle;
      break;
    case 'medium':
      label = 'সতর্কতা (মধ্যম ঝুঁকি)';
      colorClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      Icon = AlertTriangle;
      break;
    case 'high':
      label = 'উচ্চ ঝুঁকি (অসঙ্গতি বিদ্যমান)';
      colorClass = 'bg-orange-50 dark:bg-orange-950/60 text-orange-900 dark:text-orange-300 border-orange-400 dark:border-orange-800 font-semibold';
      Icon = AlertTriangle;
      break;
    case 'critical':
      label = 'মারাত্মক ঝুঁকি (মামলা/দায়বদ্ধতা/অধিগ্রহণ)';
      colorClass = 'bg-red-100 dark:bg-red-950/80 text-red-950 dark:text-red-200 border-red-500 dark:border-red-700 font-bold';
      Icon = AlertOctagon;
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs border ${colorClass} ${className}`}
    >
      <Icon size={14} className="shrink-0" />
      <span>{label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 opacity-80 font-mono">
          ({score}/১০০)
        </span>
      )}
    </span>
  );
};
