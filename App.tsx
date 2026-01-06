import React, { useState, useEffect, useCallback } from 'react';
import { Search, Menu, X, Book, Heart, Clock, Moon, Sun, Eye, EyeOff, Sparkles, Volume2, Star, Crown, Play, Pause } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { SurahList } from './components/SurahList';
import { ReadingPane } from './components/ReadingPane';
import { FavoritesPanel } from './components/FavoritesPanel';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useFavorites } from '../hooks/useFavorites';

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

type TabType = 'quran' | 'hadith' | 'duas' | 'prayer';

export default function App() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [translationCode, setTranslationCode] = useLocalStorage('translation', 'en.saheeh');
  const [fontSizeArabic, setFontSizeArabic] = useLocalStorage('fontSizeArabic', 24);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark' | 'sepia'>('theme', 'light');
  const [hifzMode, setHifzMode] = useLocalStorage('hifzMode', false);
  const [tajweedMode, setTajweedMode] = useLocalStorage('tajweedMode', false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reciter, setReciter] = useLocalStorage('reciter', 'ar.alafasy');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('quran');
  const [audioEnabled, setAudioEnabled] = useLocalStorage('audioEnabled', true);
  const [volume, setVolume] = useLocalStorage('volume', 0.7);
  const { favorites } = useFavorites();

  // Audio state
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'sepia');
    root.classList.add(theme);
    
    if (theme === 'dark') {
      document.body.className = 'bg-gray-900 text-gray-100';
    } else if (theme === 'sepia') {
      document.body.className = 'bg-amber-50 text-amber-900';
    } else {
      document.body.className = 'bg-white text-gray-900';
    }
  }, [theme]);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        if (data.data) {
          setSurahs(data.data);
        }
      } catch (error) {
        console.error('Error fetching surahs:', error);
      }
    };
    fetchSurahs();
  }, []);

  // Initialize audio
  useEffect(() => {
    if (audioEnabled && selectedSurah) {
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${selectedSurah}.mp3`;
      const newAudio = new Audio(audioUrl);
      newAudio.volume = volume;
      
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      newAudio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        setIsLoading(false);
        setIsPlaying(false);
      });

      setAudio(newAudio);

      return () => {
        newAudio.pause();
        newAudio.src = '';
      };
    }
  }, [selectedSurah, audioEnabled, volume]);

  const filteredSurahs = React.useMemo(() => {
    return surahs.filter(surah =>
      surah.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      surah.name.includes(searchTerm) ||
      surah.englishNameTranslation.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [surahs, searchTerm]);

  const selectedSurahData = React.useMemo(() => {
    return surahs.find(s => s.number === selectedSurah);
  }, [surahs, selectedSurah]);

  const toggleTheme = () => {
    const themes: Array<'light' | 'dark' | 'sepia'> = ['light', 'dark', 'sepia'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  };

  const toggleHifzMode = () => {
    setHifzMode(!hifzMode);
  };

  const toggleTajweedMode = () => {
    setTajweedMode(!tajweedMode);
  };

  const handlePlayPause = useCallback(async () => {
    if (!audio || !audioEnabled) return;

    setIsLoading(true);
    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  }, [audio, isPlaying, audioEnabled]);

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audio) {
      audio.volume = newVolume;
    }
  };

  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-gray-100';
      case 'sepia':
        return 'bg-amber-50 text-amber-900';
      default:
        return 'bg-white text-gray-900';
    }
  };

  const getHeaderClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 border-gray-700';
      case 'sepia':
        return 'bg-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()} transition-all duration-300`}>
      {/* Header */}
      <header className={`${getHeaderClasses()} border-b sticky top-0 z-40 shadow-md`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-emerald-600">
                    Hifz Al Quran
                  </h1>
                  <p className="text-xs text-gray-500">Premium Islamic Experience</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Tab Navigation */}
              <div className="hidden sm:flex items-center gap-1 mr-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <Button
                  variant={activeTab === 'quran' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('quran')}
                  className={`rounded-md text-xs ${
                    activeTab === 'quran' 
                      ? 'bg-emerald-600 text-white' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Book className="w-3 h-3 mr-1" />
                  Quran
                </Button>
                <Button
                  variant={activeTab === 'hadith' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('hadith')}
                  className={`rounded-md text-xs ${
                    activeTab === 'hadith' 
                      ? 'bg-emerald-600 text-white' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Hadith
                </Button>
                <Button
                  variant={activeTab === 'duas' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('duas')}
                  className={`rounded-md text-xs ${
                    activeTab === 'duas' 
                      ? 'bg-emerald-600 text-white' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className="w-3 h-3 mr-1" />
                  Duas
                </Button>
                <Button
                  variant={activeTab === 'prayer' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveTab('prayer')}
                  className={`rounded-md text-xs ${
                    activeTab === 'prayer' 
                      ? 'bg-emerald-600 text-white' 
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Clock className="w-3 h-3 mr-1" />
                  Prayer
                </Button>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleHifzMode}
                  className={`text-xs ${
                    hifzMode 
                      ? 'bg-emerald-600 text-white border-emerald-600' 
                      : ''
                  }`}
                >
                  {hifzMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  <span className="hidden sm:inline ml-1">Hifz</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTajweedMode}
                  className={`text-xs ${
                    tajweedMode 
                      ? 'bg-purple-600 text-white border-purple-600' 
                      : ''
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="hidden sm:inline ml-1">Tajweed</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleTheme}
                  className="text-xs"
                >
                  {theme === 'light' ? <Sun className="w-4 h-4" /> : theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-600" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFavoritesOpen(!favoritesOpen)}
                  className="text-xs relative"
                >
                  <Heart className="w-4 h-4" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                      {favorites.length}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Tab Navigation */}
          <div className="flex items-center gap-1 mt-2 sm:hidden overflow-x-auto p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <Button
              variant={activeTab === 'quran' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('quran')}
              className={`rounded-md text-xs whitespace-nowrap ${
                activeTab === 'quran' 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Book className="w-3 h-3 mr-1" />
              Quran
            </Button>
            <Button
              variant={activeTab === 'hadith' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('hadith')}
              className={`rounded-md text-xs whitespace-nowrap ${
                activeTab === 'hadith' 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Star className="w-3 h-3 mr-1" />
              Hadith
            </Button>
            <Button
              variant={activeTab === 'duas' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('duas')}
              className={`rounded-md text-xs whitespace-nowrap ${
                activeTab === 'duas' 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Heart className="w-3 h-3 mr-1" />
              Duas
            </Button>
            <Button
              variant={activeTab === 'prayer' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('prayer')}
              className={`rounded-md text-xs whitespace-nowrap ${
                activeTab === 'prayer' 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <Clock className="w-3 h-3 mr-1" />
              Prayer
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 transition-transform duration-300 mt-16 lg:mt-0 overflow-y-auto`}>
          <div className={`h-full ${theme === 'dark' ? 'bg-gray-800' : theme === 'sepia' ? 'bg-amber-100' : 'bg-white'} shadow-lg`}>
            <div className="p-4 space-y-4">
              {activeTab === 'quran' && (
                <>
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search surahs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 h-10 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-100' : theme === 'sepia' ? 'bg-amber-50 text-amber-900' : 'bg-gray-50'
                      }`}
                    />
                  </div>

                  {/* Selects */}
                  <div className="space-y-3">
                    <Select value={translationCode} onValueChange={setTranslationCode}>
                      <SelectTrigger className={`h-10 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-100' : theme === 'sepia' ? 'bg-amber-50 text-amber-900' : 'bg-gray-50'
                      }`}>
                        <SelectValue placeholder="Select translation" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en.saheeh">Saheeh International</SelectItem>
                        <SelectItem value="en.yusufali">Yusuf Ali</SelectItem>
                        <SelectItem value="en.pickthall">Pickthall</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={reciter} onValueChange={setReciter}>
                      <SelectTrigger className={`h-10 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-100' : theme === 'sepia' ? 'bg-amber-50 text-amber-900' : 'bg-gray-50'
                      }`}>
                        <SelectValue placeholder="Select reciter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ar.alafasy">Mishari Al-Afasy</SelectItem>
                        <SelectItem value="ar.abdulbaset">Abdul Basit</SelectItem>
                        <SelectItem value="ar.mahermuaiqly">Maher Al Muaiqly</SelectItem>
                        <SelectItem value="ar.saudshuraym">Saud Shuraym</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Font Size Slider */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center justify-between">
                      <span>Arabic Font Size</span>
                      <span className="text-emerald-600 font-bold">{fontSizeArabic}px</span>
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="18"
                        max="48"
                        value={fontSizeArabic}
                        onChange={(e) => setFontSizeArabic(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>18px</span>
                        <span>48px</span>
                      </div>
                    </div>
                  </div>

                  {/* Surah List */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold mb-2">Surahs</h3>
                    <SurahList
                      surahs={filteredSurahs}
                      selectedSurah={selectedSurah}
                      onSelectSurah={setSelectedSurah}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 pb-24">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'quran' && selectedSurahData && (
              <>
                {/* Surah Header */}
                <div className="mb-6 text-center">
                  <div className="inline-flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">{selectedSurahData.number}</span>
                    </div>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold text-emerald-600">
                        {selectedSurahData.englishName}
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedSurahData.englishNameTranslation}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Book className="w-4 h-4" />
                      {selectedSurahData.numberOfAyahs} verses
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      {selectedSurahData.revelationType}
                    </span>
                  </div>
                </div>

                <ReadingPane
                  surahNumber={selectedSurah}
                  translationCode={translationCode}
                  fontSizeArabic={fontSizeArabic}
                  hifzMode={hifzMode}
                  tajweedMode={tajweedMode}
                />
              </>
            )}

            {activeTab === 'hadith' && (
              <div className="text-center py-12">
                <Star className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">Hadith Collection</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}

            {activeTab === 'duas' && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">Daily Duas</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}

            {activeTab === 'prayer' && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
                <h2 className="text-2xl font-bold mb-2">Prayer Times</h2>
                <p className="text-gray-600">Coming soon...</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Audio Player */}
      {activeTab === 'quran' && selectedSurahData && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-30">
          <div className="max-w-4xl mx-auto p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayPause}
                  disabled={!audioEnabled || isLoading}
                  className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </Button>
                
                <div className="hidden sm:block">
                  <p className="font-semibold text-sm">
                    Surah {selectedSurahData.englishName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {reciter.replace('ar.', '').replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-gray-500" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                    className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favorites Panel */}
      <FavoritesPanel isOpen={favoritesOpen} onClose={() => setFavoritesOpen(false)} />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}