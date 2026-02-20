import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { useCallback, useEffect, useState } from 'react';
import { fetchStudentProfile } from '../../api/students';
import { EditStudentModal } from './EditStudentModal';

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
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchStudentProfile(studentId);
      setStudent(data);
    } catch (e) {
      setError(e.message || 'Failed to load student');
    } finally {
      setLoading(false);
    }
  }, [studentId]);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!studentId) {
        setError('No student selected.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const data = await fetchStudentProfile(studentId);
        if (!isMounted) return;
        setStudent(data);
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load student');
      } finally {
        if (isMounted) setLoading(false);
      }
    })();
    return () => { isMounted = false; };
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !student) {
    return (
      <View style={styles.loadingWrap}>
        <Text style={styles.errorText}>{error || 'Student not found.'}</Text>
        <Pressable style={styles.backBtn} onPress={() => goTo('students')}>
          <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
          <Text style={styles.backBtnText}>Back</Text>
        </Pressable>
      </View>
    );
  }

  const firstParent = (student.parents && student.parents[0]) || null;
  const performance = student.performance || {};

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
              <Text style={styles.meta}>
                {student.grade} • {student.section}{student.rollNumber ? ` • Roll #${student.rollNumber}` : ''}
              </Text>
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
        <View style={styles.headerActions}>
          <Pressable style={styles.editBtn} onPress={() => setEditModalVisible(true)}>
            <MaterialCommunityIcons name="pencil" size={18} color={colors.white} />
            <Text style={styles.editBtnText}>Edit</Text>
          </Pressable>
          <Pressable style={styles.backBtn} onPress={() => goTo('students')}>
            <MaterialCommunityIcons name="arrow-left" size={20} color={colors.textPrimary} />
            <Text style={styles.backBtnText}>Back</Text>
          </Pressable>
        </View>
      </View>

      <EditStudentModal
        visible={editModalVisible}
        student={student}
        onClose={() => setEditModalVisible(false)}
        onSaved={() => { setEditModalVisible(false); loadProfile(); }}
      />

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
            <Text style={styles.infoValue}>
              {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '—'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Admission Date</Text>
            <Text style={styles.infoValue}>
              {student.admissionDate ? new Date(student.admissionDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '—'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{student.address || '—'}</Text>
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
              <Text style={styles.parentName}>{firstParent?.name ?? '—'}</Text>
              <Text style={styles.parentRelationship}>{firstParent?.relationship ?? ''}</Text>
            </View>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{firstParent?.email ?? '—'}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoValue}>{firstParent?.phone ?? '—'}</Text>
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
              <Text style={styles.metricValue}>{performance.overallGpa ?? '—'}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Attendance</Text>
              <Text style={styles.metricValue}>{performance.attendancePercent != null ? `${performance.attendancePercent}%` : '—'}</Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Behavior</Text>
              <Text style={styles.metricValue}>{performance.behaviorScore != null ? `${performance.behaviorScore}/5` : '—'}</Text>
            </View>
          </View>
          <Text style={styles.termLabel}>{performance.termLabel || ''}</Text>
        </View>

        {/* Courses / Classes */}
        {/* Reserved for future StudentCourse model; omitted for now to avoid static data. */}
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
  meta: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 8 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.white },
  roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
  roleBadgeText: { fontSize: 11, fontWeight: '600', color: colors.white },
  graduatedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.dashboardWelcomeBg },
  graduatedText: { fontSize: 11, fontWeight: '600', color: colors.success },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: radii.pill, backgroundColor: colors.primary },
  editBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
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
