import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const WORKLOAD_HEIGHTS = [50, 65, 80, 70, 55];

const INSIGHTS = [
  { icon: 'clock-outline', value: '98.4%', label: 'Teacher Attendance' },
  { icon: 'clock-outline', value: '02', label: 'Vacant Positions' },
  { icon: 'account-group', value: '05', label: 'Substitutes Active' },
];

const RECENT_ACTIVITY = [
  { text: 'Assigned Marcus Thorne to 10-A', meta: 'Admin • 10m ago', icon: 'plus' },
  { text: 'Updated Syllabus for 12-A', meta: 'Sarah J. • 1h ago', icon: 'clock-outline' },
  { text: 'Generated Monthly Payroll', meta: 'System • 3h ago', icon: 'clock-outline' },
];

export function TeacherManagementSidebar() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Staff Workload</Text>
        <Text style={styles.cardSubtitle}>Average weekly teaching hours</Text>
        <View style={styles.chartContainer}>
          {WEEKDAYS.map((day, idx) => (
            <View key={day} style={styles.chartBarWrapper}>
              <View style={[styles.chartBar, { height: WORKLOAD_HEIGHTS[idx] }]} />
              <Text style={styles.chartLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Quick Insights</Text>
        {INSIGHTS.map((insight) => (
          <View key={insight.label} style={styles.insightCard}>
            <MaterialCommunityIcons name={insight.icon} size={20} color={colors.primary} />
            <Text style={styles.insightValue}>{insight.value}</Text>
            <Text style={styles.insightLabel}>{insight.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        {RECENT_ACTIVITY.map((item, idx) => (
          <View key={idx} style={styles.activityItem}>
            <MaterialCommunityIcons name={item.icon} size={18} color={colors.primary} style={styles.activityIcon} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{item.text}</Text>
              <Text style={styles.activityMeta}>{item.meta}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.gutter, paddingBottom: 48 },
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radii.cardSmall,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { ...typography.small, color: colors.textSecondary, marginBottom: 16 },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  chartBarWrapper: { flex: 1, alignItems: 'center', marginHorizontal: 2 },
  chartBar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: { ...typography.small, color: colors.textSecondary },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.dashboardWelcomeBg,
    borderRadius: radii.cardSmall,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  insightValue: { ...typography.body, fontWeight: '700', color: colors.primary },
  insightLabel: { ...typography.small, color: colors.textSecondary, marginLeft: 'auto' },
  activityItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  activityIcon: { marginRight: 10, marginTop: 2 },
  activityContent: { flex: 1 },
  activityText: { ...typography.bodySmall, color: colors.textPrimary },
  activityMeta: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
