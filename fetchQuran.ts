import { Surah, SurahResponse, TranslationResponse } from '../types/Quran';

const API_BASE = 'https://api.alquran.cloud/v1';

const cache = new Map<string, any>();

export async function fetchSurahs(): Promise<Surah[]> {
  const cacheKey = 'surahs';
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(`${API_BASE}/surah`);
    if (!response.ok) {
      throw new Error('Failed to fetch surahs');
    }
    const data = await response.json();
    cache.set(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    throw error;
  }
}

export async function fetchSurah(surahNumber: number): Promise<SurahResponse['data']> {
  const cacheKey = `surah-${surahNumber}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(`${API_BASE}/surah/${surahNumber}`);
    if (!response.ok) {
      throw new Error('Failed to fetch surah');
    }
    const data = await response.json();
    cache.set(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching surah:', error);
    throw error;
  }
}

export async function fetchTranslation(
  surahNumber: number,
  translationCode: string = 'en.saheeh'
): Promise<TranslationResponse['data']> {
  const cacheKey = `translation-${surahNumber}-${translationCode}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    const response = await fetch(`${API_BASE}/surah/${surahNumber}/${translationCode}`);
    if (!response.ok) {
      throw new Error('Failed to fetch translation');
    }
    const data = await response.json();
    cache.set(cacheKey, data.data);
    return data.data;
  } catch (error) {
    console.error('Error fetching translation:', error);
    throw error;
  }
}