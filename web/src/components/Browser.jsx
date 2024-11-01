import React from 'react';
import { useBrowser } from '@/hooks/useBrowser';
import { motion, AnimatePresence } from 'framer-motion';
import { IoReload, IoArrowBack, IoArrowForward } from 'react-icons/io5';

export default function Browser() {
  const {
    currentUrl,
    isLoading,
    goBack,
    goForward,
    reload,
    canGoBack,
    canGoForward
  } = useBrowser();

  return (
    <div className="flex-1 flex flex-col bg-background-main">
      <div className="browser-controls flex items-center gap-2 p-2 bg-background-secondary">
        <button
          onClick={goBack}
          disabled={!canGoBack}
          className="nav-button"
          aria-label="Go back"
        >
          <IoArrowBack />
        </button>
        
        <button
          onClick={goForward}
          disabled={!canGoForward}
          className="nav-button"
          aria-label="Go forward"
        >
          <IoArrowForward />
        </button>
        
        <button
          onClick={reload}
          className="nav-button"
          aria-label="Reload page"
        >
          <IoReload className={isLoading ? 'animate-spin' : ''} />
        </button>
        
        <div className="url-display flex-1 px-4 py-2 bg-background-overlay rounded-lg">
          {currentUrl}
        </div>
      </div>

      <div className="browser-content flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentUrl}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <webview
              src={currentUrl}
              className="w-full h-full"
              allowpopups="true"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
} 