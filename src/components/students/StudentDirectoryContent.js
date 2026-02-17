import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { AddStudentModal } from './AddStudentModal';
import { ImportCsvModal } from './ImportCsvModal';
import { Breadcrumb } from '../common/Breadcrumb';
import { fetchStudents } from '../../api/students';

const BREADCRUMB_SEGMENTS = [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Students' }];
const FILTERS = [
  { key: 'all', label: 'all' },
  { key: 'active', label: 'active' },
  { key: 'on-leave', label: 'on-leave' },
  { key: 'graduated', label: 'graduated' },
];

function StatusPill({ status }) {
  const normalized = status || '';
  const isActive = normalized === 'ACTIVE';
  const isOnLeave = normalized === 'ON-LEAVE' || normalized === 'ONLEAVE';
  const bg = isActive ? colors.primary : isOnLeave ? colors.statusOnLeave : colors.danger;
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={styles.statusText}>{isOnLeave ? 'ON-LEAVE' : normalized}</Text>
    </View>
  );
}

export function StudentDirectoryContent() {
  const { goTo } = useNavigation();
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [importCsvOpen, setImportCsvOpen] = useState(false);
  const perPage = 5;
  const totalPages = Math.max(1, Math.ceil(total / perPage));

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const statusParam =
          filter === 'active' ? 'Active' :
          filter === 'on-leave' ? 'OnLeave' :
          filter === 'graduated' ? 'Graduated' :
          undefined;
        const data = await fetchStudents({ page, pageSize: perPage, status: statusParam });
        if (!isMounted) return;
        setStudents(data.items || []);
        setTotal(data.total || 0);
      } catch (e) {
        if (isMounted) setError(e.message || 'Failed to load students');
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [page, filter]);

  const handleViewProfile = (studentId) => {
    goTo('student-profile', { studentId });
  };

  return (
    <>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={BREADCRUMB_SEGMENTS} />
      <Text style={styles.title}>Student Directory</Text>
      <Text style={styles.description}>Manage student enrollments, profiles, and parent relationships.</Text>

      <View style={styles.actions}>
        <Pressable style={styles.btnSecondary} onPress={() => setImportCsvOpen(true)}>
          <MaterialCommunityIcons name="cloud-upload-outline" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Import CSV</Text>
        </Pressable>
        <Pressable style={styles.btnSecondary}>
          <MaterialCommunityIcons name="download-outline" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Export</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={() => setAddStudentOpen(true)}>
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
          <Text style={styles.btnPrimaryText}>Add Student</Text>
        </Pressable>
      </View>

      <View style={styles.filtersRow}>
        <View style={styles.filterPills}>
          {FILTERS.map((f) => (
            <Pressable
              key={f.key}
              style={[styles.filterPill, filter === f.key && styles.filterPillActive]}
              onPress={() => setFilter(f.key)}
            >
              <Text style={[styles.filterPillText, filter === f.key && styles.filterPillTextActive]}>{f.label}</Text>
            </Pressable>
          ))}
        </View>
        <Pressable style={styles.filterIconBtn}>
          <MaterialCommunityIcons name="filter-outline" size={20} color={colors.textSecondary} />
        </Pressable>
        <Text style={styles.resultsCount}>{total} Total Results</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={styles.colCheck} />
          <View style={styles.colAvatar} />
          <Text style={[styles.headerCell, styles.colName]}>Name</Text>
          <Text style={[styles.headerCell, styles.colStatus]}>Status</Text>
          <Text style={[styles.headerCell, styles.colParent]}>Parent / Guardian</Text>
          <Text style={[styles.headerCell, styles.colContact]}>Contact</Text>
          <View style={styles.colActions} />
        </View>
        {loading && (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.tableRow}>
                <View style={styles.colCheck}>
                  <View style={styles.checkbox} />
                </View>
                <View style={styles.colAvatar}>
                  <View style={[styles.avatar, styles.skeleton]} />
                </View>
                <View style={styles.colName}>
                  <View style={[styles.skeletonBar, { width: '70%' }]} />
                  <View style={[styles.skeletonBar, { width: '50%', marginTop: 4 }]} />
                </View>
                <View style={styles.colStatus}>
                  <View style={[styles.statusPill, styles.skeleton]} />
                </View>
                <View style={styles.colParent}>
                  <View style={[styles.skeletonBar, { width: '80%' }]} />
                </View>
                <View style={styles.colContact}>
                  <View style={[styles.skeletonBar, { width: '80%' }]} />
                </View>
                <View style={styles.colActions}>
                  <View style={[styles.viewProfileBtn, styles.skeleton]} />
                </View>
              </View>
            ))}
          </>
        )}
        {!loading && students.map((s) => (
          <View key={s.id} style={styles.tableRow}>
            <View style={styles.colCheck}>
              <View style={styles.checkbox} />
            </View>
            <View style={styles.colAvatar}>
              <View style={styles.avatar} />
            </View>
            <View style={styles.colName}>
              <Text style={styles.studentName}>{s.name}</Text>
              <Text style={styles.studentMeta}>{s.grade} • {s.section}</Text>
              {s.rollNumber && <Text style={styles.studentMeta}>Roll #{s.rollNumber}</Text>}
            </View>
            <View style={styles.colStatus}>
              <StatusPill status={s.status} />
            </View>
            <View style={styles.colParent}>
              <Text style={styles.cellText}>{s.parentName ?? '-'}</Text>
              {s.hasPhone && <MaterialCommunityIcons name="phone-outline" size={14} color={colors.textSecondary} style={styles.inlineIcon} />}
            </View>
            <View style={styles.colContact}>
              <Text style={styles.cellText}>{s.email}</Text>
              {s.hasPhone && <MaterialCommunityIcons name="phone-outline" size={14} color={colors.textSecondary} style={styles.inlineIcon} />}
            </View>
            <View style={styles.colActions}>
              <Pressable style={styles.viewProfileBtn} onPress={() => handleViewProfile(s.id)}>
                <Text style={styles.viewProfileText}>View Profile</Text>
              </Pressable>
              <Pressable style={styles.kebabBtn}>
                <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.pagination}>
        <Text style={styles.paginationInfo}>
          Showing {(total === 0 ? 0 : (page - 1) * perPage + 1)} to {Math.min(page * perPage, total)} of {total} students
        </Text>
        <View style={styles.paginationControls}>
          <Pressable style={styles.pageBtn} onPress={() => setPage((p) => Math.max(1, p - 1))}>
            <Text style={styles.pageBtnText}>Previous</Text>
          </Pressable>
          {[1, 2, 3].map((n) => (
            <Pressable key={n} style={[styles.pageBtn, page === n && styles.pageBtnActive]} onPress={() => setPage(n)}>
              <Text style={[styles.pageBtnText, page === n && styles.pageBtnTextActive]}>{n}</Text>
            </Pressable>
          ))}
          <Pressable style={styles.pageBtn} onPress={() => setPage((p) => Math.min(totalPages, p + 1))}>
            <Text style={styles.pageBtnText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
    <AddStudentModal visible={addStudentOpen} onClose={() => setAddStudentOpen(false)} />
    <ImportCsvModal visible={importCsvOpen} onClose={() => setImportCsvOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  breadcrumb: { ...typography.small, color: colors.textSecondary, marginBottom: 8 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 24 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
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
  filtersRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  filterPills: { flexDirection: 'row', gap: 8 },
  filterPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  filterPillActive: { backgroundColor: colors.primary },
  filterPillText: { ...typography.bodySmall, color: colors.textPrimary },
  filterPillTextActive: { color: colors.white },
  filterIconBtn: { padding: 8 },
  resultsCount: { ...typography.bodySmall, color: colors.textSecondary, marginLeft: 'auto' },
  table: { borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: radii.cardSmall, overflow: 'hidden', marginBottom: 24 },
  tableHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: colors.pageBackground, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  headerCell: { ...typography.small, color: colors.textSecondary, fontWeight: '600' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle, backgroundColor: colors.white },
  colCheck: { width: 32, marginRight: 8 },
  colAvatar: { width: 40, marginRight: 12 },
  colName: { minWidth: 120, marginRight: 12 },
  colStatus: { minWidth: 80, marginRight: 12 },
  colParent: { flex: 1, minWidth: 100 },
  colContact: { flex: 1, minWidth: 140 },
  colActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: colors.textSecondary },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.borderSubtle },
  studentName: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  studentMeta: { ...typography.small, color: colors.textSecondary },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, alignSelf: 'flex-start' },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.white },
  cellText: { ...typography.bodySmall, color: colors.textPrimary },
  inlineIcon: { marginLeft: 4 },
  viewProfileBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.borderSubtle },
  viewProfileText: { fontSize: 12, color: colors.textPrimary },
  kebabBtn: { padding: 4 },
  skeleton: { backgroundColor: colors.inputBackground },
  skeletonBar: { height: 10, borderRadius: 4, backgroundColor: colors.inputBackground },
  pagination: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  paginationInfo: { ...typography.small, color: colors.textSecondary },
  paginationControls: { flexDirection: 'row', gap: 8 },
  pageBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  pageBtnActive: { backgroundColor: colors.primary },
  pageBtnText: { ...typography.small, color: colors.textPrimary },
  pageBtnTextActive: { color: colors.white },
});
