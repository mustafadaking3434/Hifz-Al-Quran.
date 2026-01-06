import React from 'react';
import { Mic } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useLocalStorage } from '../hooks/useLocalStorage';

const reciters = [
  { id: 'ar.alafasy', name: 'Mishary Alafasy' },
  { id: '7', name: 'Mishary Alafasy (EveryAyah)' },
  { id: 'ar.abdulbaset', name: 'Abdul Basit' },
  { id: '3', name: 'Abdul Basit (EveryAyah)' },
  { id: 'ar.minshawi', name: 'Minshawy' },
  { id: '4', name: 'Minshawy (EveryAyah)' },
  { id: 'ar.hudhaify', name: 'Hudhaify' },
  { id: 'ar.husary', name: 'Husary' },
  { id: '5', name: 'Husary (EveryAyah)' },
  { id: 'ar.sudais', name: 'Sudais' },
  { id: 'ar.shuraim', name: 'Shuraim' },
];

export function ReciterSelector() {
  const [reciter, setReciter] = useLocalStorage('reciter', '7'); // Default to EveryAyah format

  return (
    <div className="flex items-center gap-2">
      <Mic className="w-4 h-4 text-gray-600 dark:text-gray-400" />
      <Select value={reciter} onValueChange={setReciter}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {reciters.map((r) => (
            <SelectItem key={r.id} value={r.id}>
              {r.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}