import React, { useState, useEffect } from 'react';
import { Calendar, Moon } from 'lucide-react';
import { Card } from './ui/card';

interface HijriDate {
  day: number;
  month: string;
  year: number;
  weekday: string;
  gregorianDate: string;
}

const hijriMonths = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Ula', 'Jumada al-Thani', 'Rajab', 'Shaban',
  'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
];

const hijriWeekdays = [
  'Al-Ahad', 'Al-Ithnayn', 'Al-Thulatha', 'Al-Arba',
  'Al-Khamis', 'Al-Jumuah', 'As-Sabt'
];

export function HijriDate() {
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [loading, setLoading] = useState(true);

  // Convert Gregorian to Hijri date (accurate for NZ timezone)
  const gregorianToHijri = (date: Date): HijriDate => {
    // Get NZ time
    const nzDate = new Date(date.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}));
    
    // Adjust for UTC+12/13 NZ timezone
    const utcDate = new Date(nzDate.toISOString());
    
    // Hijri calendar calculation (more accurate)
    const julianDay = Math.floor((utcDate.getTime() / 86400000) + 2440587.5);
    const l = julianDay - 1948440.106;
    const n = Math.floor((l - 0.25) / 354.36708);
    const j = 354 * n + 30 * Math.floor((11 * n) / 30) + Math.floor((17 * n) / 30);
    const i = Math.floor((l - j) / 29.530588);
    const day = Math.floor(l - j - 29.530588 * i) + 1;
    const month = Math.floor((i + 2) * 11) % 12;
    const year = n + Math.floor((i + 2) / 12) + 1;
    
    // Get weekday
    const weekdayIndex = nzDate.getDay();
    const weekday = hijriWeekdays[weekdayIndex];
    
    // Format Gregorian date for NZ
    const gregorianDate = nzDate.toLocaleDateString('en-NZ', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return {
      day,
      month: hijriMonths[month],
      year,
      weekday,
      gregorianDate
    };
  };

  useEffect(() => {
    const updateHijriDate = () => {
      const now = new Date();
      const hijri = gregorianToHijri(now);
      setHijriDate(hijri);
      setLoading(false);
    };

    updateHijriDate();
    
    // Update at midnight NZ time
    const timer = setInterval(() => {
      const now = new Date();
      const nzTime = new Date(now.toLocaleString("en-US", {timeZone: "Pacific/Auckland"}));
      if (nzTime.getHours() === 0 && nzTime.getMinutes() === 0) {
        updateHijriDate();
      }
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!hijriDate) return null;

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Moon className="w-5 h-5 text-emerald-600" />
            Hijri Calendar
          </h3>
          <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
        
        <div className="text-center">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
            {hijriDate.day}
          </div>
          <div className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {hijriDate.month}
          </div>
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-3">
            {hijriDate.year} AH
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {hijriDate.weekday}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-600 pt-2">
            {hijriDate.gregorianDate}
          </div>
        </div>
      </div>
    </Card>
  );
}