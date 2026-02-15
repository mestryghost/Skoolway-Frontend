import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext(null);

export function NavigationProvider({ children }) {
  const [screen, setScreen] = useState('landing');

  const goTo = (nextScreen) => {
    setScreen(nextScreen);
  };

  return (
    <NavigationContext.Provider value={{ screen, goTo }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
