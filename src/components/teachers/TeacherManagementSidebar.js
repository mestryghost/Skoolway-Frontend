import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';
import { useEffect, useState } from 'react';
import { fetchRecentNotifications } from '../../api/notifications';

export function TeacherManagementSidebar() {
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await fetchRecentNotifications({ category: 'Teachers', limit: 3 });
        if (!isMounted) return;
        setActivity(data.items || []);
      } catch {
        if (isMounted) setActivity([]);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Recent Activity</Text>
        {activity.map((n) => (
          <View key={n.id} style={styles.activityItem}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.primary} style={styles.activityIcon} />
            <View style={styles.activityContent}>
              <Text style={styles.activityText}>{n.title}</Text>
              <Text style={styles.activityMeta}>{new Date(n.createdAt).toLocaleString()}</Text>
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
