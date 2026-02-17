import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AddClassModal } from './AddClassModal';
import { AddTeacherModal } from './AddTeacherModal';
import { Breadcrumb } from '../common/Breadcrumb';

const BREADCRUMB_SEGMENTS = [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Teachers & Classrooms' }];
const TABS = [
  { key: 'overview', label: 'General Overview' },
  { key: 'directory', label: 'Faculty Directory' },
  { key: 'timetables', label: 'Timetables' },
];

const METRICS = [
  { icon: 'account-group', value: '142', sub: '+3 this month', label: 'Total Teachers' },
  { icon: 'calendar-month', value: '56', sub: '85% capacity', label: 'Active Classes' },
  { icon: 'book-open-variant', value: '24', sub: '4 departments', label: 'Total Subjects' },
  { icon: 'check-circle', value: '18', sub: 'All active', label: 'Support Staff' },
];

const TEACHERS = [
  { id: 1, name: 'Dr. Sarah Jenkins', email: 's.jenkins@educonnect.com', subjects: ['Mathematics', 'Further Pure'], classes: 2, status: 'Active' },
  { id: 2, name: 'Marcus Thorne', email: 'm.thorne@educonnect.com', subjects: ['Physics', 'Astronomy'], classes: 2, status: 'Active' },
  { id: 3, name: 'Elena Rodriguez', email: 'e.rodriguez@educonnect.com', subjects: ['Spanish', 'Literature'], classes: 2, status: 'Active' },
  { id: 4, name: 'Julian Vane', email: 'j.vane@educonnect.com', subjects: ['Computer Science'], classes: 2, status: 'On Leave' },
];

const CLASSROOMS = [
  { grade: 'Grade 12-A', room: 'C101', teacher: 'Sarah Jenkins', subject: 'Calculus', count: '28/30' },
  { grade: 'Grade 11-B', room: 'C102', teacher: 'Marcus Thorne', subject: 'Thermodynamics', count: '24/30' },
  { grade: 'Grade 10-A', room: 'C103', teacher: 'Elena Rodriguez', subject: 'Modern Lit', count: '30/30' },
  { grade: 'Grade 9-B', room: 'C104', teacher: 'Julian Vane', subject: 'Python Basics', count: '22/30' },
];

function TeacherStatusPill({ status }) {
  const isActive = status === 'Active';
  const bg = isActive ? colors.success : colors.statusOnLeaveOrange;
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function TeacherCard({ teacher, onViewProfile }) {
  return (
    <View style={styles.teacherCard}>
      <Pressable style={styles.kebabBtn}>
        <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.textSecondary} />
      </Pressable>
      <View style={styles.avatar} />
      <Text style={styles.teacherName}>{teacher.name}</Text>
      <Text style={styles.teacherEmail}>{teacher.email}</Text>
      <View style={styles.subjectRow}>
        {teacher.subjects.map((s) => (
          <View key={s} style={styles.subjectPill}>
            <Text style={styles.subjectPillText}>{s}</Text>
          </View>
        ))}
      </View>
      <View style={styles.classesRow}>
        <MaterialCommunityIcons name="book-open-page-variant" size={16} color={colors.textSecondary} />
        <Text style={styles.classesText}>{teacher.classes} Classes</Text>
      </View>
      <View style={styles.cardFooter}>
        <TeacherStatusPill status={teacher.status} />
        <Pressable style={styles.viewProfileBtn} onPress={() => onViewProfile(teacher.id)}>
          <Text style={styles.viewProfileText}>View Profile</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ClassroomCard({ item }) {
  return (
    <View style={styles.classroomCard}>
      <View style={styles.classroomCardStripe} />
      <View style={styles.classroomCardContent}>
        <Text style={styles.classroomGrade}>{item.grade}</Text>
        <Text style={styles.classroomRoom}>Room: {item.room}</Text>
        <View style={styles.classroomTeacherRow}>
          <View style={styles.classroomAvatar} />
          <Text style={styles.classroomTeacherName}>{item.teacher}</Text>
        </View>
        <Text style={styles.classroomSubject}>{item.subject}</Text>
        <View style={styles.classroomCountRow}>
          <View style={styles.classroomCountSpacer} />
          <Text style={styles.classroomCount}>{item.count}</Text>
        </View>
      </View>
    </View>
  );
}

export function TeacherManagementContent() {
  const { goTo } = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const [addClassOpen, setAddClassOpen] = useState(false);
  const [addTeacherOpen, setAddTeacherOpen] = useState(false);

  return (
    <>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={BREADCRUMB_SEGMENTS} />
      <Text style={styles.title}>Management</Text>
      <Text style={styles.description}>Oversee teacher assignments and classroom operations across all departments.</Text>

      <View style={styles.headerActions}>
        <Pressable style={styles.btnSecondary}>
          <MaterialCommunityIcons name="download-outline" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Export Reports</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={() => setAddClassOpen(true)}>
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
          <Text style={styles.btnPrimaryText}>New Class</Text>
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

      <View style={styles.metricsRow}>
        {METRICS.map((m) => (
          <View key={m.label} style={styles.metricCard}>
            <MaterialCommunityIcons name={m.icon} size={24} color={colors.primary} style={styles.metricIcon} />
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricSub}>{m.sub}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Teacher Directory</Text>
          <View style={styles.sectionActions}>
            <Pressable style={styles.btnSecondary}>
              <MaterialCommunityIcons name="filter-outline" size={18} color={colors.textPrimary} />
              <Text style={styles.btnSecondaryText}>Filter</Text>
            </Pressable>
            <Pressable style={styles.btnPrimary} onPress={() => setAddTeacherOpen(true)}>
              <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
              <Text style={styles.btnPrimaryText}>Add Teacher</Text>
            </Pressable>
          </View>
        </View>
        <View style={styles.teacherGrid}>
          {TEACHERS.map((t) => (
            <TeacherCard key={t.id} teacher={t} onViewProfile={(id) => goTo('teacher-profile', { teacherId: id })} />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Classrooms</Text>
          <Pressable style={styles.viewTimetableLink} onPress={() => goTo('manage-schedule')}>
            <Text style={styles.viewTimetableText}>View Timetable</Text>
            <MaterialCommunityIcons name="open-in-new" size={16} color={colors.primary} />
          </Pressable>
        </View>
        <View style={styles.classroomsGrid}>
          {CLASSROOMS.map((c, i) => (
            <ClassroomCard key={i} item={c} />
          ))}
        </View>
      </View>
    </ScrollView>
    <AddClassModal visible={addClassOpen} onClose={() => setAddClassOpen(false)} />
    <AddTeacherModal visible={addTeacherOpen} onClose={() => setAddTeacherOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  breadcrumb: { ...typography.small, color: colors.textSecondary, marginBottom: 8 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 20 },
  headerActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
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
  tabs: { flexDirection: 'row', gap: 24, marginBottom: 24, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  tab: { paddingBottom: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary, marginBottom: -1 },
  tabText: { ...typography.bodySmall, color: colors.textSecondary },
  tabTextActive: { color: colors.primary, fontWeight: '600' },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginBottom: 32 },
  metricCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: colors.inputBackground,
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricIcon: { marginBottom: 8 },
  metricValue: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  metricSub: { ...typography.small, color: colors.textSecondary, marginBottom: 4 },
  metricLabel: { ...typography.small, color: colors.textSecondary },
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  sectionTitle: { ...typography.h3, color: colors.textPrimary },
  sectionActions: { flexDirection: 'row', gap: 8 },
  teacherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  teacherCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: '48%',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    position: 'relative',
  },
  kebabBtn: { position: 'absolute', top: 8, right: 8, padding: 4, zIndex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.borderSubtle, marginBottom: 12 },
  teacherName: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  teacherEmail: { ...typography.small, color: colors.textSecondary, marginBottom: 12 },
  subjectRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  subjectPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.dashboardWelcomeBg },
  subjectPillText: { fontSize: 12, color: colors.primary },
  classesRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  classesText: { ...typography.small, color: colors.textSecondary },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.white },
  viewProfileBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.borderSubtle, backgroundColor: colors.white },
  viewProfileText: { fontSize: 12, color: colors.textPrimary, fontWeight: '500' },
  viewTimetableLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  viewTimetableText: { ...typography.bodySmall, color: colors.primary, fontWeight: '500' },
  classroomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  classroomCard: {
    flex: 1,
    minWidth: 260,
    maxWidth: '48%',
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radii.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  classroomCardStripe: {
    width: 4,
    backgroundColor: colors.primary,
  },
  classroomCardContent: {
    flex: 1,
    padding: 16,
  },
  classroomGrade: { ...typography.body, fontWeight: '700', color: colors.textPrimary, marginBottom: 4 },
  classroomRoom: { ...typography.small, color: colors.textSecondary, marginBottom: 12 },
  classroomTeacherRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 4 },
  classroomAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.dashboardWelcomeBg },
  classroomTeacherName: { ...typography.bodySmall, color: colors.textPrimary },
  classroomSubject: { ...typography.small, color: colors.textSecondary, marginBottom: 8 },
  classroomCountRow: { flexDirection: 'row', alignItems: 'center' },
  classroomCountSpacer: { flex: 1 },
  classroomCount: { ...typography.bodySmall, color: colors.primary, fontWeight: '700' },
});
