import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const RECENT_ITEMS = [
  { name: 'Sarah Jenkins', grade: 'Grade 8-B', time: '2 hours ago' },
  { name: 'Sarah Jenkins', grade: 'Grade 8-B', time: '2 hours ago' },
  { name: 'Sarah Jenkins', grade: 'Grade 8-B', time: '2 hours ago' },
];

const ADMIN_TOOLS = ['Bulk Promotion Wizard', 'House Allocation', 'Document Generator'];
const REPORTS = ['Attendance Report', 'Enrollment Report'];

export function StudentDirectorySidebar() {
  const [adminOpen, setAdminOpen] = useState(true);
  const [reportsOpen, setReportsOpen] = useState(false);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="school-outline" size={18} color={colors.primary} />
          <Text style={styles.cardTitle}>Enrollment Trend</Text>
        </View>
        <Text style={styles.cardSubtitle}>Student growth this semester</Text>
        <View style={styles.chartPlaceholder}>
          <View style={styles.chartBar} />
          <View style={[styles.chartBar, styles.chartBar2]} />
          <View style={[styles.chartBar, styles.chartBar3]} />
          <View style={[styles.chartBar, styles.chartBar4]} />
          <View style={[styles.chartBar, styles.chartBar5]} />
        </View>
        <View style={styles.chartFooter}>
          <Text style={styles.chartLabel}>CURRENT 485</Text>
          <Text style={styles.chartChange}>NET CHANGE +15%</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Resources</Text>
        <Pressable style={styles.accordion} onPress={() => setAdminOpen(!adminOpen)}>
          <Text style={styles.accordionLabel}>Administration Tools</Text>
          <MaterialCommunityIcons name={adminOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
        </Pressable>
        {adminOpen && (
          <View style={styles.accordionContent}>
            {ADMIN_TOOLS.map((t) => (
              <Text key={t} style={styles.accordionItem}>{t}</Text>
            ))}
          </View>
        )}
        <Pressable style={styles.accordion} onPress={() => setReportsOpen(!reportsOpen)}>
          <Text style={styles.accordionLabel}>Reports</Text>
          <MaterialCommunityIcons name={reportsOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.textSecondary} />
        </Pressable>
        {reportsOpen && (
          <View style={styles.accordionContent}>
            {REPORTS.map((t) => (
              <Text key={t} style={styles.accordionItem}>{t}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.recentTitle}>RECENT ENROLLMENTS</Text>
        </View>
        {RECENT_ITEMS.map((item, i) => (
          <View key={i} style={styles.recentItem}>
            <MaterialCommunityIcons name="check-circle" size={18} color={colors.primary} style={styles.recentIcon} />
            <View>
              <Text style={styles.recentLabel}>New Student Registered</Text>
              <Text style={styles.recentDetail}>{item.name} joined {item.grade}</Text>
              <Text style={styles.recentTime}>{item.time}</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  cardTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  cardSubtitle: { ...typography.small, color: colors.textSecondary, marginBottom: 12 },
  chartPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 80,
    marginBottom: 12,
  },
  chartBar: { width: '16%', height: '60%', backgroundColor: colors.primary, borderRadius: 4, opacity: 0.9 },
  chartBar2: { height: '75%' },
  chartBar3: { height: '50%' },
  chartBar4: { height: '85%' },
  chartBar5: { height: '70%' },
  chartFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  chartLabel: { ...typography.small, color: colors.textSecondary, fontWeight: '600' },
  chartChange: { ...typography.small, color: colors.success, fontWeight: '600' },
  sectionTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  accordion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  accordionLabel: { ...typography.bodySmall, color: colors.textPrimary },
  accordionContent: { paddingLeft: 8, paddingBottom: 8 },
  accordionItem: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 4 },
  recentTitle: { ...typography.small, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.5 },
  recentItem: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 12 },
  recentIcon: { marginRight: 8, marginTop: 2 },
  recentLabel: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  recentDetail: { ...typography.small, color: colors.textSecondary },
  recentTime: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
});
