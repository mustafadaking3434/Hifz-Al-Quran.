import React, { useCallback } from 'react';
import { Mic, MicOff, Play, Trash2, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useRecording } from '../hooks/useRecording';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function HifzRecorder({ surahNumber, ayahNumber }: { surahNumber: number; ayahNumber: number }) {
  const { isRecording, recordings, recordingTime, startRecording, stopRecording, deleteRecording } = useRecording();
  const [showRecordings, setShowRecordings] = useLocalStorage('show-recordings', false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="w-5 h-5" />
            Hifz Recorder
          </CardTitle>
          <CardDescription>
            Record your recitation and get feedback on tajweed and pronunciation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 flex-wrap">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              className="flex items-center gap-2"
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              {isRecording ? `Recording... ${formatTime(recordingTime)}` : 'Start Recording'}
            </Button>
            
            {recordings.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setShowRecordings(!showRecordings)}
              >
                View Recordings ({recordings.length})
              </Button>
            )}
          </div>

          {isRecording && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm text-red-700 dark:text-red-300">
                  Recording in progress... Stay still and recite clearly
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {showRecordings && recordings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Recordings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recordings.map((recording) => (
                <div key={recording.id} className="p-3 border rounded-lg dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Surah {recording.surah}:{recording.ayah}</span>
                        {recording.score && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className={`font-bold ${getScoreColor(recording.score)}`}>
                              {recording.score}%
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        Duration: {formatTime(recording.duration)} • 
                        {new Date(recording.timestamp).toLocaleDateString()}
                      </div>
                      {recording.mistakes && recording.mistakes.length > 0 && (
                        <div className="mt-2 text-sm">
                          <span className="font-medium text-orange-600">Areas to improve:</span>
                          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                            {recording.mistakes.map((mistake, idx) => (
                              <li key={idx}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteRecording(recording.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}