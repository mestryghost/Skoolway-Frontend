import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const METRICS = [
  { title: 'Avg. Academic Score', value: '84.2%', trend: '5.2% vs last term', up: true, icon: 'book-open-variant' },
  { title: 'Daily Attendance', value: '94.8%', trend: '1.4% current semester', up: false, icon: 'account-group' },
  { title: 'Active Teachers', value: '124', trend: '0.8% 4 on leave', up: false, icon: 'school' },
  { title: 'Transport Efficiency', value: '91.0%', trend: '3.1% on-time rate', up: true, icon: 'bus' },
];

const TEACHERS = [
  { name: 'Dr. Sarah Wilson', title: 'Head of Dept', department: 'Mathematics', score: 94, trend: 'Improving' },
  { name: 'Marcus Thorne', title: 'Senior Faculty', department: 'Physics', score: 88, trend: 'Stable' },
  { name: 'Elena Rodriguez', title: 'Senior Faculty', department: 'English', score: 92, trend: 'Improving' },
  { name: 'Dr. James Chen', title: 'Head of Dept', department: 'History', score: 90, trend: 'Stable' },
  { name: 'Marcus Rodriguez', title: 'Faculty', department: 'Biology', score: 76, trend: 'Action Needed' },
];

const ROUTES = [
  { name: 'Route A', onTime: 92, delayed: 8 },
  { name: 'Route B', onTime: 88, delayed: 12 },
  { name: 'Route C', onTime: 65, delayed: 35 },
  { name: 'Route D', onTime: 95, delayed: 5 },
  { name: 'Route E', onTime: 90, delayed: 10 },
];

const GRADE_ATTENDANCE = [
  { grade: 'Grade 9', pct: 94, color: '#F59E0B' },
  { grade: 'Grade 10', pct: 88, color: '#3B82F6' },
  { grade: 'Grade 11', pct: 92, color: '#10B981' },
  { grade: 'Grade 12', pct: 96, color: '#EAB308' },
];

