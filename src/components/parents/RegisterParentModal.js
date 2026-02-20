import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { searchStudents } from '../../api/students';
import { createParent } from '../../api/parents';

const RELATIONSHIP_OPTIONS = [
  { value: '', label: 'Select relationship' },
  { value: 'Mother', label: 'Mother' },
  { value: 'Father', label: 'Father' },
  { value: 'Guardian', label: 'Guardian' },
  { value: 'Other', label: 'Other' },
];

export function RegisterParentModal({ visible, onClose, onSaved }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  const [studentResults, setStudentResults] = useState([]);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [searching, setSearching] = useState(false);
  const [relationshipOpen, setRelationshipOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible) return;
    setFirstName('');
    setLastName('');
    setEmail('');
    setPhone('');
    setRelationship('');
    setStudentSearch('');
    setStudentResults([]);
    setLinkedStudents([]);
    setRelationshipOpen(false);
    setError(null);
  }, [visible]);

  useEffect(() => {
    let active = true;
    const t = setTimeout(async () => {
      if (!visible || !studentSearch.trim()) {
        setStudentResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      try {
        const data = await searchStudents(studentSearch.trim(), { pageSize: 12 });
        if (!active) return;
        const items = data.items ?? [];
        setStudentResults(
          items.filter((s) => !linkedStudents.some((ls) => ls.id === s.id))
        );
      } catch {
        if (active) setStudentResults([]);
      } finally {
        if (active) setSearching(false);
      }
    }, 320);
    return () => {
      active = false;
      clearTimeout(t);
    };
  }, [visible, studentSearch, linkedStudents]);

  const addStudent = (s) => {
    if (linkedStudents.some((x) => x.id === s.id)) return;
    setLinkedStudents((prev) => [
      ...prev,
      {
        id: s.id,
        name: s.name ?? ([s.grade, s.section].filter(Boolean).join(' – ') || 'Student'),
      },
    ]);
    setStudentSearch('');
    setStudentResults([]);
  };

  const removeStudent = (id) => {
    setLinkedStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const handleRegister = async () => {
    const first = firstName.trim();
    const last = lastName.trim();
    if (!first || !last) {
      setError('First and last name are required.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createParent({
        firstName: first,
        lastName: last,
        relationship: relationship.trim() || null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        studentIds: linkedStudents.map((s) => s.id),
      });
      onSaved?.();
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to register parent');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalWrap} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Register Parent</Text>
                <Text style={styles.subtitle}>
                  Add a parent or guardian and optionally link them to existing students.
                </Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close">
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView
              style={styles.body}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.sectionTitle}>Parent details</Text>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>First name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Sarah"
                    placeholderTextColor={colors.textSecondary}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Last name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jenkins"
                    placeholderTextColor={colors.textSecondary}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Relationship</Text>
                <Pressable
                  style={styles.selectWrap}
                  onPress={() => setRelationshipOpen((v) => !v)}
                >
                  <Text
                    style={[
                      styles.selectTriggerText,
                      !relationship && styles.placeholder,
                    ]}
                    numberOfLines={1}
                  >
                    {RELATIONSHIP_OPTIONS.find((o) => o.value === relationship)?.label ??
                      'Select relationship'}
                  </Text>
                  <MaterialCommunityIcons
                    name="chevron-down"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.selectIcon}
                  />
                </Pressable>
                {relationshipOpen && (
                  <View style={styles.pickerList}>
                    {RELATIONSHIP_OPTIONS.map((opt) => (
                      <Pressable
                        key={opt.value || 'empty'}
                        style={[
                          styles.pickerOption,
                          relationship === opt.value && styles.pickerOptionSelected,
                        ]}
                        onPress={() => {
                          setRelationship(opt.value);
                          setRelationshipOpen(false);
                        }}
                      >
                        <Text style={styles.pickerOptionText}>{opt.label}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="parent@email.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor={colors.textSecondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
                Link to student(s)
              </Text>
              <View style={styles.linkCard}>
                <View style={styles.linkCardHeader}>
                  <MaterialCommunityIcons
                    name="account-school-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.linkCardTitle}>Link existing student</Text>
                </View>
                <Text style={styles.linkCardHint}>
                  Search by name or email to add students to this parent.
                </Text>
                <View style={styles.searchWrap}>
                  <MaterialCommunityIcons
                    name="magnify"
                    size={20}
                    color={colors.textSecondary}
                    style={styles.searchIconLeft}
                  />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search student by name or email..."
                    placeholderTextColor={colors.textSecondary}
                    value={studentSearch}
                    onChangeText={setStudentSearch}
                  />
                  {searching && (
                    <ActivityIndicator size="small" color={colors.primary} style={styles.searchSpinner} />
                  )}
                </View>

                {studentResults.length > 0 && (
                  <View style={styles.resultsContainer}>
                    <Text style={styles.resultsLabel}>Search results</Text>
                    <ScrollView
                      style={styles.resultsList}
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      showsVerticalScrollIndicator
                    >
                      {studentResults.map((s) => (
                        <Pressable
                          key={s.id}
                          style={styles.resultRow}
                          onPress={() => addStudent(s)}
                        >
                          <MaterialCommunityIcons
                            name="account-plus"
                            size={18}
                            color={colors.primary}
                          />
                          <View style={styles.resultText}>
                            <Text style={styles.resultName}>{s.name}</Text>
                            <Text style={styles.resultMeta}>
                              {[s.grade, s.section].filter(Boolean).join(' · ') || (s.email ?? '—')}
                            </Text>
                          </View>
                          <MaterialCommunityIcons
                            name="plus-circle-outline"
                            size={22}
                            color={colors.primary}
                          />
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {linkedStudents.length > 0 && (
                  <View style={styles.linkedSection}>
                    <Text style={styles.linkedLabel}>
                      Linked students ({linkedStudents.length})
                    </Text>
                    <View style={styles.chipWrap}>
                      {linkedStudents.map((s) => (
                        <View key={s.id} style={styles.chip}>
                          <Text style={styles.chipText} numberOfLines={1}>
                            {s.name}
                          </Text>
                          <Pressable
                            style={styles.chipRemove}
                            onPress={() => removeStudent(s.id)}
                            hitSlop={8}
                          >
                            <MaterialCommunityIcons
                              name="close-circle"
                              size={20}
                              color={colors.textSecondary}
                            />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.submitBtn}
                onPress={handleRegister}
                disabled={saving}
              >
                <Text style={styles.submitBtnText}>
                  {saving ? 'Registering…' : 'Register Parent'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.gutter,
  },
  modalWrap: { width: '100%', maxWidth: 520 },
  modal: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  closeBtn: { padding: 4, marginTop: -4, marginRight: -4 },
  body: { maxHeight: 480, marginBottom: 24 },
  sectionTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  sectionTitleSpaced: { marginTop: 24 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  field: { marginBottom: 16 },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectWrap: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingRight: 36,
  },
  selectTriggerText: { ...typography.bodySmall, color: colors.textPrimary },
  selectIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  placeholder: { color: colors.textSecondary },
  pickerList: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    overflow: 'hidden',
  },
  pickerOption: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  pickerOptionSelected: { backgroundColor: colors.inputBackground },
  pickerOptionText: { ...typography.bodySmall, color: colors.textPrimary },

  linkCard: {
    backgroundColor: colors.inputBackground,
    borderRadius: radii.input,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  linkCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  linkCardTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  linkCardHint: {
    ...typography.small,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIconLeft: { marginRight: 8 },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
    paddingVertical: 10,
    paddingRight: 8,
  },
  searchSpinner: { marginLeft: 8 },
  resultsContainer: { marginBottom: 12 },
  resultsLabel: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultsList: { maxHeight: 160 },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    gap: 10,
  },
  resultText: { flex: 1 },
  resultName: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  resultMeta: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  linkedSection: { marginTop: 4 },
  linkedLabel: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: 8,
  },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radii.pill,
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 4,
    maxWidth: '100%',
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    maxWidth: 140,
  },
  chipRemove: { padding: 2 },
  errorText: { ...typography.small, color: colors.danger, marginTop: 12 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cancelBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  submitBtnText: {
    ...typography.bodySmall,
    color: colors.white,
    fontWeight: '600',
  },
});
