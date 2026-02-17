import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useEffect, useState } from 'react';
import { fetchDashboardSummary } from '../../api/dashboard';

const METRIC_CONFIG = [
  { key: 'totalStudents', label: 'Total Students', icon: 'account-group', color: colors.primary },
  { key: 'totalTeachers', label: 'Teachers', icon: 'school', color: colors.primary },
  { key: 'avgAttendance', label: 'Avg. Attendance', icon: 'clock-outline', color: colors.textSecondary },
  { key: 'transportFleet', label: 'Transport Fleet', icon: 'bus', color: colors.primary },
];

export function DashboardMetricCards() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchDashboardSummary();
        if (!isMounted) return;
        setSummary(data);
      } catch {
        if (isMounted) setSummary(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const avgAttendance =
    summary && summary.totalStudents > 0
      ? `${Math.round(((summary.activeStudents ?? 0) / summary.totalStudents) * 1000) / 10}%`
      : '—';

  return (
    <View style={styles.wrapper}>
      {METRIC_CONFIG.map((m) => {
        let value = '—';
        let trend = '';
        let up = null;

        if (!loading && summary) {
          if (m.key === 'totalStudents') value = String(summary.totalStudents ?? 0);
          if (m.key === 'totalTeachers') value = String(summary.totalTeachers ?? 0);
          if (m.key === 'avgAttendance') value = avgAttendance;
          if (m.key === 'transportFleet') value = '—'; // backend not wired yet
        }

        return (
          <View key={m.label} style={styles.card}>
            <MaterialCommunityIcons name={m.icon} size={24} color={m.color} style={styles.icon} />
            {loading && !summary ? (
              <View style={styles.skeletonBar} />
            ) : (
              <>
                <Text style={styles.value}>{value}</Text>
                <Text style={styles.label}>{m.label}</Text>
                <Text style={styles.trend}>{trend}</Text>
              </>
            )}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.cardSurface,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  icon: { marginBottom: 8 },
  value: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  label: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 4 },
  trend: { fontSize: 12, color: colors.textSecondary },
  trendUp: { color: colors.success },
  trendDown: { color: colors.danger },
  skeletonBar: { height: 14, borderRadius: 6, backgroundColor: colors.inputBackground, marginBottom: 6, width: '60%' },
});
