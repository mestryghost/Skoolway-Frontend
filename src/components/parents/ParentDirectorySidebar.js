import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const LIVE_FEED_ITEMS = [
  { name: 'Sarah J.', action: 'Updated emergency contact', time: '2 MINS AGO' },
  { name: 'Michael C.', action: 'Viewed report card', time: '5 MINS AGO' },
  { name: 'Elena R.', action: 'Responded to message', time: '12 MINS AGO' },
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ACTIVITY_HEIGHTS = [40, 55, 75, 60, 50, 35, 45]; // Heights for bar chart

export function ParentDirectorySidebar() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Parent Insights</Text>
        <Text style={styles.headerSubtitle}>System usage and engagement trends</Text>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
          <Text style={styles.metricValue}>1,240</Text>
          <Text style={styles.metricLabel}>TOTAL PARENTS</Text>
        </View>
        <View style={styles.metricCard}>
          <MaterialCommunityIcons name="check-circle-outline" size={24} color={colors.primary} />
          <Text style={styles.metricValue}>98%</Text>
          <Text style={styles.metricLabel}>RESPONSE RATE</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Weekly Portal Activity</Text>
        <View style={styles.chartContainer}>
          {WEEKDAYS.map((day, idx) => (
            <View key={day} style={styles.chartBarWrapper}>
              <View style={[styles.chartBar, { height: ACTIVITY_HEIGHTS[idx] }]} />
              <Text style={styles.chartLabel}>{day}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.liveFeedHeader}>
          <Text style={styles.cardTitle}>Live Feed</Text>
          <MaterialCommunityIcons name="chart-line-variant" size={18} color={colors.textSecondary} />
        </View>
        {LIVE_FEED_ITEMS.map((item, idx) => (
          <View key={idx} style={styles.feedItem}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} style={styles.feedIcon} />
            <View style={styles.feedContent}>
              <Text style={styles.feedText}>
                <Text style={styles.feedName}>{item.name}</Text> {item.action}
              </Text>
              <Text style={styles.feedTime}>{item.time}</Text>
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
  header: { marginBottom: 20 },
  headerTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  headerSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
  metricsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    backgroundColor: colors.dashboardWelcomeBg,
    borderRadius: radii.cardSmall,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricValue: { ...typography.h3, color: colors.textPrimary, marginTop: 8, marginBottom: 4 },
  metricLabel: { ...typography.small, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.5 },
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radii.cardSmall,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 16 },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 100,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  chartBar: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: { ...typography.small, color: colors.textSecondary },
  liveFeedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  feedItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  feedIcon: { marginRight: 8, marginTop: 2 },
  feedContent: { flex: 1 },
  feedText: { ...typography.bodySmall, color: colors.textPrimary },
  feedName: { fontWeight: '600' },
  feedTime: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
