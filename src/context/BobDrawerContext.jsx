import React, { createContext, useContext, useState } from 'react';
import { aiService } from '../services/aiService';

const BobDrawerContext = createContext(undefined);

export const BobDrawerProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageContext, setPageContext] = useState('Overview');
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState([]);

  const openDrawer = (context) => {
    if (context) setPageContext(context);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsOpen(false);
  };

  const toggleDrawer = (open, context) => {
    if (context) setPageContext(context);
    setIsOpen(prev => (open !== undefined ? open : !prev));
  };

  const sendMessage = async (prompt) => {
    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      contextTag: pageContext
    };

    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const response = await aiService.generateBobResponse(prompt, pageContext);
      setMessages(prev => [...prev, response]);
    } finally {
      setIsThinking(false);
    }
  };

  const openWithQuery = (query, context) => {
    if (context) setPageContext(context);
    setIsOpen(true);
    sendMessage(query);
  };

  const resetConversation = () => {
    setMessages([]);
  };

  return (
    <BobDrawerContext.Provider
      value={{
        isOpen,
        pageContext,
        messages,
        isThinking,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        openWithQuery,
        setPageContext,
        sendMessage,
        resetConversation
      }}
    >
      {children}
    </BobDrawerContext.Provider>
  );
};

export const useBobDrawer = () => {
  const context = useContext(BobDrawerContext);
  if (!context) {
    throw new Error('useBobDrawer must be used within a BobDrawerProvider');
  }
  return context;
};
