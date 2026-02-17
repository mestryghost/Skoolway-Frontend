import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// Placeholder data - in real app, fetch by teacherId from navigation context
const PLACEHOLDER_TEACHER = {
  id: 1,
  name: 'Dr. Sarah Jenkins',
  title: 'Head of Mathematics Department',
  email: 's.jenkins@educonnect.com',
  phone: '+1 (555) 234-5678',
  department: 'Mathematics',
  hireDate: '2018-09-01',
  status: 'Active',
  subjects: ['Mathematics', 'Further Pure Mathematics', 'Calculus'],
  classes: [
    { id: 1, name: 'Grade 12-A', subject: 'Calculus', room: 'C101', studentCount: 28, capacity: 30, schedule: 'Mon P1, Wed P3, Fri P2' },
    { id: 2, name: 'Grade 11-B', subject: 'Mathematics', room: 'C102', studentCount: 24, capacity: 30, schedule: 'Tue P2, Thu P1' },
  ],
  students: [
    { id: 1, name: 'Aiden Montgomery', grade: 'Grade 12-A', email: 'aiden.m@school.edu', performance: 'A' },
    { id: 2, name: 'Sophia Chen', grade: 'Grade 12-A', email: 'sophia.c@school.edu', performance: 'A-' },
    { id: 3, name: 'Marcus Johnson', grade: 'Grade 11-B', email: 'marcus.j@school.edu', performance: 'B+' },
    { id: 4, name: 'Isabella Rossi', grade: 'Grade 12-A', email: 'isabella.r@school.edu', performance: 'A' },
    { id: 5, name: 'Liam O\'Connell', grade: 'Grade 11-B', email: 'liam.o@school.edu', performance: 'B' },
  ],
  performance: {
    averageClassSize: 26,
    totalStudents: 52,
    averageGrade: 'A-',
    attendanceRate: 94,
  },
  timetable: [
    { day: 'Monday', periods: ['P1: Grade 12-A (Calculus)', 'P3: Grade 12-A (Calculus)'] },
    { day: 'Tuesday', periods: ['P2: Grade 11-B (Mathematics)'] },
    { day: 'Wednesday', periods: ['P3: Grade 12-A (Calculus)'] },
    { day: 'Thursday', periods: ['P1: Grade 11-B (Mathematics)'] },
    { day: 'Friday', periods: ['P2: Grade 12-A (Calculus)'] },
  ],
};

