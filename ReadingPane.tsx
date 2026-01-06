import React, { useState, useEffect, useRef } from 'react';
import { Bookmark, BookmarkCheck, Play, Pause, Volume2, Square } from 'lucide-react';
import { Button } from './ui/button';
import { useFavorites } from '../hooks/useFavorites';

interface Verse {
  number: number;
  text: string;
  translation?: string;
}

interface ReadingPaneProps {
  surahNumber: number;
  translationCode: string;
  fontSizeArabic: number;
  hifzMode: boolean;
  tajweedMode: boolean;
}

export function ReadingPane({ 
  surahNumber, 
  translationCode, 
  fontSizeArabic, 
  hifzMode,
  tajweedMode 
}: ReadingPaneProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [surahName, setSurahName] = useState<string>('');
  const [playingVerse, setPlayingVerse] = useState<number | null>(null);
  const [isPlayingFullSurah, setIsPlayingFullSurah] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const { toggleFavorite, isFavorite } = useFavorites();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fullSurahAudioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchVerses = async () => {
      if (!surahNumber) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch Arabic text
        const arabicResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        if (!arabicResponse.ok) throw new Error('Failed to fetch Arabic text');
        const arabicData = await arabicResponse.json();

        // Fetch translation
        const translationResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${translationCode}`);
        if (!translationResponse.ok) throw new Error('Failed to fetch translation');
        const translationData = await translationResponse.json();

        if (arabicData.data && translationData.data) {
          const combinedVerses = arabicData.data.ayahs.map((ayah: any, index: number) => ({
            number: ayah.numberInSurah,
            text: ayah.text,
            translation: translationData.data.ayahs[index]?.text || ''
          }));
          setVerses(combinedVerses);
          setSurahName(arabicData.data.englishName);
        } else {
          setError('Invalid data received from server');
        }
      } catch (err) {
        setError('Error loading verses. Please check your connection and try again.');
        console.error('Error fetching verses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerses();
  }, [surahNumber, translationCode]);

  const applyTajweed = (text: string) => {
    if (!tajweedMode) return text;
    
    return text
      .replace(/(َ)/g, '<span class="text-emerald-600 font-semibold">$1</span>')
      .replace(/(ُ)/g, '<span class="text-blue-600 font-semibold">$1</span>')
      .replace(/(ِ)/g, '<span class="text-purple-600 font-semibold">$1</span>')
      .replace(/(ْ)/g, '<span class="text-gray-600">$1</span>')
      .replace(/(ّ)/g, '<span class="text-pink-600 font-bold">$1</span>');
  };

  const stopAllAudio = () => {
    // Clear any existing intervals
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Stop individual verse audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current = null;
    }

    // Stop full surah audio
    if (fullSurahAudioRef.current) {
      fullSurahAudioRef.current.pause();
      fullSurahAudioRef.current.currentTime = 0;
      fullSurahAudioRef.current.src = '';
      fullSurahAudioRef.current = null;
    }

    setPlayingVerse(null);
    setIsPlayingFullSurah(false);
    setIsLoading(false);
    setCurrentVerseIndex(0);
  };

  const playVerseAudio = async (verseNumber: number) => {
    // Stop any existing audio first
    stopAllAudio();

    if (playingVerse === verseNumber) {
      return;
    }

    setIsLoading(true);
    setPlayingVerse(verseNumber);

    try {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}:${verseNumber}.mp3`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.volume = volume;

      const handleEnded = () => {
        setPlayingVerse(null);
        setIsLoading(false);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const handleError = (e: Event) => {
        console.error('Verse audio error:', e);
        setPlayingVerse(null);
        setIsLoading(false);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      await audio.play();
    } catch (error) {
      console.error('Error playing verse audio:', error);
      setPlayingVerse(null);
      setIsLoading(false);
    }
  };

  const playFullSurahAudio = async () => {
    // Stop any existing audio first
    stopAllAudio();

    if (isPlayingFullSurah) {
      return;
    }

    setIsLoading(true);
    setIsPlayingFullSurah(true);

    try {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${surahNumber}.mp3`;
      const audio = new Audio(audioUrl);
      fullSurahAudioRef.current = audio;
      audio.volume = volume;

      const handleEnded = () => {
        setIsPlayingFullSurah(false);
        setIsLoading(false);
        setCurrentVerseIndex(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      const handleError = (e: Event) => {
        console.error('Full surah audio error:', e);
        setIsPlayingFullSurah(false);
        setIsLoading(false);
        setCurrentVerseIndex(0);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Start progress tracking
      progressIntervalRef.current = setInterval(() => {
        if (audio.duration && verses.length > 0) {
          const progress = audio.currentTime / audio.duration;
          const verseIndex = Math.floor(progress * verses.length);
          setCurrentVerseIndex(Math.min(verseIndex, verses.length - 1));
        }
      }, 500);

      await audio.play();
    } catch (error) {
      console.error('Error playing full surah:', error);
      setIsPlayingFullSurah(false);
      setIsLoading(false);
    }
  };

  const toggleFullSurahPlayback = () => {
    if (isPlayingFullSurah) {
      stopAllAudio();
    } else {
      playFullSurahAudio();
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (fullSurahAudioRef.current) {
      fullSurahAudioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading verses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Full Surah Audio Controls */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              onClick={toggleFullSurahPlayback}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
            >
              {isLoading && isPlayingFullSurah ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : isPlayingFullSurah ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlayingFullSurah ? 'Pause Surah' : 'Play Full Surah'}
            </Button>
            
            {isPlayingFullSurah && (
              <Button
                variant="outline"
                size="sm"
                onClick={stopAllAudio}
                className="border-red-600 text-red-600 hover:bg-red-50"
              >
                <Square className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {isPlayingFullSurah && currentVerseIndex < verses.length 
                ? `Verse ${currentVerseIndex + 1} of ${verses.length}`
                : `${verses.length} verses`
              }
            </span>
            
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-gray-500" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bismillah - Not a verse */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center py-6">
          <div className="inline-block p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <div 
              className="text-2xl font-arabic text-emerald-600 font-bold"
              style={{ fontSize: `${fontSizeArabic + 4}px` }}
              dir="rtl"
              dangerouslySetInnerHTML={{ 
                __html: applyTajweed('بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ') 
              }}
            />
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">
              In the name of Allah, the Entirely Merciful, the Especially Merciful.
            </p>
          </div>
        </div>
      )}

      {verses.map((verse, index) => (
        <div 
          key={verse.number} 
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border ${
            isPlayingFullSurah && currentVerseIndex === index
              ? 'border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-800'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                  isPlayingFullSurah && currentVerseIndex === index
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-emerald-600 text-white'
                }`}>
                  {verse.number}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    Verse {verse.number}
                  </span>
                  {isPlayingFullSurah && currentVerseIndex === index && (
                    <span className="text-xs text-emerald-600 font-medium animate-pulse">
                      Currently Playing
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Audio Play Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => playVerseAudio(verse.number)}
                  disabled={isLoading && playingVerse !== verse.number}
                  className="transition-all duration-200"
                >
                  {isLoading && playingVerse === verse.number ? (
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  ) : playingVerse === verse.number ? (
                    <Pause className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Play className="w-4 h-4 text-gray-400 hover:text-emerald-600" />
                  )}
                </Button>

                {/* Bookmark Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleFavorite(surahNumber, verse.number, surahName, verse.text, verse.translation || '')}
                  className="transition-all duration-200"
                >
                  {isFavorite(surahNumber, verse.number) ? (
                    <BookmarkCheck className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Bookmark className="w-5 h-5 text-gray-400 hover:text-emerald-600" />
                  )}
                </Button>
              </div>
            </div>

            {/* Arabic Text */}
            <div className="mb-4">
              <div 
                className={`font-arabic leading-loose text-right transition-all duration-300 ${
                  hifzMode ? 'blur-sm select-none' : ''
                }`}
                style={{ 
                  fontSize: `${fontSizeArabic}px`,
                  lineHeight: '2.5'
                }}
                dir="rtl"
                dangerouslySetInnerHTML={{ 
                  __html: applyTajweed(verse.text) 
                }}
              />
              {hifzMode && (
                <div className="text-center mt-2">
                  <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                    Hifz Mode Active
                  </span>
                </div>
              )}
            </div>

            {/* Translation */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                {verse.translation}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Audio Status Indicator */}
      {(playingVerse || isPlayingFullSurah) && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-40">
          <Volume2 className="w-4 h-4" />
          <span className="text-sm">
            {isPlayingFullSurah 
              ? `Playing Surah - Verse ${currentVerseIndex + 1}`
              : `Playing Verse ${playingVerse}`
            }
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={stopAllAudio}
            className="text-white hover:bg-white/20 p-1 h-auto"
          >
            <span className="text-xs">Stop</span>
          </Button>
        </div>
      )}
    </div>
  );
}