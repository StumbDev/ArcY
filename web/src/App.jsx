import React from 'react';
import { BrowserProvider } from '@/contexts/BrowserContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MainLayout from '@/layouts/MainLayout';
import Browser from '@/components/Browser';
import CommandBar from '@/components/CommandBar';
import Sidebar from '@/components/Sidebar';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserProvider>
        <MainLayout>
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <CommandBar />
            <Browser />
          </div>
        </MainLayout>
      </BrowserProvider>
    </ThemeProvider>
  );
} 