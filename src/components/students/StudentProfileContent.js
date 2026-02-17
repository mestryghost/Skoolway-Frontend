import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

// Placeholder data - in real app, fetch by studentId from navigation context
const PLACEHOLDER_STUDENT = {
  id: 1,
  name: 'Aiden Montgomery',
  grade: 'Grade 10',
  section: 'Sec A',
  roll: '1024',
  email: 'aiden.m@school.edu',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '2008-05-15',
  admissionDate: '2022-09-01',
  address: '123 Main Street, City, State 12345',
  status: 'ACTIVE',
  role: 'prefect', // null, 'prefect', 'headboy', 'headgirl', 'deputy-headboy', 'deputy-headgirl'
  isGraduated: false,
  graduationYear: null,
  parent: {
    name: 'Sarah Montgomery',
    relationship: 'Mother',
    email: 'sarah.montgomery@email.com',
    phone: '+1 (555) 123-4568',
  },
  performance: {
    overallGPA: 3.85,
    attendance: 96,
    behaviorScore: 4.2,
    term: '2024 Spring',
  },
  courses: [
    { subject: 'Mathematics', teacher: 'Dr. Sarah J.', grade: 'A', gpa: 4.0, room: 'C101' },
    { subject: 'English', teacher: 'E. Rodriguez', grade: 'A-', gpa: 3.7, room: 'C103' },
    { subject: 'Physics', teacher: 'M. Thorne', grade: 'B+', gpa: 3.3, room: 'C102' },
    { subject: 'Chemistry', teacher: 'J. Vane', grade: 'A', gpa: 4.0, room: 'C105' },
    { subject: 'Biology', teacher: 'Dr. Chen', grade: 'A-', gpa: 3.7, room: 'C106' },
    { subject: 'History', teacher: 'L. Williams', grade: 'B+', gpa: 3.3, room: 'C107' },
  ],
};

function StatusBadge({ role }) {
  if (!role) return null;
  const badges = {
    prefect: { label: 'Prefect', color: colors.primary, icon: 'star' },
    headboy: { label: 'Head Boy', color: '#F59E0B', icon: 'crown' },
    headgirl: { label: 'Head Girl', color: '#EC4899', icon: 'crown' },
    'deputy-headboy': { label: 'Deputy Head Boy', color: '#10B981', icon: 'account-star' },
    'deputy-headgirl': { label: 'Deputy Head Girl', color: '#10B981', icon: 'account-star' },
  };
  const badge = badges[role];
  if (!badge) return null;
  return (
    <View style={[styles.roleBadge, { backgroundColor: badge.color }]}>
      <MaterialCommunityIcons name={badge.icon} size={16} color={colors.white} />
      <Text style={styles.roleBadgeText}>{badge.label}</Text>
    </View>
  );
}

function StatusPill({ status }) {
  const isActive = status === 'ACTIVE';
  const bg = isActive ? colors.primary : colors.danger;
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

export function StudentProfileContent() {
  const { goTo, studentId } = useNavigation();
  const student = PLACEHOLDER_STUDENT; // In real app: fetch by studentId

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Students', screen: 'students' }, { label: student.name }]} />
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarLarge} />
          <View style={styles.headerInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{student.name}</Text>
              <StatusBadge role={student.role} />
            </View>
            <Text style={styles.meta}>{student.grade} • {student.section} • Roll #{student.roll}</Text>
            <View style={styles.statusRow}>
              <StatusPill status={student.status} />
              {student.isGraduated && (
                <View style={styles.graduatedBadge}>
                  <MaterialCommunityIcons name="school" size={14} color={colors.success} />
                  <Text style={styles.graduatedText}>Graduated {student.graduationYear}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        <Pressable style={styles.backBtn} onPress={() => goTo('students')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        {/* Student Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Student Information</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{student.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{student.phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{new Date(student.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admission Date</Text>
            <Text style={styles.infoValue}>{new Date(student.admissionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{student.address}</Text>
          </View>
        </View>

        {/* Parent Information */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Parent / Guardian</Text>
          </View>
          <View style={styles.parentCard}>
            <View style={styles.parentAvatar} />
            <View style={styles.parentInfo}>
              <Text style={styles.parentName}>{student.parent.name}</Text>
              <Text style={styles.parentRelationship}>{student.parent.relationship}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{student.parent.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{student.parent.phone}</Text>
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
              <Text style={styles.metricLabel}>Overall GPA</Text>
              <Text style={styles.metricValue}>{student.performance.overallGPA}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text style={styles.metricValue}>{student.performance.attendance}%</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Behavior</Text>
              <Text style={styles.metricValue}>{student.performance.behaviorScore}/5</Text>
            </View>
          </View>
          <Text style={styles.termLabel}>{student.performance.term}</Text>
        </View>

        {/* Courses / Classes */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Courses & Classes</Text>
          </View>
          {student.courses.map((course, i) => (
            <View key={i} style={styles.courseRow}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseSubject}>{course.subject}</Text>
                <Text style={styles.courseTeacher}>{course.teacher} • Room {course.room}</Text>
              </View>
              <View style={styles.courseGrade}>
                <Text style={styles.gradeText}>{course.grade}</Text>
                <Text style={styles.gpaText}>GPA: {course.gpa}</Text>
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
  meta: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.white },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
  roleBadgeText: { fontSize: 11, fontWeight: '600', color: colors.white },
  graduatedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.dashboardWelcomeBg },
  graduatedText: { fontSize: 11, fontWeight: '600', color: colors.success },
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
  infoLabel: { ...typography.small, color: colors.textSecondary, fontWeight: '600', width: 100 },
  infoValue: { ...typography.bodySmall, color: colors.textPrimary, flex: 1 },
  parentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  parentAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.borderSubtle },
  parentInfo: { flex: 1 },
  parentName: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: 2 },
  parentRelationship: { ...typography.small, color: colors.textSecondary },
  metricsRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metric: { flex: 1 },
  metricLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 4 },
  metricValue: { ...typography.h3, color: colors.textPrimary },
  termLabel: { ...typography.small, color: colors.textSecondary },
  courseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  courseInfo: { flex: 1 },
  courseSubject: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  courseTeacher: { ...typography.small, color: colors.textSecondary },
  courseGrade: { alignItems: 'flex-end' },
  gradeText: { ...typography.body, fontWeight: '600', color: colors.primary, marginBottom: 2 },
  gpaText: { ...typography.small, color: colors.textSecondary },
});
