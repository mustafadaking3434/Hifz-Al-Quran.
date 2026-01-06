import React from 'react';
import { BookOpen, Heart, Calendar, Clock, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useLocalStorage } from '../hooks/useLocalStorage';

type TabType = 'quran' | 'duas' | 'hadith' | 'prayer';

interface NavigationTabsProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function NavigationTabs({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }: NavigationTabsProps) {
  const tabs = [
    { id: 'quran' as TabType, label: 'Quran', icon: BookOpen },
    { id: 'duas' as TabType, label: 'Duas', icon: Heart },
    { id: 'hadith' as TabType, label: 'Hadith', icon: BookOpen },
    { id: 'prayer' as TabType, label: 'Prayer', icon: Clock },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}