function StatusPill({ status }) {
  const isActive = status === 'Active';
  const bg = isActive ? colors.success : colors.statusOnLeaveOrange;
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

export function TeacherProfileContent() {
  const { goTo, teacherId } = useNavigation();
  const teacher = PLACEHOLDER_TEACHER; // In real app: fetch by teacherId

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Teachers & Classrooms', screen: 'teachers' }, { label: teacher.name }]} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarLarge} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{teacher.name}</Text>
              <StatusPill status={teacher.status} />
            </View>
            <Text style={styles.title}>{teacher.title}</Text>
            <Text style={styles.meta}>{teacher.department} Department</Text>
            <Text style={styles.meta}>Hired: {new Date(teacher.hireDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
          </View>
        </View>
        <Pressable style={styles.backBtn} onPress={() => goTo('teachers')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {/* Contact Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Contact Information</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{teacher.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{teacher.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="office-building" size={18} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{teacher.department} Department</Text>
          </View>
        </View>

        {/* Performance Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Performance Overview</Text>
          </View>
          <View style={styles.metricsRow}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Total Students</Text>
              <Text style={styles.metricValue}>{teacher.performance.totalStudents}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Avg. Class Size</Text>
              <Text style={styles.metricValue}>{teacher.performance.averageClassSize}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Avg. Grade</Text>
              <Text style={styles.metricValue}>{teacher.performance.averageGrade}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text style={styles.metricValue}>{teacher.performance.attendanceRate}%</Text>
            </View>
          </View>
        </View>

        {/* Subjects Taught */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Subjects Taught</Text>
          </View>
          <View style={styles.subjectList}>
            {teacher.subjects.map((subject, i) => (
              <View key={i} style={styles.subjectPill}>
                <Text style={styles.subjectPillText}>{subject}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Classes Assigned */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Classes Assigned</Text>
          </View>
          {teacher.classes.map((cls) => (
            <View key={cls.id} style={styles.classCard}>
              <View style={styles.classHeader}>
                <Text style={styles.className}>{cls.name}</Text>
                <Text style={styles.classSubject}>{cls.subject}</Text>
              </View>
              <View style={styles.classDetails}>
                <View style={styles.classDetailItem}>
                  <MaterialCommunityIcons name="door" size={16} color={colors.textSecondary} />
                  <Text style={styles.classDetailText}>Room {cls.room}</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <MaterialCommunityIcons name="account-group" size={16} color={colors.textSecondary} />
                  <Text style={styles.classDetailText}>{cls.studentCount}/{cls.capacity} students</Text>
                </View>
                <View style={styles.classDetailItem}>
                  <MaterialCommunityIcons name="calendar-clock" size={16} color={colors.textSecondary} />
                  <Text style={styles.classDetailText}>{cls.schedule}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Weekly Timetable */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calendar-month" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Weekly Timetable</Text>
          </View>
          {teacher.timetable.map((day, i) => (
            <View key={i} style={styles.timetableRow}>
              <Text style={styles.timetableDay}>{day.day}</Text>
              <View style={styles.timetablePeriods}>
                {day.periods.map((period, j) => (
                  <Text key={j} style={styles.timetablePeriod}>{period}</Text>
                ))}
              </View>
            </View>
          ))}
          <Pressable style={styles.viewFullTimetableBtn} onPress={() => goTo('manage-schedule')}>
            <Text style={styles.viewFullTimetableText}>View Full Timetable</Text>
            <MaterialCommunityIcons name="open-in-new" size={16} color={colors.primary} />
          </Pressable>
        </View>

        {/* Students */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="school" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Students ({teacher.students.length})</Text>
          </View>
          {teacher.students.map((student) => (
            <View key={student.id} style={styles.studentRow}>
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.name}</Text>
                <Text style={styles.studentMeta}>{student.grade} • {student.email}</Text>
              </View>
              <View style={styles.studentGrade}>
                <Text style={styles.gradeText}>{student.performance}</Text>
              </View>
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
  headerLeft: { flexDirection: 'row', gap: 16, flex: 1 },
  avatarLarge: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.borderSubtle },
  headerInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  name: { ...typography.h2, color: colors.textPrimary },
  title: { ...typography.body, fontWeight: '600', color: colors.textSecondary, marginBottom: 4 },
  meta: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 2 },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.white },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle },
  backBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  card: {
    flex: 1,
    minWidth: 300,
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    marginBottom: 16,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { ...typography.h3, color: colors.textPrimary },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  infoValue: { ...typography.bodySmall, color: colors.textPrimary },
  metricsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metric: { flex: 1, minWidth: 100 },
  metricLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 4 },
  metricValue: { ...typography.h3, color: colors.textPrimary },
  subjectList: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  subjectPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.dashboardWelcomeBg },
  subjectPillText: { fontSize: 12, color: colors.primary, fontWeight: '500' },
  classCard: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, marginBottom: 12 },
  classHeader: { marginBottom: 8 },
  className: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  classSubject: { ...typography.bodySmall, color: colors.primary },
  classDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  classDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  classDetailText: { ...typography.small, color: colors.textSecondary },
  timetableRow: { flexDirection: 'row', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  timetableDay: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, width: 100 },
  timetablePeriods: { flex: 1 },
  timetablePeriod: { ...typography.small, color: colors.textSecondary, marginBottom: 4 },
  viewFullTimetableBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  viewFullTimetableText: { ...typography.bodySmall, color: colors.primary, fontWeight: '500' },
  studentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  studentInfo: { flex: 1 },
  studentName: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  studentMeta: { ...typography.small, color: colors.textSecondary },
  studentGrade: { alignItems: 'flex-end' },
  gradeText: { ...typography.body, fontWeight: '600', color: colors.primary },
});
