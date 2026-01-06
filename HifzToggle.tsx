import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function HifzToggle() {
  const [hifzMode, setHifzMode] = useLocalStorage('hifz-mode', false);

  return (
    <Button
      variant={hifzMode ? "default" : "outline"}
      onClick={() => setHifzMode(!hifzMode)}
      className="flex items-center gap-2"
      title={hifzMode ? "Disable Hifz Mode" : "Enable Hifz Mode"}
    >
      {hifzMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      <span className="hidden sm:inline">Hifz</span>
    </Button>
  );
}