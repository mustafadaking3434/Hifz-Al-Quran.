import { useState, useEffect } from 'react';

interface FavoriteVerse {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  translation: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteVerse[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('quran-favorites');
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: FavoriteVerse[]) => {
    setFavorites(newFavorites);
    localStorage.setItem('quran-favorites', JSON.stringify(newFavorites));
  };

  const addFavorite = (verse: FavoriteVerse) => {
    const exists = favorites.some(
      f => f.surahNumber === verse.surahNumber && f.ayahNumber === verse.ayahNumber
    );
    if (!exists) {
      saveFavorites([...favorites, verse]);
    }
  };

  const removeFavorite = (surahNumber: number, ayahNumber: number) => {
    const newFavorites = favorites.filter(
      f => !(f.surahNumber === surahNumber && f.ayahNumber === ayahNumber)
    );
    saveFavorites(newFavorites);
  };

  const toggleFavorite = (surahNumber: number, ayahNumber: number, surahName: string, ayahText: string, translation: string) => {
    const exists = isFavorite(surahNumber, ayahNumber);
    if (exists) {
      removeFavorite(surahNumber, ayahNumber);
    } else {
      addFavorite({ surahNumber, ayahNumber, surahName, ayahText, translation });
    }
  };

  const isFavorite = (surahNumber: number, ayahNumber: number) => {
    return favorites.some(
      f => f.surahNumber === surahNumber && f.ayahNumber === ayahNumber
    );
  };

  const clearFavorites = () => {
    saveFavorites([]);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    clearFavorites
  };
}