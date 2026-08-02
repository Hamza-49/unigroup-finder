'use client';

import { useState, useCallback } from 'react';
import { Language, t } from '@/lib/i18n';

interface GroupRange {
  start: string;
  end: string;
}

interface Result {
  type: 'success' | 'error' | null;
  message: string;
  groupNumber?: number;
}

interface GroupFormProps {
  language: Language;
}

export function GroupForm({ language }: GroupFormProps) {
  const [groupCount, setGroupCount] = useState<string>('');
  const [groupRanges, setGroupRanges] = useState<GroupRange[]>([]);
  const [studentName, setStudentName] = useState<string>('');
  const [result, setResult] = useState<Result>({ type: null, message: '' });
  const [step2Visible, setStep2Visible] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isRTL = language === 'ar';

  // Validate group count
  const validateGroupCount = (value: string): boolean => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1 || num > 50) {
      return false;
    }
    return true;
  };

  // Generate group range inputs
  const handleGenerateGroups = useCallback(() => {
    const newErrors: { [key: string]: string } = {};
    
    if (!groupCount) {
      newErrors.groupCount = t(language, 'error_num');
      setErrors(newErrors);
      return;
    }

    if (!validateGroupCount(groupCount)) {
      newErrors.groupCount = t(language, 'error_num');
      setErrors(newErrors);
      return;
    }

    const count = parseInt(groupCount, 10);
    const newRanges = Array.from({ length: count }, () => ({ start: '', end: '' }));
    setGroupRanges(newRanges);
    setStep2Visible(true);
    setErrors({});
    setResult({ type: null, message: '' });
  }, [groupCount, language]);

  // Handle group count change
  const handleGroupCountChange = (value: string) => {
    setGroupCount(value);
    setErrors({ ...errors, groupCount: '' });
  };

  // Increment/decrement group count
  const adjustGroupCount = (delta: number) => {
    const current = parseInt(groupCount || '0', 10);
    const newValue = Math.max(1, Math.min(50, current + delta));
    handleGroupCountChange(newValue.toString());
  };

  // Update group range value
  const handleRangeChange = (index: number, field: 'start' | 'end', value: string) => {
    const filtered = value.replace(/[^a-zA-Zàâäæçéèêëíìîïñóòôöœúùûüýÿ\s-]/gi, '').toUpperCase();
    const newRanges = [...groupRanges];
    newRanges[index] = { ...newRanges[index], [field]: filtered };
    setGroupRanges(newRanges);
  };

  // Find group for student
  const handleSearch = useCallback(() => {
    const newErrors: { [key: string]: string } = {};

    if (!studentName.trim()) {
      newErrors.studentName = t(language, 'error_name');
      setErrors(newErrors);
      return;
    }

    // Validate all group ranges are filled
    const allFilled = groupRanges.every((range) => range.start && range.end);
    if (!allFilled) {
      newErrors.ranges = t(language, 'error_num');
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const name = studentName.trim().toUpperCase();
    let foundGroup: number | null = null;

    for (let i = 0; i < groupRanges.length; i++) {
      const { start, end } = groupRanges[i];
      if (name.localeCompare(start) >= 0 && name.localeCompare(end + 'ZZZZ') <= 0) {
        foundGroup = i + 1;
        break;
      }
    }

    if (foundGroup) {
      setResult({
        type: 'success',
        message: `${t(language, 'success_msg')} ${foundGroup}`,
        groupNumber: foundGroup,
      });
    } else {
      setResult({
        type: 'error',
        message: t(language, 'fail_msg'),
      });
    }
  }, [studentName, groupRanges, language]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Step 1: Number of Groups */}
      <div className="bg-cream dark:bg-primary-blue-dark dark:text-white retro-border p-6 sm:p-8 mb-6">
        <label htmlFor="group-count" className="block text-lg sm:text-xl font-black mb-4">
          {t(language, 'step1_label')}
        </label>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => adjustGroupCount(-1)}
            disabled={!groupCount || parseInt(groupCount) <= 1}
            className="px-4 py-2 bg-yellow border-2 border-black font-bold text-xl hover:bg-brown disabled:opacity-50 transition-all"
          >
            −
          </button>

          <input
            id="group-count"
            type="number"
            value={groupCount}
            onChange={(e) => handleGroupCountChange(e.target.value)}
            min="1"
            max="50"
            className="flex-1 px-4 py-2 border-3 border-black text-center font-bold text-lg"
            placeholder="0"
          />

          <button
            onClick={() => adjustGroupCount(1)}
            disabled={!groupCount || parseInt(groupCount) >= 50}
            className="px-4 py-2 bg-yellow border-2 border-black font-bold text-xl hover:bg-brown disabled:opacity-50 transition-all"
          >
            +
          </button>
        </div>

        {errors.groupCount && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{errors.groupCount}</p>}

        <button
          onClick={handleGenerateGroups}
          className="w-full bg-brown border-3 border-black text-white font-black py-3 px-4 hover:bg-yellow hover:text-black transition-all text-base sm:text-lg"
        >
          {t(language, 'step1_btn')}
        </button>
      </div>

      {/* Step 2: Group Ranges */}
      {step2Visible && (
        <div className="bg-cream dark:bg-primary-blue-dark dark:text-white retro-border p-6 sm:p-8 mb-6">
          <p className="text-base sm:text-lg mb-6 font-bold">{t(language, 'step2_desc')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {groupRanges.map((range, index) => (
              <div key={index} className="space-y-2">
                <label className="block font-bold text-sm">G{index + 1}</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={range.start}
                    onChange={(e) => handleRangeChange(index, 'start', e.target.value)}
                    placeholder={t(language, 'placeholder_start')}
                    maxLength={1}
                    className="flex-1 px-3 py-2 border-2 border-black text-center font-bold uppercase"
                  />
                  <input
                    type="text"
                    value={range.end}
                    onChange={(e) => handleRangeChange(index, 'end', e.target.value)}
                    placeholder={t(language, 'placeholder_end')}
                    maxLength={1}
                    className="flex-1 px-3 py-2 border-2 border-black text-center font-bold uppercase"
                  />
                </div>
              </div>
            ))}
          </div>

          {errors.ranges && <p className="text-red-600 dark:text-red-400 text-sm mb-4">{errors.ranges}</p>}

          {/* Student Name */}
          <div className="mb-6">
            <label htmlFor="student-name" className="block text-lg sm:text-lg font-bold mb-2">
              {t(language, 'name_label')}
            </label>
            <input
              id="student-name"
              type="text"
              value={studentName}
              onChange={(e) => {
                setStudentName(e.target.value);
                setErrors({ ...errors, studentName: '' });
              }}
              placeholder={t(language, 'placeholder_name')}
              className="w-full px-4 py-3 border-3 border-black font-bold text-base sm:text-lg"
            />
            {errors.studentName && <p className="text-red-600 dark:text-red-400 text-sm mt-2">{errors.studentName}</p>}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full bg-brown border-3 border-black text-white font-black py-3 px-4 hover:bg-yellow hover:text-black transition-all text-base sm:text-lg"
          >
            {t(language, 'search_btn')}
          </button>
        </div>
      )}

      {/* Result Display */}
      {result.type && (
        <div
          className={`${
            result.type === 'success'
              ? 'bg-green-400 dark:bg-green-600 border-green-700 dark:border-green-500'
              : 'bg-red-400 dark:bg-red-600 border-red-700 dark:border-red-500'
          } retro-border p-6 sm:p-8 text-center text-base sm:text-lg font-bold`}
        >
          {result.message}
        </div>
      )}
    </div>
  );
}
