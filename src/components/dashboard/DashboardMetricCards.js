import { StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const METRICS = [
  { label: 'Total Students', value: '1,284', trend: '+4.2%', up: true, icon: 'account-group', iconColor: colors.primary },
  { label: 'Teachers', value: '86', trend: '+1.5%', up: true, icon: 'school', iconColor: colors.primary },
  { label: 'Avg. Attendance', value: '94.2%', trend: '-0.8%', up: false, icon: 'clock-outline', iconColor: colors.textSecondary },
  { label: 'Transport Fleet', value: '12 Units', trend: 'Stable', up: null, icon: 'bus', iconColor: colors.primary },
];

export function DashboardMetricCards() {
  return (
    <View style={styles.wrapper}>
      {METRICS.map((m) => (
        <View key={m.label} style={styles.card}>
          <MaterialCommunityIcons name={m.icon} size={24} color={m.iconColor} style={styles.icon} />
          <Text style={styles.value}>{m.value}</Text>
          <Text style={styles.label}>{m.label}</Text>
          <Text style={[styles.trend, m.up === true && styles.trendUp, m.up === false && styles.trendDown]}>
            {m.trend}
          </Text>
        </View>
      ))}
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
});
