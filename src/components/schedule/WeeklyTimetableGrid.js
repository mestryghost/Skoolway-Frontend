import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { DAY_LABELS } from './scheduleUtils';

export function WeeklyTimetableGrid({
  periodsDisplay,
  classes,
  gridByDay,
  selectedSlot,
  onSelectSlot,
  loading,
}) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = selectedSlot?.dayIndex ?? null;
  const selectedPeriodRowIndex = selectedSlot?.periodRowIndex ?? null;
  const selectedClassIndex = selectedSlot?.classIndex ?? null;
  const isSameDay = selectedDay === selectedDayIndex;

  const grid = gridByDay?.[selectedDayIndex] ?? [];
  const periods = periodsDisplay ?? [];

  const handleCellPress = (periodRowIndex, classIndex) => {
    const row = periods[periodRowIndex];
    if (row?.type === 'break') return;
    const dayLabel = DAY_LABELS[selectedDayIndex];
    const periodLabel = row?.label ?? '';
    const periodTime = row?.time ?? '';
    const rowData = grid[periodRowIndex] ?? [];
    const periodSlots = rowData.map((cell, i) => ({
      className: classes[i]?.name ?? '',
      subject: cell?.isBreak ? '—' : cell?.subjectName ?? '—',
      teacher: cell?.isBreak ? '—' : cell?.teacherName ?? '—',
    }));
    const selectedCell = rowData[classIndex];
    const selectedSlotDetail = {
      className: classes[classIndex]?.name ?? '',
      subject: selectedCell?.isBreak ? '—' : selectedCell?.subjectName ?? '—',
      teacher: selectedCell?.isBreak ? '—' : selectedCell?.teacherName ?? '—',
      room: selectedCell?.isBreak ? '—' : selectedCell?.room ?? '—',
      slotId: selectedCell?.slotId,
      classId: classes[classIndex]?.id,
      periodIndex: row?.periodIndex,
      dayOfWeek: selectedDayIndex + 1,
    };
    onSelectSlot({
      dayIndex: selectedDayIndex,
      dayLabel,
      periodLabel,
      timeRange: periodTime,
      periodRowIndex,
      periodIndex: row?.periodIndex,
      classIndex,
      classId: classes[classIndex]?.id,
      periodSlots,
      selectedSlot: selectedSlotDetail,
    });
  };

  if (loading) {
    return (
      <View style={styles.wrap}>
        <View style={styles.dayPills}>
          {DAY_LABELS.map((day, index) => (
            <View key={day} style={styles.dayPill}>
              <Text style={styles.dayPillText}>{day}</Text>
            </View>
          ))}
        </View>
        <View style={[styles.loadingBlock, styles.loadingRow]} />
      </View>
    );
  }

  if (!periods.length || !classes.length) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.emptyText}>Configure timetable settings and add classes to see the grid.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.dayPills}>
        {DAY_LABELS.map((day, index) => (
          <Pressable
            key={day}
            style={[styles.dayPill, selectedDayIndex === index && styles.dayPillActive]}
            onPress={() => setSelectedDayIndex(index)}
          >
            <Text style={[styles.dayPillText, selectedDayIndex === index && styles.dayPillTextActive]}>{day}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <View style={styles.cornerCell}>
              <Text style={styles.cornerText}>Period</Text>
            </View>
            {classes.map((c) => (
              <View key={c.id} style={styles.headerCell}>
                <Text style={styles.headerText} numberOfLines={2}>{c.name}</Text>
              </View>
            ))}
          </View>
          {periods.map((row, periodRowIndex) => (
            <View key={periodRowIndex} style={styles.bodyRow}>
              <View style={styles.periodCell}>
                {row.type === 'break' ? (
                  <Text style={styles.periodLabel}>Break</Text>
                ) : (
                  <>
                    <Text style={styles.periodLabel}>{row.label}</Text>
                    <Text style={styles.periodTime}>{row.time}</Text>
                  </>
                )}
              </View>
              {classes.map((_, classIndex) => {
                const cell = grid[periodRowIndex]?.[classIndex];
                const isBreak = cell?.isBreak;
                const isSelected = isSameDay && selectedPeriodRowIndex === periodRowIndex && selectedClassIndex === classIndex;
                const label = isBreak ? 'Break' : (cell?.subjectName ?? '—');
                return (
                  <Pressable
                    key={classIndex}
                    style={[
                      styles.cell,
                      periodRowIndex % 2 === 1 && styles.cellAlt,
                      isBreak && styles.cellBreak,
                      isSelected && styles.cellSelected,
                    ]}
                    onPress={() => handleCellPress(periodRowIndex, classIndex)}
                    disabled={isBreak}
                  >
                    <Text style={[styles.cellText, isBreak && styles.cellTextMuted]} numberOfLines={2}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const cellSize = 112;
const periodColWidth = 88;

const styles = StyleSheet.create({
  wrap: { flex: 1, minHeight: 360 },
  dayPills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  dayPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dayPillText: { ...typography.bodySmall, color: colors.textPrimary },
  dayPillTextActive: { color: colors.white, fontWeight: '600' },
  scroll: { flex: 1 },
  table: { minWidth: '100%' },
  headerRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: colors.borderSubtle },
  cornerCell: {
    width: periodColWidth,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: colors.inputBackground,
    borderRightWidth: 1,
    borderRightColor: colors.borderSubtle,
  },
  cornerText: { ...typography.small, fontWeight: '600', color: colors.textSecondary },
  headerCell: {
    width: cellSize,
    minHeight: 52,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    backgroundColor: colors.inputBackground,
    borderRightWidth: 1,
    borderRightColor: colors.borderSubtle,
  },
  headerText: { ...typography.small, fontWeight: '600', color: colors.textPrimary, textAlign: 'center' },
  bodyRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  periodCell: {
    width: periodColWidth,
    minHeight: 56,
    justifyContent: 'center',
    paddingHorizontal: 8,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.borderSubtle,
  },
  periodLabel: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  periodTime: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  cell: {
    width: cellSize,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.borderSubtle,
  },
  cellAlt: { backgroundColor: '#FAFAFC' },
  cellBreak: { backgroundColor: colors.inputBackground },
  cellSelected: { backgroundColor: colors.dashboardWelcomeBg, borderWidth: 2, borderColor: colors.primary },
  cellText: { ...typography.small, color: colors.textPrimary, fontWeight: '500', textAlign: 'center' },
  cellTextMuted: { color: colors.textSecondary },
  loadingBlock: { minHeight: 200, backgroundColor: colors.inputBackground, borderRadius: radii.cardSmall },
  loadingRow: { marginTop: 16 },
  emptyText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', padding: 24 },
});
