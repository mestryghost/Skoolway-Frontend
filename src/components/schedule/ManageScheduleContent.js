import { useState, useEffect, useMemo, useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { WeeklyTimetableGrid } from './WeeklyTimetableGrid';
import { EventCalendar } from './EventCalendar';
import { ScheduleConfigModal } from './ScheduleConfigModal';
import { SlotEditModal } from './SlotEditModal';
import { buildPeriodsDisplay, buildGridFromSlots } from './scheduleUtils';
import { getScheduleConfig, updateScheduleConfig, getScheduleOptions, getScheduleSlots, upsertScheduleSlot } from '../../api/schedule';

const TABS = [
  { key: 'timetable', label: 'Weekly Timetable' },
  { key: 'events', label: 'Event Calendar' },
];

export function ManageScheduleContent({
  selectedSlot,
  selectedEvent,
  onSelectSlot,
  onSelectEvent,
  onRegisterOpenSlotEdit,
}) {
  const [activeTab, setActiveTab] = useState('timetable');
  const [config, setConfig] = useState(null);
  const [options, setOptions] = useState(null);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configModalVisible, setConfigModalVisible] = useState(false);
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [slotEditContext, setSlotEditContext] = useState(null);

  const openSlotEdit = useCallback((context) => {
    setSlotEditContext(context ?? null);
    setSlotModalVisible(true);
  }, []);

  useEffect(() => {
    onRegisterOpenSlotEdit?.(openSlotEdit);
  }, [onRegisterOpenSlotEdit, openSlotEdit]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cfg, opt, slotList] = await Promise.all([
        getScheduleConfig(),
        getScheduleOptions(),
        getScheduleSlots(),
      ]);
      setConfig(cfg);
      setOptions(opt);
      setSlots(Array.isArray(slotList) ? slotList : []);
    } catch (e) {
      console.error('Schedule load failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const periodsDisplay = useMemo(() => buildPeriodsDisplay(config), [config]);
  const classes = useMemo(() => options?.classes ?? [], [options]);
  const gridByDay = useMemo(
    () => buildGridFromSlots(slots, classes, periodsDisplay),
    [slots, classes, periodsDisplay]
  );

  const handleSaveConfig = async (body) => {
    await updateScheduleConfig(body);
    setConfig((c) => ({ ...c, ...body }));
    await load();
  };

  const handleOpenSlotModal = useCallback((initialSlot = null) => {
    setSlotEditContext(initialSlot);
    setSlotModalVisible(true);
  }, []);

  const handleSaveSlot = async (body) => {
    await upsertScheduleSlot(body);
    await load();
    setSlotModalVisible(false);
    setSlotEditContext(null);
  };

  const handleCellSelect = (slot) => {
    onSelectSlot(slot);
  };

  const resolvedSlotForModal = useMemo(() => {
    if (!slotEditContext) return null;
    const hasIds = slotEditContext.subjectId != null || slotEditContext.slotId;
    if (hasIds) return slotEditContext;
    const existing = slots.find(
      (s) =>
        s.classId === slotEditContext.classId &&
        s.periodIndex === slotEditContext.periodIndex &&
        s.dayOfWeek === slotEditContext.dayOfWeek
    );
    return existing ?? slotEditContext;
  }, [slotEditContext, slots]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Manage Schedule' }]} />
      <Text style={styles.title}>Manage Schedule</Text>
      <Text style={styles.description}>
        Weekly subject timetable by class and period. Configure settings, then click a cell to add or edit.
      </Text>

      <View style={styles.actions}>
        <Pressable style={styles.btnSecondary} onPress={() => setConfigModalVisible(true)}>
          <MaterialCommunityIcons name="cog" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Timetable settings</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={() => handleOpenSlotModal()}>
          <MaterialCommunityIcons name="calendar-plus" size={18} color={colors.white} />
          <Text style={styles.btnPrimaryText}>Add to Timetable</Text>
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
                <Text style={styles.cardSubtitle}>
                  Subject per period for each class. Click a cell to view or edit in the panel; use “Add to Timetable” or an empty cell to add a slot.
                </Text>
              </View>
            </View>
            {loading ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading timetable…</Text>
              </View>
            ) : (
              <WeeklyTimetableGrid
                periodsDisplay={periodsDisplay}
                classes={classes}
                gridByDay={gridByDay}
                selectedSlot={selectedSlot}
                onSelectSlot={handleCellSelect}
                loading={false}
              />
            )}
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

      <ScheduleConfigModal
        visible={configModalVisible}
        config={config}
        onSave={handleSaveConfig}
        onClose={() => setConfigModalVisible(false)}
      />
      <SlotEditModal
        visible={slotModalVisible}
        slot={resolvedSlotForModal}
        options={options}
        onSave={handleSaveSlot}
        onClose={() => { setSlotModalVisible(false); setSlotEditContext(null); }}
      />
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
  loadingWrap: { padding: 48, alignItems: 'center' },
  loadingText: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 12 },
});