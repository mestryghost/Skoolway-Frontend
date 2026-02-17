import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const ROUTES = [
  { id: 'R-01', name: 'North', status: 'On Track', mins: 12 },
  { id: 'R-04', name: 'East', status: 'Delayed', mins: 25 },
  { id: 'R-09', name: 'West', status: 'On Track', mins: 5 },
];

export function LiveTransport() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Live Transport</Text>
        <Text style={styles.badge}>8/10 Active</Text>
      </View>
      {ROUTES.map((r) => (
        <View key={r.id} style={styles.row}>
          <Text style={styles.route}>{r.id} {r.name}</Text>
          <Text style={[styles.status, r.status === 'Delayed' && styles.statusDelayed]}>{r.status}, {r.mins} mins</Text>
        </View>
      ))}
      <Pressable style={styles.link}>
        <MaterialCommunityIcons name="map-marker" size={16} color={colors.primary} />
        <Text style={styles.linkText}>View Live Map</Text>
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
  badge: { fontSize: 12, fontWeight: '600', color: colors.success },
  row: { paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  route: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '500' },
  status: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  statusDelayed: { color: colors.danger },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  linkText: { fontSize: 14, fontWeight: '600', color: colors.primary },
});
