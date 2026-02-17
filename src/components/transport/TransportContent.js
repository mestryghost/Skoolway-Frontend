import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const BUSES = [
  { id: '102', route: 'North Highlands', occupancy: 75, driver: 'Robert Fox', status: 'active' },
  { id: '104', route: 'East Valley', occupancy: 60, driver: 'Jane Doe', status: 'delayed' },
  { id: '106', route: 'South Central', occupancy: 90, driver: 'Mike Smith', status: 'active' },
  { id: '108', route: 'West Park', occupancy: 45, driver: 'Anna Lee', status: 'idle' },
  { id: '204', route: 'Downtown Loop', occupancy: 88, driver: 'Chris Brown', status: 'active' },
  { id: '210', route: 'Campus Express', occupancy: 72, driver: 'Sam Wilson', status: 'active' },
];

const INCIDENTS = [
  { vehicle: 'Bus #204', time: 'Logged 2h ago', type: 'DELAY', description: 'Traffic congestion on High St.' },
  { vehicle: 'Bus #104', time: 'Logged 4h ago', type: 'MAINTENANCE', description: 'Scheduled brake inspection.' },
  { vehicle: 'Bus #108', time: 'Logged 5h ago', type: 'REROUTE', description: 'Road closure on Oak Ave.' },
];

function BusStatusPill({ status }) {
  const isActive = status === 'active';
  const isDelayed = status === 'delayed';
  const bg = isActive ? colors.success : isDelayed ? colors.danger : colors.statusOnLeave;
  const label = status === 'active' ? 'active' : status === 'delayed' ? 'delayed' : 'idle';
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={styles.statusPillText}>{label}</Text>
    </View>
  );
}

function BusCard({ bus }) {
  return (
    <View style={styles.busCard}>
      <View style={styles.busCardHeader}>
        <Text style={styles.busId}>Bus #{bus.id}</Text>
        <BusStatusPill status={bus.status} />
      </View>
      <MaterialCommunityIcons name="bus" size={24} color={colors.primary} style={styles.busIcon} />
      <Text style={styles.busRoute}>Route: {bus.route}</Text>
      <View style={styles.occupancyRow}>
        <Text style={styles.occupancyLabel}>Occupancy</Text>
        <View style={styles.occupancyBarBg}>
          <View style={[styles.occupancyBarFill, { width: `${bus.occupancy}%` }]} />
        </View>
        <Text style={styles.occupancyValue}>{bus.occupancy}%</Text>
      </View>
      <View style={styles.driverRow}>
        <View style={styles.driverAvatar} />
        <Text style={styles.driverName}>{bus.driver}</Text>
        <Pressable style={styles.contactIconBtn}>
          <MaterialCommunityIcons name="phone-outline" size={18} color={colors.primary} />
        </Pressable>
      </View>
    </View>
  );
}

