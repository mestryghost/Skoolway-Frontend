import { useNavigation } from '../contexts/NavigationContext';
import { LandingScreen } from './LandingScreen';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';

export function RootScreen() {
  const { screen } = useNavigation();

  if (screen === 'login') return <LoginScreen />;
  if (screen === 'signup') return <SignupScreen />;
  return <LandingScreen />;
}
