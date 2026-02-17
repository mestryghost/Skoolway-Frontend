import { useEffect, useRef } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { LandingScreen } from './LandingScreen';
import { LoginScreen } from './LoginScreen';
import { SignupScreen } from './SignupScreen';
import { OnboardingWizardScreen } from './OnboardingWizardScreen';
import { DashboardScreen } from './DashboardScreen';
import { StudentsScreen } from './StudentsScreen';
import { ParentsScreen } from './ParentsScreen';
import { TeachersScreen } from './TeachersScreen';
import { TransportScreen } from './TransportScreen';
import { AnalyticsScreen } from './AnalyticsScreen';
import { ManageScheduleScreen } from './ManageScheduleScreen';
import { ReportsScreen } from './ReportsScreen';
import { colors } from '../theme/colors';

export function RootScreen() {
  const { screen, goTo } = useNavigation();
  const { isAuthenticated, isTenantActive, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current || isLoading) return;
    hasRedirected.current = true;

    if (isAuthenticated && isTenantActive) {
      if (screen === 'landing' || screen === 'login' || screen === 'signup') {
        goTo('dashboard');
      }
    } else if (isAuthenticated && !isTenantActive) {
      if (screen !== 'onboarding-wizard' && screen !== 'login' && screen !== 'signup') {
        goTo('onboarding-wizard');
      }
    }
  }, [isLoading, isAuthenticated, isTenantActive, screen, goTo]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isAuthenticated && !isTenantActive) {
    return <OnboardingWizardScreen />;
  }

  if (isAuthenticated && isTenantActive) {
    if (screen === 'dashboard') return <DashboardScreen />;
    if (screen === 'students') return <StudentsScreen />;
    if (screen === 'parents') return <ParentsScreen />;
    if (screen === 'teachers') return <TeachersScreen />;
    if (screen === 'transport') return <TransportScreen />;
    if (screen === 'analytics') return <AnalyticsScreen />;
    if (screen === 'manage-schedule') return <ManageScheduleScreen />;
    if (screen === 'reports') return <ReportsScreen />;
    if (screen === 'landing') return <LandingScreen />;
    return <DashboardScreen />;
  }

  if (screen === 'login') return <LoginScreen />;
  if (screen === 'signup') return <SignupScreen />;
  return <LandingScreen />;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.pageBackground,
  },
});
