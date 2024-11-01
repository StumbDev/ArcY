import React, { createContext, useState, useCallback } from 'react';
import { nanoid } from 'nanoid';

export const BrowserContext = createContext(null);

export function BrowserProvider({ children }) {
  const [tabs, setTabs] = useState([
    { id: 'default', url: 'https://google.com', title: 'New Tab', favicon: null }
  ]);
  const [activeTab, setActiveTab] = useState('default');
  const [isLoading, setIsLoading] = useState(false);

  const addTab = useCallback(() => {
    const newTab = {
      id: nanoid(),
      url: 'https://google.com',
      title: 'New Tab',
      favicon: null
    };
    setTabs(prev => [...prev, newTab]);
    setActiveTab(newTab.id);
  }, []);

  const closeTab = useCallback((tabId) => {
    setTabs(prev => prev.filter(tab => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveTab(tabs[0]?.id);
    }
  }, [activeTab, tabs]);

  const navigate = useCallback((url) => {
    setTabs(prev => prev.map(tab => 
      tab.id === activeTab ? { ...tab, url } : tab
    ));
    setIsLoading(true);
  }, [activeTab]);

  const value = {
    tabs,
    activeTab,
    isLoading,
    setActiveTab,
    addTab,
    closeTab,
    navigate,
    setIsLoading
  };

  return (
    <BrowserContext.Provider value={value}>
      {children}
    </BrowserContext.Provider>
  );
} 