import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Repeat, Volume2, Mic, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AudioPlayerProps {
  surahNumber: number;
  reciter: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onAyahChange: (ayah: number) => void;
  currentAyah: number;
  totalAyahs: number;
}

export function AudioPlayer({ 
  surahNumber, 
  reciter, 
  isPlaying, 
  onPlayPause, 
  onAyahChange,
  currentAyah,
  totalAyahs 
}: AudioPlayerProps) {
  const [loopMode, setLoopMode] = useLocalStorage<'none' | 'verse' | 'surah'>('loopMode', 'none');
  const [repeatCount, setRepeatCount] = useLocalStorage('repeatCount', 1);
  const [currentRepeat, setCurrentRepeat] = useState(0);
  const [volume, setVolume] = useLocalStorage('volume', 0.7);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useLocalStorage('audioEnabled', true);

  // Generate audio URL for current ayah
  useEffect(() => {
    if (surahNumber && reciter && currentAyah > 0 && audioEnabled) {
      // Use EveryAyah which is more reliable
      const paddedSurah = surahNumber.toString().padStart(3, '0');
      const paddedAyah = currentAyah.toString().padStart(3, '0');
      
      const url = `https://everyayah.com/data/${reciter}/${paddedSurah}${paddedAyah}.mp3`;
      setAudioUrl(url);
      setIsLoading(true);
      setError(null);
      
      console.log('Loading audio for Surah', surahNumber, 'Ayah', currentAyah, 'URL:', url);
    } else {
      setAudioUrl('');
      setIsLoading(false);
    }
  }, [surahNumber, reciter, currentAyah, audioEnabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handlePlayPause = async () => {
    if (!audioEnabled) {
      setAudioEnabled(true);
      return;
    }

    if (!audioRef.current || !audioUrl) {
      console.log('No audio element or URL');
      return;
    }

    try {
      if (isPlaying) {
        audioRef.current.pause();
        console.log('Pausing audio');
      } else {
        console.log('Attempting to play audio:', audioUrl);
        await audioRef.current.play();
        console.log('Audio playing successfully');
      }
      onPlayPause();
    } catch (error) {
      console.error('Audio playback error:', error);
      setError('Failed to play audio. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAudioEnded = () => {
    console.log('Audio ended');
    setIsLoading(false);
    
    if (loopMode === 'verse') {
      if (currentRepeat < repeatCount - 1) {
        setCurrentRepeat(prev => prev + 1);
        // Replay same ayah
        setTimeout(() => {
          audioRef.current?.play();
        }, 100);
      } else {
        setCurrentRepeat(0);
        // Move to next ayah
        if (currentAyah < totalAyahs) {
          onAyahChange(currentAyah + 1);
        } else {
          onPlayPause(); // Stop at end
        }
      }
    } else if (loopMode === 'surah') {
      if (currentRepeat < repeatCount - 1) {
        setCurrentRepeat(0);
        onAyahChange(1); // Restart surah
        setTimeout(() => {
          audioRef.current?.play();
        }, 500);
      } else {
        setCurrentRepeat(0);
        onPlayPause(); // Stop playing
      }
    } else {
      // Normal mode - move to next ayah
      if (currentAyah < totalAyahs) {
        onAyahChange(currentAyah + 1);
      } else {
        onPlayPause(); // Stop at end
      }
    }
  };

  const handlePrevious = () => {
    setCurrentRepeat(0);
    if (currentAyah > 1) {
      onAyahChange(currentAyah - 1);
    }
  };

  const handleNext = () => {
    setCurrentRepeat(0);
    if (currentAyah < totalAyahs) {
      onAyahChange(currentAyah + 1);
    }
  };

  const handleLoopModeChange = () => {
    const modes: Array<'none' | 'verse' | 'surah'> = ['none', 'verse', 'surah'];
    const currentIndex = modes.indexOf(loopMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setLoopMode(nextMode);
    setCurrentRepeat(0);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700 p-4 sticky bottom-0 z-50">
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={handleAudioEnded}
        onLoadedData={() => {
          console.log('Audio data loaded');
          setIsLoading(false);
        }}
        onError={(e) => {
          console.error('Audio error:', e);
          setError('Failed to load audio');
          setIsLoading(false);
        }}
        onCanPlay={() => {
          console.log('Audio can play');
          setIsLoading(false);
        }}
      />
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={currentAyah <= 1}
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handlePlayPause}
            disabled={isLoading}
            className={`w-12 h-12 rounded-full ${
              !audioEnabled ? 'bg-gray-600 hover:bg-gray-700' : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
            title={!audioEnabled ? 'Enable Audio' : (isPlaying ? 'Pause' : 'Play')}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : !audioEnabled ? (
              <Headphones className="w-5 h-5" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={currentAyah >= totalAyahs}
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant={loopMode !== 'none' ? 'default' : 'outline'}
              size="sm"
              onClick={handleLoopModeChange}
              className="flex items-center gap-1"
            >
              <Repeat className="w-4 h-4" />
              <span className="text-xs hidden sm:inline">
                {loopMode === 'none' ? 'No Loop' : loopMode === 'verse' ? 'Verse' : 'Surah'}
              </span>
            </Button>
            
            {loopMode !== 'none' && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-600 dark:text-gray-400">×{repeatCount}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepeatCount(Math.max(1, repeatCount - 1))}
                  className="w-6 h-6 p-0"
                >
                  -
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepeatCount(Math.min(10, repeatCount + 1))}
                  className="w-6 h-6 p-0"
                >
                  +
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20"
            />
          </div>
        </div>
      </div>
      
      <div className="text-center mt-2 text-sm text-gray-600 dark:text-gray-400">
        {!audioEnabled ? 'Audio Disabled - Click to Enable' : 
         `Ayah ${currentAyah} of ${totalAyahs} ${loopMode !== 'none' ? `(Repeat: ${currentRepeat + 1}/${repeatCount})` : ''}`}
      </div>
    </div>
  );
}