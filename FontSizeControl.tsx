import { Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';

export function FontSizeControl() {
  const [fontSizeArabic, setFontSizeArabic] = useLocalStorage('arabic-font-size', 24);

  const increaseFontSize = () => {
    setFontSizeArabic(Math.min(fontSizeArabic + 2, 48));
  };

  const decreaseFontSize = () => {
    setFontSizeArabic(Math.max(fontSizeArabic - 2, 18));
  };

  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="sm" onClick={decreaseFontSize}>
        <Minus className="w-4 h-4" />
      </Button>
      <span className="text-sm px-2 min-w-[50px] text-center">
        {fontSizeArabic}px
      </span>
      <Button variant="outline" size="sm" onClick={increaseFontSize}>
        <Plus className="w-4 h-4" />
      </Button>
    </div>
  );
}