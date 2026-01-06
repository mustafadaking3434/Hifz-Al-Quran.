import React from 'react';
import { X, Heart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useFavorites } from '../hooks/useFavorites';

interface FavoriteVerse {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  translation: string;
}

interface FavoritesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FavoritesPanel({ isOpen, onClose }: FavoritesPanelProps) {
  const { favorites, clearFavorites, removeFavorite } = useFavorites();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-emerald-600" />
            <h2 className="text-xl font-bold">Favorite Verses</h2>
            <span className="bg-emerald-600 text-white text-sm px-2 py-1 rounded-full">
              {favorites.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {favorites.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFavorites}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {favorites.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No favorites yet
              </h3>
              <p className="text-sm text-gray-500">
                Start bookmarking verses to see them here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {favorites.map((favorite, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-emerald-600">
                        Surah {favorite.surahNumber}, Verse {favorite.ayahNumber}
                      </h4>
                      <p className="text-sm text-gray-500">{favorite.surahName}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFavorite(favorite.surahNumber, favorite.ayahNumber)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <div 
                      className="font-arabic text-right text-lg leading-relaxed"
                      dir="rtl"
                    >
                      {favorite.ayahText}
                    </div>
                    <div className="border-t pt-3">
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {favorite.translation}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}