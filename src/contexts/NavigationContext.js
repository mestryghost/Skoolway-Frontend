import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const NavigationContext = createContext(null);

const SCREEN_TO_PATH = {
  landing: '/',
  login: '/login',
  signup: '/signup',
  'onboarding-wizard': '/onboarding',
  dashboard: '/dashboard',
  students: '/students',
  parents: '/parents',
  teachers: '/teachers',
  transport: '/transport',
  analytics: '/analytics',
  'manage-schedule': '/schedule',
  reports: '/reports',
  'student-profile': '/students/profile',
  'teacher-profile': '/teachers/profile',
};

const PATH_TO_SCREEN = Object.fromEntries(
  Object.entries(SCREEN_TO_PATH).map(([screen, path]) => [path, screen])
);

function getScreenFromPath() {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return 'landing';
  const path = window.location.pathname;
  return PATH_TO_SCREEN[path] || 'landing';
}

export function NavigationProvider({ children }) {
  const [screen, setScreen] = useState(() => getScreenFromPath());
  const [onboardingTenantId, setOnboardingTenantId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handlePopState = () => {
      const newScreen = getScreenFromPath();
      setScreen(newScreen);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goTo = (nextScreen, options = {}) => {
    setScreen(nextScreen);
    if (options.tenantId !== undefined) setOnboardingTenantId(options.tenantId);
    if (options.studentId !== undefined) setStudentId(options.studentId);
    if (options.teacherId !== undefined) setTeacherId(options.teacherId);

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const path = SCREEN_TO_PATH[nextScreen] || '/';
      window.history.pushState({ screen: nextScreen }, '', path);
    }
  };

  return (
    <NavigationContext.Provider value={{ screen, goTo, onboardingTenantId, setOnboardingTenantId, studentId, setStudentId, teacherId, setTeacherId }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
}
