import React from 'react';
import { useBrowser } from '@/hooks/useBrowser';
import { motion } from 'framer-motion';
import { IoAdd, IoSettings, IoBookmarks } from 'react-icons/io5';

export default function Sidebar() {
  const { tabs, activeTab, addTab, closeTab, setActiveTab } = useBrowser();

  return (
    <div className="w-[72px] h-screen bg-background-secondary border-r border-white/10
                    flex flex-col items-center py-4">
      <button
        onClick={addTab}
        className="w-10 h-10 rounded-full bg-accent-primary hover:bg-accent-hover
                   flex items-center justify-center text-white mb-6"
      >
        <IoAdd size={24} />
      </button>

      <div className="flex-1 overflow-auto w-full">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full aspect-square p-2 relative group ${
              activeTab === tab.id ? 'bg-white/10' : ''
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src={tab.favicon || '/default-favicon.png'}
              alt={tab.title}
              className="w-full h-full rounded-md object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500
                         text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </motion.button>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <button className="sidebar-button">
          <IoBookmarks size={24} />
        </button>
        <button className="sidebar-button">
          <IoSettings size={24} />
        </button>
      </div>
    </div>
  );
} 