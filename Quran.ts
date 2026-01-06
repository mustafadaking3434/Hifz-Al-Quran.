export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface Translation {
  text: string;
  number: number;
  numberInSurah: number;
}

export interface Reciter {
  id: string;
  name: string;
  style: string;
  arabicName: string;
}

export interface TajweedRule {
  type: 'ghunnah' | 'qalqalah' | 'madd' | 'ikhfa' | 'idgham' | 'iqlab';
  ayah: number;
  start: number;
  end: number;
  description: string;
  color: string;
}

export interface Recording {
  id: string;
  surah: number;
  ayah: number;
  timestamp: number;
  duration: number;
  score?: number;
  mistakes?: string[];
}