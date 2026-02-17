import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ALERTS = [
  { id: 1, title: 'Morning Assembly Success', time: '2h ago', body: 'Parent participation exceeded 85%.' },
  { id: 2, title: 'Transport Alert: Route 4', time: '4h ago', body: 'Bus delay reported; parents notified.' },
  { id: 3, title: 'New Student Enrollment', time: '6h ago', body: 'Profile completed for Grade 3.' },
];

export function RecentAlerts() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Alerts</Text>
        <View style={styles.newBadge}>
          <Text style={styles.newBadgeText}>2 NEW</Text>
        </View>
      </View>
      {ALERTS.map((a) => (
        <View key={a.id} style={styles.row}>
          <Text style={styles.alertTitle}>{a.title}</Text>
          <Text style={styles.time}>{a.time}</Text>
          <Text style={styles.body}>{a.body}</Text>
        </View>
      ))}
      <Pressable style={styles.clear}>
        <Text style={styles.clearText}>Clear Notifications</Text>
      </Pressable>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { ...typography.h3, color: colors.textPrimary },
  newBadge: { backgroundColor: colors.badgeNew, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  newBadgeText: { fontSize: 11, fontWeight: '700', color: colors.white },
  row: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  alertTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '500' },
  time: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  body: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
  clear: { marginTop: 12 },
  clearText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
