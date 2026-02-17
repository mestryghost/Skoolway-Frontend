import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { RegisterParentModal } from './RegisterParentModal';
import { Breadcrumb } from '../common/Breadcrumb';

const BREADCRUMB_SEGMENTS = [{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Parents' }];
const TOTAL_PARENTS = 1240;
const FILTERS = [
  { key: 'all', label: 'all' },
  { key: 'active', label: 'active' },
  { key: 'pending', label: 'pending' },
  { key: 'inactive', label: 'inactive' },
];

const PLACEHOLDER_PARENTS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Mother',
    status: 'Active',
    email: 'sarah.jenkins@email.com',
    phone: '+1 (555) 123-4567',
    students: [
      { name: 'Leo Jenkins', grade: 'Grade 4-B' },
      { name: 'Emma Jenkins', grade: 'Grade 2-A' },
    ],
  },
  {
    id: 2,
    name: 'Elena Rodriguez',
    role: 'Guardian',
    status: 'Pending Verification',
    email: 'elena.r@email.com',
    phone: '+1 (555) 234-5678',
    students: [{ name: 'Mia Rodriguez', grade: 'Grade 5-C' }],
  },
  {
    id: 3,
    name: 'Michael Chen',
    role: 'Father',
    status: 'Active',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 345-6789',
    students: [{ name: 'Sophia Chen', grade: 'Grade 9-B' }],
  },
  {
    id: 4,
    name: 'James Johnson',
    role: 'Father',
    status: 'Active',
    email: 'james.j@email.com',
    phone: '+1 (555) 456-7890',
    students: [{ name: 'Marcus Johnson', grade: 'Grade 11-A' }],
  },
  {
    id: 5,
    name: 'Elena Rossi',
    role: 'Mother',
    status: 'Active',
    email: 'elena.rossi@email.com',
    phone: '+1 (555) 567-8901',
    students: [{ name: 'Isabella Rossi', grade: 'Grade 10-B' }],
  },
  {
    id: 6,
    name: 'Patrick O\'Connell',
    role: 'Father',
    status: 'Active',
    email: 'patrick.o@email.com',
    phone: '+1 (555) 678-9012',
    students: [{ name: 'Liam O\'Connell', grade: 'Grade 8-A' }],
  },
];

function RolePill({ role }) {
  return (
    <View style={styles.rolePill}>
      <Text style={styles.roleText}>{role}</Text>
    </View>
  );
}

