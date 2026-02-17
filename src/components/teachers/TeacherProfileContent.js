import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useEffect, useState } from 'react';
import { fetchTeacherProfile } from '../../api/teachers';

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
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!teacherId) {
        setError('No teacher selected.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTeacherProfile(teacherId);
        if (!isMounted) return;
        setTeacher(data);
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load teacher');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [teacherId]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !teacher) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.errorText}>{error || 'Teacher not found.'}</Text>
        <Pressable style={styles.backBtn} onPress={() => goTo('teachers')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>
    );
  }

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
            <Text style={styles.title}>{teacher.title || ''}</Text>
            <Text style={styles.meta}>{teacher.department ? `${teacher.department} Department` : ''}</Text>
            <Text style={styles.meta}>
              Hired:{' '}
              {teacher.createdAt
                ? new Date(teacher.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                : '—'}
            </Text>
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
            <Text style={styles.infoValue}>{teacher.department ? `${teacher.department} Department` : '—'}</Text>
          </View>
        </View>

        {/* Performance Overview */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="chart-line" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Performance Overview</Text>
          </View>
          <Text style={styles.meta}>Detailed performance metrics will be added when analytics backend is ready.</Text>
        </View>

        {/* Subjects Taught */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Subjects Taught</Text>
          </View>
          <Text style={styles.meta}>Subject assignments will be populated once SubjectTeacher mappings are implemented.</Text>
        </View>

        {/* Classes Assigned */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="account-group" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Classes Assigned</Text>
          </View>
          <Text style={styles.meta}>Class assignments will be driven by TeacherClass relationships.</Text>
        </View>

        {/* Weekly Timetable */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="calendar-month" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Weekly Timetable</Text>
          </View>
          <Text style={styles.meta}>Timetable will be composed from Manage Schedule data per teacher.</Text>
          <Pressable style={styles.viewFullTimetableBtn} onPress={() => goTo('manage-schedule')}>
            <Text style={styles.viewFullTimetableText}>View Full Timetable</Text>
            <MaterialCommunityIcons name="open-in-new" size={16} color={colors.primary} />
          </Pressable>
        </View>

        {/* Students */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="school" size={20} color={colors.primary} />
            <Text style={styles.cardTitle}>Students</Text>
          </View>
          <Text style={styles.meta}>Student rosters per teacher will be populated from class enrollments.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingWrap: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.gutter },
  errorText: { ...typography.bodySmall, color: colors.danger, marginBottom: 12, textAlign: 'center' },
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
