import React, { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { Command } from 'cmdk';
import { useBrowser } from '@/hooks/useBrowser';

export default function CommandBar() {
  const [open, setOpen] = useState(false);
  const { navigate, reload, goBack, goForward } = useBrowser();

  useHotkeys('cmd+k', (e) => {
    e.preventDefault();
    setOpen(true);
  });

  useHotkeys('esc', () => {
    setOpen(false);
  });

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                 w-[600px] max-w-[90vw] rounded-xl bg-background-overlay backdrop-blur-md
                 border border-white/10 shadow-2xl"
    >
      <Command.Input
        placeholder="Type a command or search..."
        className="w-full bg-transparent border-none outline-none p-4 text-text-primary"
      />

      <Command.List className="border-t border-white/10 max-h-[300px] overflow-auto">
        <Command.Group heading="Navigation">
          <Command.Item onSelect={() => navigate('https://google.com')}>
            Go to Google
          </Command.Item>
          <Command.Item onSelect={goBack}>
            Go Back
          </Command.Item>
          <Command.Item onSelect={goForward}>
            Go Forward
          </Command.Item>
          <Command.Item onSelect={reload}>
            Reload Page
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Tools">
          <Command.Item onSelect={() => navigate('chrome://devtools')}>
            Open DevTools
          </Command.Item>
          <Command.Item onSelect={() => navigate('chrome://settings')}>
            Open Settings
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
} 