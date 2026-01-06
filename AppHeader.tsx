import React from 'react';
import { Menu, X, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { HifzToggle } from './HifzToggle';
import { FontSizeControl } from './FontSizeControl';
import { ThemeToggle } from './ThemeToggle';

interface AppHeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function AppHeader({ sidebarOpen, setSidebarOpen }: AppHeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-3">
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
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Hifz Al Quran
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <FontSizeControl />
          <HifzToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}