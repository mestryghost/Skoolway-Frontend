import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { WeeklyTimetableGrid } from './WeeklyTimetableGrid';
import { EventCalendar } from './EventCalendar';

const TABS = [
  { key: 'timetable', label: 'Weekly Timetable' },
  { key: 'events', label: 'Event Calendar' },
];

export function ManageScheduleContent({
  selectedSlot,
  selectedEvent,
  onSelectSlot,
  onSelectEvent,
}) {
  const [activeTab, setActiveTab] = useState('timetable');

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Manage Schedule' }]} />
      <Text style={styles.title}>Manage Schedule</Text>
      <Text style={styles.description}>
        Weekly subject timetable by class and period; school events and exams on the calendar.
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.btnPrimary}>
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
          <Text style={styles.btnPrimaryText}>Add Event</Text>
        </Pressable>
        <Pressable style={styles.btnSecondary}>
          <MaterialCommunityIcons name="calendar-plus" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Add to Timetable</Text>
        </Pressable>
      </View>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.tabActive]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.tabTextActive]}>{t.label}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.card}>
        {activeTab === 'timetable' && (
          <>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="table" size={24} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Weekly Timetable</Text>
                <Text style={styles.cardSubtitle}>Subject per period for each class. Click a cell to see details in the panel.</Text>
              </View>
            </View>
            <WeeklyTimetableGrid selectedSlot={selectedSlot} onSelectSlot={onSelectSlot} />
          </>
        )}
        {activeTab === 'events' && (
          <>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="calendar-month" size={24} color={colors.primary} />
              <View>
                <Text style={styles.cardTitle}>Event Calendar</Text>
                <Text style={styles.cardSubtitle}>Sports days, exams, meetings, and holidays. Click an event for details.</Text>
              </View>
            </View>
            <EventCalendar onSelectEvent={onSelectEvent} />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 24 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  btnPrimaryText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
  btnSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  btnSecondaryText: { ...typography.bodySmall, color: colors.textPrimary },
  tabs: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  tabActive: { backgroundColor: colors.primary },
  tabText: { ...typography.bodySmall, color: colors.textPrimary },
  tabTextActive: { color: colors.white },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    overflow: 'hidden',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 20 },
  cardTitle: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  cardSubtitle: { ...typography.bodySmall, color: colors.textSecondary },
});