export function TransportContent() {
  const [activeTab, setActiveTab] = useState('fleet');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={styles.topRow}>
        <View style={styles.operationalBanner}>
          <Text style={styles.operationalLabel}>Operational Status: Normal</Text>
          <Text style={styles.operationalTitle}>Streamline Your School Transit Operations</Text>
          <Text style={styles.operationalDesc}>
            Monitor 24 active buses, manage 14 optimized routes, and ensure the safety of 420 students in real-time.
          </Text>
          <View style={styles.operationalActions}>
            <Pressable style={styles.operationalBtnPrimary}>
              <Text style={styles.operationalBtnPrimaryText}>View Daily Log</Text>
            </Pressable>
            <Pressable style={styles.operationalBtnSecondary}>
              <Text style={styles.operationalBtnSecondaryText}>Download Report</Text>
            </Pressable>
          </View>
          <View style={styles.busIllustration}>
            <MaterialCommunityIcons name="bus-side" size={80} color="rgba(255,255,255,0.25)" />
          </View>
        </View>
        <View style={styles.fleetMetricsCard}>
          <View style={styles.fleetMetricsHeader}>
            <Text style={styles.fleetMetricsTitle}>Fleet Metrics</Text>
            <Pressable><MaterialCommunityIcons name="dots-vertical" size={20} color={colors.textSecondary} /></Pressable>
          </View>
          <View style={styles.gaugeWrapper}>
            <View style={styles.gaugeCircle}>
              <View style={styles.gaugeInner}>
                <View style={styles.gaugeAvatar} />
                <Text style={styles.gaugePercent}>85%</Text>
                <MaterialCommunityIcons name="arrow-up" size={14} color={colors.success} />
              </View>
            </View>
            <Text style={styles.gaugeLabel}>Daily Avg 85%</Text>
          </View>
          <Text style={styles.gaugeSummary}>Great performance, Jackson! Your fleet's on-time arrivals are up 12% from last week.</Text>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>On-time</Text>
            <View style={styles.breakdownBarBg}><View style={[styles.breakdownBarFill, styles.breakdownBarGreen, { width: '85%' }]} /></View>
            <Text style={styles.breakdownValue}>85%</Text>
          </View>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Delayed</Text>
            <View style={styles.breakdownBarBg}><View style={[styles.breakdownBarFill, styles.breakdownBarRed, { width: '15%' }]} /></View>
            <Text style={styles.breakdownValue}>15%</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabs}>
        <Pressable style={[styles.tab, activeTab === 'fleet' && styles.tabActive]} onPress={() => setActiveTab('fleet')}>
          <MaterialCommunityIcons name="bus" size={18} color={activeTab === 'fleet' ? colors.white : colors.textPrimary} />
          <Text style={[styles.tabText, activeTab === 'fleet' && styles.tabTextActive]}>Fleet Management</Text>
        </Pressable>
        <Pressable style={[styles.tab, activeTab === 'tracker' && styles.tabActive]} onPress={() => setActiveTab('tracker')}>
          <MaterialCommunityIcons name="map-marker-path" size={18} color={activeTab === 'tracker' ? colors.white : colors.textPrimary} />
          <Text style={[styles.tabText, activeTab === 'tracker' && styles.tabTextActive]}>Live Tracker</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderSpacer} />
          <View style={styles.sectionActions}>
            <Pressable style={styles.btnSecondary}>
              <MaterialCommunityIcons name="filter-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.btnSecondaryText}>Filter</Text>
            </Pressable>
            <Pressable style={styles.btnPrimary}>
              <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
              <Text style={styles.btnPrimaryText}>Add Route</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.busGrid}>
          {BUSES.map((bus) => (
            <BusCard key={bus.id} bus={bus} />
          ))}
        </View>
        <Pressable style={styles.viewAllLink}>
          <Text style={styles.viewAllLinkText}>View All Vehicles</Text>
          <MaterialCommunityIcons name="arrow-right" size={16} color={colors.primary} />
        </Pressable>
      </View>

      <View style={styles.incidentCard}>
        <View style={styles.incidentHeader}>
          <Text style={styles.incidentTitle}>Incident Log</Text>
          <Pressable><Text style={styles.incidentSeeAll}>See all</Text></Pressable>
        </View>
        <View style={styles.incidentTable}>
          <View style={styles.incidentTableHeader}>
            <Text style={styles.incidentTh}>VEHICLE</Text>
            <Text style={styles.incidentTh}>TYPE</Text>
            <Text style={styles.incidentTh}>DESCRIPTION</Text>
            <Text style={styles.incidentTh}>ACTION</Text>
          </View>
          {INCIDENTS.map((inc, i) => (
            <View key={i} style={styles.incidentRow}>
              <View style={styles.incidentVehicle}>
                <MaterialCommunityIcons name="bus" size={16} color={colors.textSecondary} />
                <View>
                  <Text style={styles.incidentBusNum}>{inc.vehicle}</Text>
                  <Text style={styles.incidentTime}>{inc.time}</Text>
                </View>
              </View>
              <View style={styles.incidentTypePill}><Text style={styles.incidentTypeText}>{inc.type}</Text></View>
              <Text style={styles.incidentDesc}>{inc.description}</Text>
              <Pressable><MaterialCommunityIcons name="open-in-new" size={18} color={colors.primary} /></Pressable>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  topRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  operationalBanner: {
    flex: 1,
    minWidth: 280,
    backgroundColor: colors.primary,
    borderRadius: radii.card,
    borderTopRightRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  operationalLabel: { ...typography.small, color: 'rgba(255,255,255,0.9)', marginBottom: 8 },
  operationalTitle: { ...typography.h3, color: colors.white, fontWeight: '700', marginBottom: 8 },
  operationalDesc: { ...typography.bodySmall, color: 'rgba(255,255,255,0.9)', marginBottom: 20 },
  operationalActions: { flexDirection: 'row', gap: 12 },
  operationalBtnPrimary: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.white },
  operationalBtnPrimaryText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  operationalBtnSecondary: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: 'rgba(255,255,255,0.2)' },
  operationalBtnSecondaryText: { ...typography.bodySmall, color: colors.white },
  busIllustration: { position: 'absolute', right: 16, bottom: 16 },
  fleetMetricsCard: {
    width: 280,
    minWidth: 260,
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  fleetMetricsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  fleetMetricsTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  gaugeWrapper: { alignItems: 'center', marginBottom: 12 },
  gaugeCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 8, borderColor: colors.success, alignItems: 'center', justifyContent: 'center' },
  gaugeInner: { alignItems: 'center' },
  gaugeAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.borderSubtle, marginBottom: 4 },
  gaugePercent: { ...typography.h3, color: colors.textPrimary },
  gaugeLabel: { ...typography.small, color: colors.textSecondary, marginTop: 4 },
  gaugeSummary: { ...typography.small, color: colors.textSecondary, marginBottom: 16 },
  breakdownRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  breakdownLabel: { width: 60, ...typography.small, color: colors.textSecondary },
  breakdownBarBg: { flex: 1, height: 8, backgroundColor: colors.inputBackground, borderRadius: 4, overflow: 'hidden' },
  breakdownBarFill: { height: '100%', borderRadius: 4 },
  breakdownBarGreen: { backgroundColor: colors.success },
  breakdownBarRed: { backgroundColor: colors.danger },
  breakdownValue: { width: 32, ...typography.small, color: colors.textPrimary, textAlign: 'right' },
  tabs: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  tab: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textPrimary },
  tabTextActive: { color: colors.white },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  sectionHeaderSpacer: { flex: 1 },
  sectionActions: { flexDirection: 'row', gap: 8 },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle },
  btnSecondaryText: { ...typography.bodySmall, color: colors.textPrimary },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.primary },
  btnPrimaryText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
  busGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 12 },
  busCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: '48%',
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  busCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  busId: { ...typography.bodySmall, fontWeight: '700', color: colors.textPrimary },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
  statusPillText: { fontSize: 11, fontWeight: '600', color: colors.white },
  busIcon: { marginBottom: 8 },
  busRoute: { ...typography.small, color: colors.textSecondary, marginBottom: 12 },
  occupancyRow: { marginBottom: 12 },
  occupancyLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 4 },
  occupancyBarBg: { height: 8, backgroundColor: colors.inputBackground, borderRadius: 4, overflow: 'hidden', marginBottom: 4 },
  occupancyBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  occupancyValue: { ...typography.small, color: colors.textPrimary },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  driverAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.borderSubtle },
  driverName: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  contactIconBtn: { padding: 4 },
  viewAllLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewAllLinkText: { ...typography.bodySmall, color: colors.primary, fontWeight: '500' },
  incidentCard: { backgroundColor: colors.white, borderRadius: radii.cardSmall, padding: 16, borderWidth: 1, borderColor: colors.borderSubtle },
  incidentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  incidentTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  incidentSeeAll: { ...typography.bodySmall, color: colors.primary },
  incidentTable: {},
  incidentTableHeader: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  incidentTh: { flex: 1, ...typography.small, color: colors.textSecondary, fontWeight: '600' },
  incidentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  incidentVehicle: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  incidentBusNum: { ...typography.bodySmall, color: colors.textPrimary },
  incidentTime: { ...typography.small, color: colors.textSecondary },
  incidentTypePill: { flex: 0.8, paddingVertical: 4, paddingHorizontal: 8, borderRadius: radii.pill, backgroundColor: colors.primary },
  incidentTypeText: { fontSize: 11, fontWeight: '600', color: colors.white },
  incidentDesc: { flex: 1.2, ...typography.bodySmall, color: colors.textSecondary },
});