export function AnalyticsContent() {
  const [activeTab, setActiveTab] = useState('academic');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Analytics' }]} />
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Analytics & Insights</Text>
          <Text style={styles.subtitle}>Comprehensive school-wide performance and operational data.</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable style={styles.btnSecondary}>
            <MaterialCommunityIcons name="filter-outline" size={18} color={colors.textPrimary} />
            <Text style={styles.btnSecondaryText}>Filters</Text>
          </Pressable>
          <Pressable style={styles.btnPrimary}>
            <MaterialCommunityIcons name="download-outline" size={18} color={colors.white} />
            <Text style={styles.btnPrimaryText}>Export Report</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.metricsRow}>
        {METRICS.map((m) => (
          <View key={m.title} style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <MaterialCommunityIcons name={m.icon} size={20} color={colors.primary} />
            </View>
            <Text style={styles.metricValue}>{m.value}</Text>
            <View style={styles.metricTrendRow}>
              <MaterialCommunityIcons name={m.up ? 'trending-up' : 'trending-down'} size={14} color={m.up ? colors.success : colors.danger} />
              <Text style={styles.metricTrend}>{m.trend}</Text>
            </View>
            <Text style={styles.metricTitle}>{m.title}</Text>
          </View>
        ))}
      </View>

      <View style={styles.tabsRow}>
        <View style={styles.tabs}>
          <Pressable style={[styles.tab, activeTab === 'academic' && styles.tabActive]} onPress={() => setActiveTab('academic')}>
            <Text style={[styles.tabText, activeTab === 'academic' && styles.tabTextActive]}>Academic Growth</Text>
          </Pressable>
          <Pressable style={[styles.tab, activeTab === 'room' && styles.tabActive]} onPress={() => setActiveTab('room')}>
            <Text style={[styles.tabText, activeTab === 'room' && styles.tabTextActive]}>Room Utilization</Text>
          </Pressable>
        </View>
        <Text style={styles.updated}>Last updated: 5 mins ago.</Text>
      </View>

      <View style={styles.twoCol}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Student Performance Trends</Text>
          <Text style={styles.cardSubtitle}>Average test scores across key grades for the 2023-24 academic year.</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.lineChartArea}>
              {[70, 75, 78, 82, 80, 85].map((h, i) => (
                <View key={i} style={[styles.lineChartBar, { height: h }]} />
              ))}
            </View>
            <Text style={styles.chartAxisLabel}>Sep  Oct  Nov  Dec  Jan  Feb</Text>
          </View>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: '#F59E0B' }]} /><Text style={styles.legendText}>Grade 9</Text>
            <View style={[styles.legendDot, { backgroundColor: '#3B82F6' }]} /><Text style={styles.legendText}>Grade 10</Text>
            <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} /><Text style={styles.legendText}>Grade 11</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Quick Insights</Text>
            <MaterialCommunityIcons name="information-outline" size={20} color={colors.textSecondary} />
          </View>
          <Text style={styles.cardSubtitle}>AI-generated school health metrics.</Text>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>9th Grade Performance</Text>
            <Text style={styles.insightText}>Math scores have improved significantly since the introduction of the new digital curriculum module last month.</Text>
            <Text style={styles.insightMetric}>+4.2%</Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Bus Route C Delay</Text>
            <Text style={styles.insightText}>Route C has been late 4 times this week. Traffic construction on 5th Ave is the primary cause. Recommend route re-assignment.</Text>
            <View style={styles.actionRequiredPill}><Text style={styles.actionRequiredText}>Action Required</Text></View>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightLabel}>Teacher Wellness</Text>
            <View style={styles.wellnessRow}>
              {[1, 2, 3, 4, 5].map((i) => <View key={i} style={styles.wellnessAvatar} />)}
              <Text style={styles.wellnessNum}>12</Text>
            </View>
            <View style={styles.optimalPill}><Text style={styles.optimalText}>Optimal</Text></View>
          </View>
          <Pressable style={styles.auditBtn}><Text style={styles.auditBtnText}>View Full Audit Log</Text></Pressable>
        </View>
      </View>

      <View style={styles.twoCol}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Grade-wise Attendance</Text>
          <View style={styles.donutRow}>
            <View style={styles.donutPlaceholder}>
              <View style={styles.donutRing} />
              <View style={styles.donutCenter} />
            </View>
            <View style={styles.donutLegend}>
              {GRADE_ATTENDANCE.map((g) => (
                <View key={g.grade} style={styles.donutLegendItem}>
                  <View style={[styles.legendDot, { backgroundColor: g.color }]} />
                  <Text style={styles.legendText}>{g.grade}: {g.pct}%</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Transport Punctuality</Text>
          <View style={styles.barChartArea}>
            {ROUTES.map((r) => (
              <View key={r.name} style={styles.barChartRow}>
                <Text style={styles.barChartLabel}>{r.name}</Text>
                <View style={styles.barChartBarWrap}>
                  <View style={[styles.barChartSegment, styles.barOnTime, { flex: r.onTime }]} />
                  <View style={[styles.barChartSegment, styles.barDelayed, { flex: r.delayed }]} />
                </View>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={[styles.legendDot, styles.barOnTime]} /><Text style={styles.legendText}>On Time</Text>
            <View style={[styles.legendDot, styles.barDelayed]} /><Text style={styles.legendText}>Delayed</Text>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.matrixHeader}>
          <Text style={styles.cardTitle}>Teacher Effectiveness Matrix</Text>
          <View style={styles.matrixLinks}>
            <Pressable><Text style={styles.matrixLink}>View Full Department Ranking →</Text></Pressable>
            <Text style={styles.scheduledText}>Scheduled Reports</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.colTeacher]}>Teacher</Text>
            <Text style={[styles.th, styles.colDept]}>Department</Text>
            <Text style={[styles.th, styles.colScore]}>Current Performance Score</Text>
            <Text style={[styles.th, styles.colTrend]}>Growth Trend</Text>
            <Text style={[styles.th, styles.colActions]}>Actions</Text>
          </View>
          {TEACHERS.map((t, i) => (
            <View key={i} style={styles.tableRow}>
              <View style={styles.colTeacher}>
                <View style={styles.teacherCell}>
                  <View style={styles.teacherAvatar} />
                  <View>
                    <Text style={styles.teacherName}>{t.name}</Text>
                    <Text style={styles.teacherTitle}>{t.title}</Text>
                  </View>
                </View>
              </View>
              <Text style={[styles.td, styles.colDept]}>{t.department}</Text>
              <View style={[styles.colScore, styles.scoreCell]}>
                <View style={styles.scoreBarBg}><View style={[styles.scoreBarFill, { width: `${t.score}%` }]} /></View>
                <Text style={styles.scoreText}>{t.score}%</Text>
              </View>
              <View style={styles.colTrend}>
                {t.trend === 'Improving' && <MaterialCommunityIcons name="trending-up" size={16} color={colors.success} />}
                {t.trend === 'Stable' && <MaterialCommunityIcons name="minus" size={16} color={colors.textSecondary} />}
                {t.trend === 'Action Needed' && <MaterialCommunityIcons name="trending-up" size={16} color={colors.danger} />}
                <Text style={[styles.trendText, t.trend === 'Action Needed' && styles.trendAction]}>{t.trend}</Text>
              </View>
              <View style={styles.colActions} />
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
  breadcrumb: { ...typography.small, color: colors.textSecondary, marginBottom: 8 },
  headerRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 24 },
  headerText: { flex: 1, minWidth: 200 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  headerActions: { flexDirection: 'row', gap: 8 },
  btnSecondary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle },
  btnSecondaryText: { ...typography.bodySmall, color: colors.textPrimary },
  btnPrimary: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.primary },
  btnPrimaryText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  metricCard: {
    flex: 1,
    minWidth: 160,
    backgroundColor: colors.dashboardWelcomeBg,
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    position: 'relative',
  },
  metricIconWrap: { position: 'absolute', top: 12, right: 12, width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(107,78,246,0.15)', alignItems: 'center', justifyContent: 'center' },
  metricValue: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  metricTrendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  metricTrend: { ...typography.small, color: colors.textSecondary },
  metricTitle: { ...typography.small, color: colors.textSecondary },
  tabsRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 24 },
  tabs: { flexDirection: 'row', gap: 8 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textPrimary },
  tabTextActive: { color: colors.white },
  updated: { ...typography.small, color: colors.textSecondary },
  twoCol: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 24 },
  card: {
    flex: 1,
    minWidth: 280,
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardSubtitle: { ...typography.small, color: colors.textSecondary, marginBottom: 16 },
  chartPlaceholder: { height: 160, marginBottom: 12 },
  lineChartArea: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 120 },
  lineChartBar: { width: 24, backgroundColor: colors.primary, borderRadius: 4, opacity: 0.8 },
  chartAxisLabel: { ...typography.small, color: colors.textSecondary, marginTop: 8 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, alignItems: 'center' },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { ...typography.small, color: colors.textSecondary },
  insightItem: { marginBottom: 16 },
  insightLabel: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  insightText: { ...typography.small, color: colors.textSecondary, marginBottom: 6 },
  insightMetric: { ...typography.bodySmall, fontWeight: '600', color: colors.primary },
  actionRequiredPill: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.danger },
  actionRequiredText: { fontSize: 11, fontWeight: '600', color: colors.white },
  wellnessRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  wellnessAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.borderSubtle },
  wellnessNum: { ...typography.bodySmall, color: colors.textPrimary },
  optimalPill: { alignSelf: 'flex-start', paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  optimalText: { fontSize: 11, color: colors.textSecondary },
  auditBtn: { marginTop: 8 },
  auditBtnText: { ...typography.bodySmall, color: colors.primary, fontWeight: '500' },
  donutRow: { flexDirection: 'row', alignItems: 'center', gap: 24 },
  donutPlaceholder: { width: 100, height: 100, borderRadius: 50, borderWidth: 12, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  donutRing: { position: 'absolute', width: 100, height: 100, borderRadius: 50, borderWidth: 12, borderColor: colors.primary },
  donutCenter: { width: 60, height: 60, borderRadius: 30, backgroundColor: colors.white },
  donutLegend: { flex: 1 },
  donutLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  barChartArea: { marginBottom: 12 },
  barChartRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  barChartLabel: { width: 60, ...typography.small, color: colors.textPrimary },
  barChartBarWrap: { flex: 1, flexDirection: 'row', height: 20, borderRadius: 4, overflow: 'hidden' },
  barChartSegment: { minWidth: 4 },
  barOnTime: { backgroundColor: '#FCA5A5' },
  barDelayed: { backgroundColor: colors.danger },
  matrixHeader: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  matrixLinks: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  matrixLink: { ...typography.bodySmall, color: colors.primary },
  scheduledText: { ...typography.small, color: colors.textSecondary },
  table: {},
  tableHeader: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  th: { ...typography.small, color: colors.textSecondary, fontWeight: '600' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  colTeacher: { flex: 1.2, minWidth: 140 },
  colDept: { flex: 0.8, minWidth: 80 },
  colScore: { flex: 1, minWidth: 100 },
  colTrend: { flex: 0.8, flexDirection: 'row', alignItems: 'center', gap: 6 },
  colActions: { flex: 0.3 },
  teacherCell: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  teacherAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.borderSubtle },
  teacherName: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  teacherTitle: { ...typography.small, color: colors.textSecondary },
  td: { ...typography.bodySmall, color: colors.textPrimary },
  scoreCell: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  scoreBarBg: { flex: 1, height: 8, backgroundColor: colors.inputBackground, borderRadius: 4, overflow: 'hidden' },
  scoreBarFill: { height: '100%', backgroundColor: colors.primary, borderRadius: 4 },
  scoreText: { ...typography.small, color: colors.textPrimary, width: 32 },
  trendText: { ...typography.small, color: colors.textPrimary },
  trendAction: { color: colors.danger },
});
