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
      colorClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = CheckCircle;
      break;
    case 'medium':
      label = 'সতর্কতা (মধ্যম ঝুঁকি)';
      colorClass = 'bg-amber-50 text-amber-800 border-amber-300';
      Icon = AlertTriangle;
      break;
    case 'high':
      label = 'উচ্চ ঝুঁকি (অসঙ্গতি বিদ্যমান)';
      colorClass = 'bg-orange-50 text-orange-900 border-orange-400 font-semibold';
      Icon = AlertTriangle;
      break;
    case 'critical':
      label = 'মারাত্মক ঝুঁকি (মামলা/দায়বদ্ধতা/অধিগ্রহণ)';
      colorClass = 'bg-red-100 text-red-950 border-red-500 font-bold';
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
