import React from 'react';
import { LucideIcon, Inbox, RefreshCw, PlusCircle, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  titleBn?: string;
  titleEn?: string;
  description?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  actionLabel?: string;
  actionLabelBn?: string;
  actionLabelEn?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionLabelBn?: string;
  secondaryActionLabelEn?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  titleBn,
  titleEn,
  description,
  descriptionBn,
  descriptionEn,
  actionLabel,
  actionLabelBn,
  actionLabelEn,
  onAction,
  secondaryActionLabel,
  secondaryActionLabelBn,
  secondaryActionLabelEn,
  onSecondaryAction,
  className = '',
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const resolvedTitle =
    (isBn ? titleBn : titleEn) ||
    title ||
    (isBn ? 'কোনো তথ্য পাওয়া যায়নি' : 'No Data Available');

  const resolvedDescription =
    (isBn ? descriptionBn : descriptionEn) ||
    description ||
    (isBn
      ? 'বর্তমানে প্রদর্শনের জন্য কোনো রেকর্ড বা তথ্য সংরক্ষিত নেই।'
      : 'There are currently no records or entries matching this criteria.');

  const resolvedActionLabel =
    (isBn ? actionLabelBn : actionLabelEn) || actionLabel;

  const resolvedSecondaryActionLabel =
    (isBn ? secondaryActionLabelBn : secondaryActionLabelEn) ||
    secondaryActionLabel;

  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 backdrop-blur-xs transition-colors ${className}`}
    >
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4 shadow-inner">
        <Icon className="w-7 h-7 sm:w-8 sm:h-8" />
      </div>

      <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mb-1.5">
        {resolvedTitle}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
        {resolvedDescription}
      </p>

      {(onAction || onSecondaryAction) && (
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {onAction && resolvedActionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              <span>{resolvedActionLabel}</span>
            </button>
          )}

          {onSecondaryAction && resolvedSecondaryActionLabel && (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition active:scale-95 cursor-pointer"
            >
              <span>{resolvedSecondaryActionLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
