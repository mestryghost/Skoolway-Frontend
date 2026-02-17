import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const PERIODS = [
  { id: 1, label: 'P1', time: '8:00 – 8:45' },
  { id: 2, label: 'P2', time: '8:50 – 9:35' },
  { id: 3, label: 'P3', time: '9:40 – 10:25' },
  { id: 4, label: 'P4', time: '10:30 – 11:15' },
  { id: 5, label: 'P5', time: '11:20 – 12:05' },
  { id: 6, label: 'P6', time: '12:10 – 12:55' },
  { id: 7, label: 'P7', time: '13:00 – 13:45' },
  { id: 8, label: 'P8', time: '13:50 – 14:35' },
];

const CLASSES = ['Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A'];

// Per-day grids: [dayIndex][periodIndex][classIndex] = subject (each day has different arrangement)
const GRID_BY_DAY = [
  // Monday
  [
    ['Mathematics', 'Physics', 'English', 'Biology', 'Chemistry', 'History', 'Geography'],
    ['English', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'Geography', 'English'],
    ['Physics', 'Chemistry', 'Mathematics', 'English', 'History', 'Mathematics', 'Physics'],
    ['Break', 'Break', 'Break', 'Break', 'Break', 'Break', 'Break'],
    ['Biology', 'English', 'Chemistry', 'Mathematics', 'Geography', 'English', 'Chemistry'],
    ['Chemistry', 'Biology', 'History', 'Physics', 'Mathematics', 'Chemistry', 'Mathematics'],
    ['History', 'Geography', 'Biology', 'History', 'English', 'Physics', 'Biology'],
    ['Geography', 'History', 'Geography', 'Geography', 'Physics', 'Biology', 'History'],
  ],
  // Tuesday – different arrangement
  [
    ['English', 'Biology', 'Mathematics', 'Physics', 'History', 'Chemistry', 'Geography'],
    ['Physics', 'English', 'Chemistry', 'Mathematics', 'Geography', 'Biology', 'English'],
    ['Mathematics', 'History', 'Physics', 'Chemistry', 'English', 'Geography', 'Physics'],
    ['Break', 'Break', 'Break', 'Break', 'Break', 'Break', 'Break'],
    ['Chemistry', 'Geography', 'Biology', 'History', 'Mathematics', 'English', 'Chemistry'],
    ['Biology', 'Mathematics', 'History', 'English', 'Physics', 'Physics', 'Mathematics'],
    ['Geography', 'Chemistry', 'English', 'Biology', 'Chemistry', 'Mathematics', 'Biology'],
    ['History', 'Physics', 'Geography', 'Geography', 'Biology', 'History', 'History'],
  ],
  // Wednesday
  [
    ['Physics', 'Mathematics', 'Biology', 'English', 'Geography', 'Chemistry', 'Physics'],
    ['Chemistry', 'Physics', 'English', 'Mathematics', 'English', 'History', 'Chemistry'],
    ['Biology', 'English', 'Mathematics', 'Physics', 'History', 'Mathematics', 'Mathematics'],
    ['Break', 'Break', 'Break', 'Break', 'Break', 'Break', 'Break'],
    ['History', 'Chemistry', 'Physics', 'Biology', 'Mathematics', 'Geography', 'English'],
    ['Mathematics', 'Biology', 'Chemistry', 'English', 'Geography', 'English', 'Biology'],
    ['English', 'History', 'History', 'Physics', 'Chemistry', 'Physics', 'Geography'],
    ['Geography', 'Geography', 'Biology', 'Chemistry', 'Biology', 'History', 'History'],
  ],
  // Thursday
  [
    ['Biology', 'English', 'Chemistry', 'Mathematics', 'Physics', 'Geography', 'English'],
    ['History', 'Chemistry', 'Mathematics', 'Physics', 'Biology', 'English', 'Chemistry'],
    ['Geography', 'Mathematics', 'Physics', 'Biology', 'English', 'Physics', 'Mathematics'],
    ['Break', 'Break', 'Break', 'Break', 'Break', 'Break', 'Break'],
    ['Mathematics', 'Physics', 'English', 'Chemistry', 'Chemistry', 'Biology', 'Physics'],
    ['Physics', 'Biology', 'Geography', 'English', 'History', 'Mathematics', 'Biology'],
    ['Chemistry', 'Geography', 'History', 'History', 'Mathematics', 'Geography', 'Geography'],
    ['English', 'History', 'Biology', 'Geography', 'Geography', 'Chemistry', 'Chemistry'],
  ],
  // Friday
  [
    ['Chemistry', 'History', 'Physics', 'Geography', 'English', 'Biology', 'Mathematics'],
    ['Geography', 'Mathematics', 'English', 'Biology', 'Chemistry', 'Physics', 'English'],
    ['English', 'Physics', 'Biology', 'Chemistry', 'Mathematics', 'Geography', 'Physics'],
    ['Break', 'Break', 'Break', 'Break', 'Break', 'Break', 'Break'],
    ['Physics', 'English', 'Chemistry', 'Physics', 'Biology', 'Mathematics', 'Chemistry'],
    ['Mathematics', 'Chemistry', 'History', 'Mathematics', 'Geography', 'English', 'Biology'],
    ['Biology', 'Geography', 'Mathematics', 'English', 'History', 'Chemistry', 'Geography'],
    ['History', 'Biology', 'Geography', 'History', 'Physics', 'History', 'History'],
  ],
];

