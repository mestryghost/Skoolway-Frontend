import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const DRIVERS = [
  { name: 'Robert Fox', route: 'Route 102' },
  { name: 'Jane Doe', route: 'Route 104' },
  { name: 'Mike Smith', route: 'Standby' },
  { name: 'Anna Lee', route: 'Route 108' },
];

export function TransportSidebar() {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>On-Duty Drivers</Text>
          <Pressable><MaterialCommunityIcons name="plus" size={20} color={colors.primary} /></Pressable>
        </View>
        {DRIVERS.map((d, i) => (
          <View key={i} style={styles.driverRow}>
            <View style={styles.driverAvatar} />
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>{d.name}</Text>
              <Text style={styles.driverRoute}>{d.route}</Text>
            </View>
            <Pressable style={styles.contactBtn}>
              <Text style={styles.contactBtnText}>Contact</Text>
            </Pressable>
          </View>
        ))}
        <Pressable style={styles.viewAllBtn}>
          <Text style={styles.viewAllBtnText}>View All Drivers</Text>
        </Pressable>
      </View>

      <View style={styles.alertCard}>
        <MaterialCommunityIcons name="alert-circle" size={24} color={colors.danger} style={styles.alertIcon} />
        <Text style={styles.alertText}>Critical Alert Bus #204 reported engine temperature warning near West Sector.</Text>
        <Pressable style={styles.alertLink}>
          <Text style={styles.alertLinkText}>Review Diagnostics</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.gutter, paddingBottom: 48 },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  driverRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  driverAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.borderSubtle, marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  driverRoute: { ...typography.small, color: colors.textSecondary },
  contactBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.dashboardWelcomeBg },
  contactBtnText: { ...typography.small, color: colors.primary, fontWeight: '500' },
  viewAllBtn: { marginTop: 8, paddingVertical: 8 },
  viewAllBtnText: { ...typography.bodySmall, color: colors.primary, fontWeight: '500' },
  alertCard: {
    backgroundColor: '#FEE2E2',
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  alertIcon: { marginBottom: 8 },
  alertText: { ...typography.bodySmall, color: colors.textPrimary, marginBottom: 12 },
  alertLink: {},
  alertLinkText: { ...typography.bodySmall, color: colors.danger, fontWeight: '600' },
});
