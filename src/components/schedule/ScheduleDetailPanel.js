import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function ScheduleDetailPanel({ slot, event, onClose, onEditSlot }) {
  if (!slot && !event) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.panelTitle}>{slot ? 'Period details' : 'Event details'}</Text>
        <Pressable onPress={onClose} style={styles.closeBtn} accessibilityLabel="Close">
          <MaterialCommunityIcons name="close" size={22} color={colors.textSecondary} />
        </Pressable>
      </View>
      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {slot && <SlotDetailContent slot={slot} onEdit={onEditSlot} />}
        {event && <EventDetailContent event={event} />}
      </ScrollView>
    </View>
  );
}

function SlotDetailContent({ slot, onEdit }) {
  const { dayLabel, periodLabel, timeRange, periodSlots, selectedSlot } = slot;
  const periodTitle = dayLabel ? `${dayLabel} · ${periodLabel}` : periodLabel;
  return (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{periodTitle}</Text>
        <Text style={styles.timeRange}>{timeRange}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>This period across classes</Text>
        {periodSlots.map((s, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.className}>{s.className}</Text>
            <Text style={styles.subjectName}>{s.subject}</Text>
            <Text style={styles.teacherName}>{s.teacher}</Text>
          </View>
        ))}
      </View>
      {selectedSlot && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Selected class</Text>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{selectedSlot.className}</Text>
            <Text style={styles.cardSubject}>{selectedSlot.subject}</Text>
            <View style={styles.statRow}>
              <MaterialCommunityIcons name="account-tie" size={18} color={colors.textSecondary} />
              <Text style={styles.statText}>{selectedSlot.teacher}</Text>
            </View>
            <View style={styles.statRow}>
              <MaterialCommunityIcons name="door" size={18} color={colors.textSecondary} />
              <Text style={styles.statText}>Room {selectedSlot.room}</Text>
            </View>
          </View>
          {onEdit && (
            <Pressable style={styles.editBtn} onPress={() => onEdit(slot)}>
              <MaterialCommunityIcons name="pencil" size={18} color={colors.primary} />
              <Text style={styles.editBtnText}>Edit slot</Text>
            </Pressable>
          )}
        </View>
      )}
    </>
  );
}

function EventDetailContent({ event }) {
  const icon = event.type === 'exam' ? 'file-document' : event.type === 'sports' ? 'basketball' : 'calendar-star';
  return (
    <>
      <View style={styles.section}>
        <View style={styles.eventHeader}>
          <View style={[styles.eventIconWrap, { backgroundColor: colors.dashboardWelcomeBg }]}>
            <MaterialCommunityIcons name={icon} size={24} color={colors.primary} />
          </View>
          <View style={styles.eventTitleWrap}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventType}>{event.typeLabel}</Text>
          </View>
        </View>
        <View style={styles.eventMeta}>
          <MaterialCommunityIcons name="calendar" size={18} color={colors.textSecondary} />
          <Text style={styles.eventDate}>{event.dateLabel}</Text>
        </View>
        {event.timeLabel && (
          <View style={styles.eventMeta}>
            <MaterialCommunityIcons name="clock-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.eventDate}>{event.timeLabel}</Text>
          </View>
        )}
      </View>
      {event.description && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.eventDescription}>{event.description}</Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  panel: { flex: 1, padding: spacing.gutter },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  panelTitle: { ...typography.h3, color: colors.textPrimary },
  closeBtn: { padding: 4 },
  body: { flex: 1 },
  section: { marginBottom: 24 },
  sectionTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  sectionLabel: { ...typography.small, color: colors.textSecondary, fontWeight: '600', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  timeRange: { ...typography.bodySmall, color: colors.textSecondary },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, gap: 8 },
  className: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, width: 72 },
  subjectName: { ...typography.bodySmall, color: colors.primary, flex: 1 },
  teacherName: { ...typography.small, color: colors.textSecondary },
  card: { backgroundColor: colors.white, borderRadius: radii.cardSmall, padding: 16, borderWidth: 1, borderColor: colors.borderSubtle },
  cardTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  cardSubject: { ...typography.bodySmall, color: colors.primary, marginBottom: 12 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  statText: { ...typography.bodySmall, color: colors.textPrimary },
  eventHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  eventIconWrap: { width: 48, height: 48, borderRadius: radii.cardSmall, justifyContent: 'center', alignItems: 'center' },
  eventTitleWrap: { flex: 1 },
  eventTitle: { ...typography.body, fontWeight: '600', color: colors.textPrimary },
  eventType: { ...typography.small, color: colors.textSecondary, textTransform: 'capitalize', marginTop: 2 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  eventDate: { ...typography.bodySmall, color: colors.textPrimary },
  eventDescription: { ...typography.bodySmall, color: colors.textSecondary, lineHeight: 22 },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.inputBackground,
    alignSelf: 'flex-start',
  },
  editBtnText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
});
