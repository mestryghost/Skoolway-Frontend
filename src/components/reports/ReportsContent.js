import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const PLACEHOLDER_REPORTS = [
  { id: 1, title: 'Daily attendance summary', time: 'Today, 8:00 AM', icon: 'account-check' },
  { id: 2, title: 'Transport on-time report', time: 'Today, 7:30 AM', icon: 'bus-clock' },
  { id: 3, title: 'Late arrivals', time: 'Yesterday', icon: 'clock-alert-outline' },
  { id: 4, title: 'Weekly academic snapshot', time: 'Last week', icon: 'chart-line' },
];

export function ReportsContent() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Reports' }]} />
      <Text style={styles.title}>Reports</Text>
      <Text style={styles.description}>Daily and periodic reports for the chief administrator.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Daily Report</Text>
        <Text style={styles.cardSubtitle}>Notification-style updates and summaries.</Text>
        {PLACEHOLDER_REPORTS.map((r) => (
          <View key={r.id} style={styles.reportRow}>
            <View style={styles.reportIconWrap}>
              <MaterialCommunityIcons name={r.icon} size={20} color={colors.primary} />
            </View>
            <View style={styles.reportBody}>
              <Text style={styles.reportTitle}>{r.title}</Text>
              <Text style={styles.reportTime}>{r.time}</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.textSecondary} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  breadcrumb: { ...typography.small, color: colors.textSecondary, marginBottom: 8 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 24 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 20 },
  reportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  reportIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.dashboardWelcomeBg, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  reportBody: { flex: 1 },
  reportTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  reportTime: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
