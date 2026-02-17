import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DATA = [
  { day: 'Mon', pct: 96 },
  { day: 'Tue', pct: 98 },
  { day: 'Wed', pct: 94 },
  { day: 'Thu', pct: 97 },
  { day: 'Fri', pct: 95 },
  { day: 'Sat', pct: 62 },
];
const MAX = 100;

export function DashboardChart() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Weekly Attendance Trend</Text>
          <Text style={styles.subtitle}>Percentage of daily active students</Text>
        </View>
        <Text style={styles.menu}>⋮</Text>
      </View>
      <View style={styles.chart}>
        {DATA.map((d) => (
          <View key={d.day} style={styles.barWrap}>
            <View style={[styles.bar, { height: `${d.pct}%` }]} />
            <Text style={styles.barLabel}>{d.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  title: { ...typography.h3, color: colors.textPrimary },
  subtitle: { ...typography.small, color: colors.textSecondary, marginTop: 4 },
  menu: { fontSize: 18, color: colors.textSecondary },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 160,
  },
  barWrap: { flex: 1, alignItems: 'center', marginHorizontal: 4 },
  bar: {
    width: '70%',
    minHeight: 8,
    backgroundColor: colors.chartBar,
    borderRadius: 4,
    marginBottom: 8,
  },
  barLabel: { fontSize: 12, color: colors.textSecondary },
});
