import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useEffect, useState } from 'react';
import { fetchRecentNotifications } from '../../api/notifications';

export function RecentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await fetchRecentNotifications({ limit: 3 });
        if (!isMounted) return;
        setAlerts(data.items || []);
      } catch {
        if (isMounted) setAlerts([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const newCount = alerts.filter((a) => !a.isRead).length;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Alerts</Text>
        {newCount > 0 && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>{newCount} NEW</Text>
          </View>
        )}
      </View>
      {alerts.map((a) => (
        <View key={a.id} style={styles.row}>
          <Text style={styles.alertTitle}>{a.title}</Text>
          <Text style={styles.time}>{new Date(a.createdAt).toLocaleString()}</Text>
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
