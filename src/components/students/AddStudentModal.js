import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { searchParents } from '../../api/parents';
import { createStudent } from '../../api/students';
import { getStructureClasses } from '../../api/structure';

export function AddStudentModal({ visible, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [parentSearch, setParentSearch] = useState('');
  const [parentResults, setParentResults] = useState([]);
  const [selectedParentIds, setSelectedParentIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [structureClasses, setStructureClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [gradePickerOpen, setGradePickerOpen] = useState(false);

  useEffect(() => {
    if (!visible) {
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setParentSearch('');
      setParentResults([]);
      setSelectedParentIds([]);
      setSelectedClass(null);
      setGradePickerOpen(false);
      setSaving(false);
      setError(null);
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    getStructureClasses()
      .then((items) => { if (mounted) setStructureClasses(Array.isArray(items) ? items : []); })
      .catch(() => { if (mounted) setStructureClasses([]); });
    return () => { mounted = false; };
  }, [visible]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!visible || !parentSearch.trim()) {
        setParentResults([]);
        return;
      }
      try {
        const data = await searchParents(parentSearch, { pageSize: 10 });
        if (!active) return;
        setParentResults(data.items ?? []);
      } catch {
        if (active) setParentResults([]);
      }
    };
    run();
    return () => {
      active = false;
    };
  }, [visible, parentSearch]);

  const toggleParent = (id) => {
    setSelectedParentIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleRegister = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      setError('First and last name are required.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createStudent({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        gradeLabel: selectedClass?.educationLevel ?? null,
        sectionLabel: selectedClass?.name ?? null,
        classId: selectedClass?.id ?? null,
        dateOfBirth: dateOfBirth ? null : null,
        admissionDate: null,
        email: null,
        phone: null,
        address: null,
        parentIds: selectedParentIds,
      });
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to register student');
    } finally {
      setSaving(false);
    }
  };

  const gradeLabel = selectedClass
    ? [selectedClass.educationLevel, selectedClass.name].filter(Boolean).join(' – ')
    : '';

  const selectGrade = (item) => {
    setSelectedClass(item);
    setGradePickerOpen(false);
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
                <Text style={styles.title}>Add New Student</Text>
                <Text style={styles.subtitle}>Enroll a new student into the school directory.</Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close">
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>FIRST NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. James"
                    placeholderTextColor={colors.textSecondary}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>LAST NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Smith"
                    placeholderTextColor={colors.textSecondary}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>GRADE LEVEL</Text>
                  <Pressable
                    style={styles.selectWrap}
                    onPress={() => setGradePickerOpen((v) => !v)}
                  >
                    <Text
                      style={[styles.selectTriggerText, !gradeLabel && styles.placeholder]}
                      numberOfLines={1}
                    >
                      {gradeLabel || 'Select grade/class'}
                    </Text>
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} style={styles.selectIcon} />
                  </Pressable>
                  {gradePickerOpen && structureClasses.length > 0 && (
                    <View style={styles.pickerList}>
                      <Pressable style={styles.pickerOption} onPress={() => selectGrade(null)}>
                        <Text style={styles.pickerOptionText}>None</Text>
                      </Pressable>
                      {structureClasses.map((c) => (
                        <Pressable
                          key={c.id}
                          style={[styles.pickerOption, selectedClass?.id === c.id && styles.pickerOptionSelected]}
                          onPress={() => selectGrade(c)}
                        >
                          <Text style={styles.pickerOptionText}>
                            {[c.educationLevel, c.name].filter(Boolean).join(' – ')}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  )}
                  {gradePickerOpen && structureClasses.length === 0 && (
                    <View style={styles.pickerEmpty}>
                      <Text style={styles.pickerEmptyText}>No grades yet. Add classes in School Structure (onboarding).</Text>
                    </View>
                  )}
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>DATE OF BIRTH</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={colors.textSecondary}
                    value={dateOfBirth}
                    onChangeText={setDateOfBirth}
                  />
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="account-multiple-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.sectionTitle}>Parent Association</Text>
                  <Pressable style={styles.sectionLink}>
                    <Text style={styles.sectionLinkText}>Find existing parent</Text>
                  </Pressable>
                </View>
                <View style={styles.searchWrap}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search parent by name or email..."
                    placeholderTextColor={colors.textSecondary}
                    value={parentSearch}
                    onChangeText={setParentSearch}
                  />
                  <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                </View>
                {parentResults.length > 0 && (
                  <View style={styles.resultsList}>
                    {parentResults.map((p) => {
                      const selected = selectedParentIds.includes(p.id);
                      return (
                        <Pressable
                          key={p.id}
                          style={[styles.resultRow, selected && styles.resultRowSelected]}
                          onPress={() => toggleParent(p.id)}
                        >
                          <Text style={styles.resultName}>{p.name}</Text>
                          {p.email ? <Text style={styles.resultMeta}>{p.email}</Text> : null}
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <Pressable style={styles.submitBtn} onPress={handleRegister} disabled={saving}>
                <Text style={styles.submitBtnText}>{saving ? 'Saving…' : 'Register Student'}</Text>
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
  modalWrap: {
    width: '100%',
    maxWidth: 520,
  },
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
  body: { maxHeight: 360, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  field: { flex: 1 },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectWrap: { position: 'relative', borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, paddingRight: 36 },
  selectTriggerText: { ...typography.bodySmall, color: colors.textPrimary },
  selectIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  placeholder: { color: colors.textSecondary },
  pickerList: { marginTop: 4, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, maxHeight: 200, overflow: 'hidden' },
  pickerOption: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  pickerOptionSelected: { backgroundColor: colors.inputBackground },
  pickerOptionText: { ...typography.bodySmall, color: colors.textPrimary },
  pickerEmpty: { marginTop: 4, padding: 12, backgroundColor: colors.inputBackground, borderRadius: 8 },
  pickerEmptyText: { ...typography.small, color: colors.textSecondary },
  section: { marginTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  sectionLink: {},
  sectionLinkText: { ...typography.bodySmall, color: colors.primary, textDecorationLine: 'underline', marginLeft: 'auto' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
    paddingVertical: 10,
    paddingRight: 8,
  },
  searchIcon: {},
  resultsList: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultRow: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  resultRowSelected: {
    backgroundColor: colors.inputBackground,
  },
  resultName: {
    ...typography.bodySmall,
    color: colors.textPrimary,
  },
  resultMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
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
    backgroundColor: colors.white,
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
  submitBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
  errorText: { ...typography.bodySmall, color: colors.danger, marginRight: 12 },
});
