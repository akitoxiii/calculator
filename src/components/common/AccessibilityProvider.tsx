'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface AccessibilityContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  fontSize: number;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    // キーボードショートカットの設定
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + C: ハイコントラストモードの切り替え
      if (e.altKey && e.key === 'c') {
        setHighContrast(prev => !prev);
      }
      // Alt + Plus: フォントサイズ増加
      if (e.altKey && e.key === '+') {
        setFontSize(prev => Math.min(prev + 2, 24));
      }
      // Alt + Minus: フォントサイズ減少
      if (e.altKey && e.key === '-') {
        setFontSize(prev => Math.max(prev - 2, 12));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    // フォントサイズの適用
    document.documentElement.style.fontSize = `${fontSize}px`;
    // ハイコントラストモードの適用
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast, fontSize]);

  const value = {
    highContrast,
    toggleHighContrast: () => setHighContrast(prev => !prev),
    fontSize,
    increaseFontSize: () => setFontSize(prev => Math.min(prev + 2, 24)),
    decreaseFontSize: () => setFontSize(prev => Math.max(prev - 2, 12)),
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
} 