const TEACHERS = ['Dr. Sarah J.', 'M. Thorne', 'E. Rodriguez', '—', 'J. Vane', 'Dr. Chen', 'L. Williams'];
const ROOMS = ['C101', 'C102', 'C103', '—', 'C105', 'C106', 'C107'];
const STUDENT_COUNTS = [28, 26, 30, 0, 24, 29, 27];
const ATTENDANCE = [96, 94, 98, null, 92, 97, 95];

function buildPeriodSlots(dayIndex, periodIndex) {
  const grid = GRID_BY_DAY[dayIndex];
  return CLASSES.map((className, classIndex) => {
    const subject = grid[periodIndex][classIndex];
    const isBreak = subject === 'Break';
    return {
      className,
      subject: isBreak ? '—' : subject,
      teacher: isBreak ? '—' : TEACHERS[classIndex],
    };
  });
}

function getCellDetail(dayIndex, periodIndex, classIndex) {
  const grid = GRID_BY_DAY[dayIndex];
  const subject = grid[periodIndex][classIndex];
  const isBreak = subject === 'Break';
  return {
    className: CLASSES[classIndex],
    subject: isBreak ? '—' : subject,
    teacher: isBreak ? '—' : TEACHERS[classIndex],
    room: isBreak ? '—' : ROOMS[classIndex],
    studentCount: isBreak ? 0 : STUDENT_COUNTS[classIndex],
    attendance: isBreak ? null : ATTENDANCE[classIndex],
  };
}

export function WeeklyTimetableGrid({ selectedSlot, onSelectSlot }) {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const selectedDay = selectedSlot?.dayIndex ?? null;
  const selectedPeriodIndex = selectedSlot?.periodIndex ?? null;
  const selectedClassIndex = selectedSlot?.classIndex ?? null;
  const isSameDay = selectedDay === selectedDayIndex;

  const grid = GRID_BY_DAY[selectedDayIndex];

  const handleCellPress = (periodIndex, classIndex) => {
    const period = PERIODS[periodIndex];
    const dayLabel = DAYS[selectedDayIndex];
    const periodSlots = buildPeriodSlots(selectedDayIndex, periodIndex);
    const selectedSlotDetail = getCellDetail(selectedDayIndex, periodIndex, classIndex);
    onSelectSlot({
      dayIndex: selectedDayIndex,
      dayLabel,
      periodLabel: period.label,
      timeRange: period.time,
      periodIndex,
      classIndex,
      periodSlots,
      selectedSlot: selectedSlotDetail,
    });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.dayPills}>
        {DAYS.map((day, index) => (
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
            {CLASSES.map((c) => (
              <View key={c} style={styles.headerCell}>
                <Text style={styles.headerText} numberOfLines={2}>{c}</Text>
              </View>
            ))}
          </View>
          {PERIODS.map((period, periodIndex) => (
            <View key={period.id} style={styles.bodyRow}>
              <View style={styles.periodCell}>
                <Text style={styles.periodLabel}>{period.label}</Text>
                <Text style={styles.periodTime}>{period.time}</Text>
              </View>
              {CLASSES.map((_, classIndex) => {
                const subject = grid[periodIndex][classIndex];
                const isBreak = subject === 'Break';
                const isSelected = isSameDay && selectedPeriodIndex === periodIndex && selectedClassIndex === classIndex;
                return (
                  <Pressable
                    key={classIndex}
                    style={[
                      styles.cell,
                      periodIndex % 2 === 1 && styles.cellAlt,
                      isBreak && styles.cellBreak,
                      isSelected && styles.cellSelected,
                    ]}
                    onPress={() => handleCellPress(periodIndex, classIndex)}
                  >
                    <Text style={[styles.cellText, isBreak && styles.cellTextMuted]} numberOfLines={2}>
                      {subject}
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
});
