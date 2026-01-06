import { useState, useRef, useCallback } from 'react';
import { Recording } from '../types/Quran';

export function useRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Simulate recording analysis
        const newRecording: Recording = {
          id: Date.now().toString(),
          surah: 1, // Would be passed as parameter
          ayah: 1,  // Would be passed as parameter
          timestamp: Date.now(),
          duration: recordingTime,
          score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
          mistakes: generateMockMistakes(),
        };

        setRecordings(prev => [...prev, newRecording]);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        URL.revokeObjectURL(url);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Please allow microphone access to use recording feature');
    }
  }, [recordingTime]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  const deleteRecording = useCallback((id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  }, []);

  const clearAllRecordings = useCallback(() => {
    setRecordings([]);
  }, []);

  return {
    isRecording,
    recordings,
    recordingTime,
    startRecording,
    stopRecording,
    deleteRecording,
    clearAllRecordings,
  };
}

function generateMockMistakes(): string[] {
  const mistakes = [
    'Pronunciation of "ع" needs improvement',
    'Length of "مـد" could be longer',
    'Ghunnah on "ن" should be 2 beats',
    'Qalqalah on "ق" needs emphasis',
    'Ikhfa pronunciation needs practice',
  ];
  
  const numMistakes = Math.floor(Math.random() * 3);
  return mistakes.slice(0, numMistakes);
}