function StatusPill({ status }) {
  const isActive = status === 'Active';
  const isPending = status === 'Pending Verification';
  const bg = isActive ? colors.primary : isPending ? colors.statusOnLeave : colors.textSecondary;
  return (
    <View style={[styles.statusPill, { backgroundColor: bg }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
}

function ParentCard({ parent }) {
  return (
    <View style={styles.parentCard}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatar} />
          <View style={styles.nameSection}>
            <Text style={styles.parentName}>{parent.name}</Text>
            <View style={styles.tagRow}>
              <RolePill role={parent.role} />
              <StatusPill status={parent.status} />
            </View>
          </View>
        </View>
        <Pressable style={styles.kebabBtn}>
          <MaterialCommunityIcons name="dots-vertical" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={styles.contactSection}>
        <View style={styles.contactItem}>
          <MaterialCommunityIcons name="email-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.contactText}>{parent.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.contactText}>{parent.phone}</Text>
        </View>
      </View>

      <View style={styles.linkedStudents}>
        <Text style={styles.linkedStudentsLabel}>LINKED STUDENTS</Text>
        {parent.students.map((student, idx) => (
          <View key={idx} style={styles.studentPill}>
            <View style={styles.studentAvatar} />
            <Text style={styles.studentName}>{student.name}</Text>
            <Text style={styles.studentGrade}>{student.grade}</Text>
          </View>
        ))}
      </View>

      <View style={styles.cardActions}>
        <Pressable style={styles.actionBtn}>
          <MaterialCommunityIcons name="chat-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.actionBtnText}>Chat</Text>
        </Pressable>
        <Pressable style={styles.actionBtn}>
          <MaterialCommunityIcons name="phone-outline" size={16} color={colors.textPrimary} />
          <Text style={styles.actionBtnText}>Call</Text>
        </Pressable>
      </View>
    </View>
  );
}

export function ParentDirectoryContent() {
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [registerParentOpen, setRegisterParentOpen] = useState(false);
  const perPage = 6;
  const totalPages = Math.ceil(TOTAL_PARENTS / perPage);

  return (
    <>
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      <Breadcrumb segments={BREADCRUMB_SEGMENTS} />
      <Text style={styles.title}>Parent Directory</Text>
      <Text style={styles.description}>Manage family contacts, linked students, and engagement.</Text>

      <View style={styles.actions}>
        <Pressable style={styles.btnSecondary}>
          <MaterialCommunityIcons name="cloud-download-outline" size={18} color={colors.textPrimary} />
          <Text style={styles.btnSecondaryText}>Export</Text>
        </Pressable>
        <Pressable style={styles.btnPrimary} onPress={() => setRegisterParentOpen(true)}>
          <MaterialCommunityIcons name="plus" size={18} color={colors.white} />
          <Text style={styles.btnPrimaryText}>Register Parent</Text>
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
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Filter by parent name..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <Pressable style={styles.filterIconBtn}>
            <MaterialCommunityIcons name="filter-variant" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>
      </View>

      <View style={styles.grid}>
        {PLACEHOLDER_PARENTS.map((parent) => (
          <ParentCard key={parent.id} parent={parent} />
        ))}
      </View>

      <View style={styles.pagination}>
        <Text style={styles.paginationInfo}>
          Showing {perPage} of {TOTAL_PARENTS} parents
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
    <RegisterParentModal visible={registerParentOpen} onClose={() => setRegisterParentOpen(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.gutter, paddingBottom: 48 },
  breadcrumb: { ...typography.small, color: colors.textSecondary, marginBottom: 8 },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  description: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 24 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
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
  filtersRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterPills: { flexDirection: 'row', gap: 8 },
  filterPill: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { ...typography.bodySmall, color: colors.textPrimary },
  filterPillTextActive: { color: colors.white },
  searchRow: { marginBottom: 24 },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, ...typography.bodySmall, color: colors.textPrimary, padding: 0 },
  filterIconBtn: { marginLeft: 12, padding: 4 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  parentCard: {
    flex: 1,
    minWidth: 300,
    maxWidth: '48%',
    backgroundColor: colors.cardSurface,
    borderRadius: radii.cardSmall,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  cardHeaderLeft: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, flex: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.borderSubtle },
  nameSection: { flex: 1 },
  parentName: { ...typography.body, fontWeight: '600', color: colors.textPrimary, marginBottom: 8 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  rolePill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  roleText: { fontSize: 11, color: colors.textPrimary },
  statusPill: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: radii.pill },
  statusText: { fontSize: 11, fontWeight: '600', color: colors.white },
  kebabBtn: { padding: 4 },
  contactSection: { marginBottom: 16 },
  contactItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  contactText: { ...typography.bodySmall, color: colors.textPrimary },
  linkedStudents: { marginBottom: 16 },
  linkedStudentsLabel: { ...typography.small, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  studentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: radii.pill,
    backgroundColor: colors.inputBackground,
    marginBottom: 6,
  },
  studentAvatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.borderSubtle },
  studentName: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '500' },
  studentGrade: { ...typography.small, color: colors.textSecondary },
  cardActions: { flexDirection: 'row', gap: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  actionBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  pagination: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  paginationInfo: { ...typography.small, color: colors.textSecondary },
  paginationControls: { flexDirection: 'row', gap: 8 },
  pageBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: radii.pill, backgroundColor: colors.inputBackground },
  pageBtnActive: { backgroundColor: colors.primary },
  pageBtnText: { ...typography.small, color: colors.textPrimary },
  pageBtnTextActive: { color: colors.white },
});
