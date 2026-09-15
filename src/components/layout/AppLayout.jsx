import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { BobDrawer } from './BobDrawer';
import { GridGuardChatbot } from '../GridGuardChatbot';

export const AppLayout = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0c0e12] text-zinc-100 font-sans">
      {/* Sidebar */}
      <Sidebar
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
      />

      {/* Main Content Column */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <Header
          mobileSidebarOpen={mobileSidebarOpen}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar bg-[#0b0f11]">
          {children}
        </main>
      </div>

      {/* GridGuard AI Chatbot Overlay Component */}
      <GridGuardChatbot />
    </div>
  );
};
