import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Placeholder events: { id, title, date (YYYY-MM-DD), type, typeLabel, description?, timeLabel? }
const PLACEHOLDER_EVENTS = [
  { id: '1', title: 'Sports Day', date: null, type: 'sports', typeLabel: 'Sports', description: 'Annual inter-house sports competition. All students participate.', timeLabel: '9:00 AM – 3:00 PM' },
  { id: '2', title: 'Mathematics Mid-Term', date: null, type: 'exam', typeLabel: 'Exam', description: 'Grade 9–12 Mathematics mid-term examination.', timeLabel: '8:00 AM – 10:00 AM' },
  { id: '3', title: 'Parent-Teacher Meeting', date: null, type: 'meeting', typeLabel: 'Meeting', description: 'Scheduled parent-teacher conferences.', timeLabel: '2:00 PM – 5:00 PM' },
  { id: '4', title: 'Science Fair', date: null, type: 'event', typeLabel: 'Event', description: 'School science fair and project exhibitions.', timeLabel: '10:00 AM – 2:00 PM' },
  { id: '5', title: 'English Literature Exam', date: null, type: 'exam', typeLabel: 'Exam', description: 'Grade 10 & 11 English Literature paper.', timeLabel: '9:00 AM – 11:00 AM' },
  { id: '6', title: 'School Holiday', date: null, type: 'holiday', typeLabel: 'Holiday', description: 'Staff development day. No classes.' },
];

function getDaysInMonth(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days = last.getDate();
  const startDay = first.getDay();
  return { days, startDay };
}

function assignDatesToEvents(events, year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return events.map((e, i) => {
    const day = (i % daysInMonth) + 1;
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const d = new Date(year, month, day);
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    return { ...e, date, dateLabel };
  });
}

export function EventCalendar({ onSelectEvent }) {
  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());

  const { days, startDay } = getDaysInMonth(currentYear, currentMonth);
  const eventsWithDates = assignDatesToEvents(PLACEHOLDER_EVENTS, currentYear, currentMonth);

  const eventsByDay = {};
  eventsWithDates.forEach((ev) => {
    const day = parseInt(ev.date.slice(8, 10), 10);
    if (!eventsByDay[day]) eventsByDay[day] = [];
    eventsByDay[day].push(ev);
  });

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else setCurrentMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else setCurrentMonth((m) => m + 1);
  };

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push({ empty: true });
  for (let d = 1; d <= days; d++) cells.push({ day: d, events: eventsByDay[d] || [] });

  return (
    <View style={styles.wrap}>
      <View style={styles.monthBar}>
        <Pressable onPress={prevMonth} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.monthTitle}>{MONTHS[currentMonth]} {currentYear}</Text>
        <Pressable onPress={nextMonth} style={styles.navBtn}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <View style={styles.weekdayRow}>
        {WEEKDAYS.map((w) => (
          <View key={w} style={styles.weekdayCell}>
            <Text style={styles.weekdayText}>{w}</Text>
          </View>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, index) => (
          <View key={index} style={styles.dayCell}>
            {cell.empty ? (
              <View style={styles.dayEmpty} />
            ) : (
              <>
                <Text style={styles.dayNum}>{cell.day}</Text>
                <ScrollView style={styles.eventsList} nestedScrollEnabled showsVerticalScrollIndicator={false}>
                  {(cell.events || []).map((ev) => (
                    <Pressable
                      key={ev.id}
                      style={[styles.eventChip, ev.type === 'exam' && styles.eventChipExam, ev.type === 'sports' && styles.eventChipSports, ev.type === 'holiday' && styles.eventChipHoliday]}
                      onPress={() => onSelectEvent(ev)}
                    >
                      <Text style={styles.eventChipText} numberOfLines={1}>{ev.title}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const daySize = 72;

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  monthBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, paddingHorizontal: 4 },
  navBtn: { padding: 8 },
  monthTitle: { ...typography.h3, color: colors.textPrimary },
  weekdayRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, paddingVertical: 8 },
  weekdayCell: { width: `${100 / 7}%`, alignItems: 'center' },
  weekdayText: { ...typography.small, fontWeight: '600', color: colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: { width: `${100 / 7}%`, minHeight: daySize + 40, padding: 4, borderRightWidth: 1, borderBottomWidth: 1, borderColor: colors.borderSubtle },
  dayEmpty: { flex: 1, minHeight: daySize },
  dayNum: { ...typography.small, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  eventsList: { maxHeight: 80 },
  eventChip: { backgroundColor: colors.dashboardWelcomeBg, borderRadius: 6, paddingVertical: 4, paddingHorizontal: 6, marginBottom: 4 },
  eventChipExam: { backgroundColor: '#FEE2E2' },
  eventChipSports: { backgroundColor: '#D1FAE5' },
  eventChipHoliday: { backgroundColor: '#E0E7FF' },
  eventChipText: { fontSize: 10, color: colors.textPrimary, fontWeight: '500' },
});
