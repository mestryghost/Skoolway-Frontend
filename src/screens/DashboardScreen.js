import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import {
  DashboardWelcomeCard,
  DashboardMetricCards,
  DashboardChart,
  DashboardTasks,
  DashboardProfileCard,
  LiveTransport,
  RecentAlerts,
  SystemStatus,
} from '../components/dashboard';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function DashboardScreen() {
  const mainContent = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.grid}>
        <View style={styles.mainCol}>
          <DashboardWelcomeCard />
          <DashboardMetricCards />
          <DashboardChart />
          <DashboardTasks />
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>© {new Date().getFullYear()} Skoolway. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <Pressable><Text style={styles.footerLink}>Privacy Policy</Text></Pressable>
          <Pressable><Text style={styles.footerLink}>Terms of Service</Text></Pressable>
        </View>
      </View>
    </ScrollView>
  );

  const rightSidebar = (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <DashboardProfileCard />
      <LiveTransport />
      <RecentAlerts />
      <SystemStatus />
    </ScrollView>
  );

  return (
    <DashboardLayout activeNavKey="dashboard" rightSidebar={rightSidebar}>
      {mainContent}
    </DashboardLayout>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  mainCol: {
    flex: 1,
    minWidth: 320,
  },
  footer: {
    marginTop: 40,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  footerLinks: { flexDirection: 'row', gap: 16 },
  footerLink: { fontSize: 12, color: colors.textSecondary },
});
