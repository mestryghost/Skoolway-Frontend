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
import { updateStudent } from '../../api/students';
import { updateParent } from '../../api/parents';
import { getStructureClasses } from '../../api/structure';

function formatDateForInput(dateVal) {
  if (dateVal == null || dateVal === '') return '';
  const raw = typeof dateVal === 'string' ? dateVal.trim() : String(dateVal);
  if (!raw) return '';
  // If already YYYY-MM-DD, use as-is (avoids timezone shifts)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return '';
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function EditStudentModal({ visible, student, onClose, onSaved }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [structureClasses, setStructureClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [gradePickerOpen, setGradePickerOpen] = useState(false);
  const [linkedParents, setLinkedParents] = useState([]);
  const [parentSearch, setParentSearch] = useState('');
  const [parentResults, setParentResults] = useState([]);
  const [editingParentId, setEditingParentId] = useState(null);
  const [editParentForm, setEditParentForm] = useState({ fullName: '', relationship: '', email: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible || !student) return;
    const name = student.name ?? student.fullName ?? '';
    setFullName(name);
    setEmail(student.email ?? '');
    setPhone(student.phone ?? '');
    setDateOfBirth(formatDateForInput(student.dateOfBirth ?? student.DateOfBirth));
    setAddress(student.address ?? '');
    setLinkedParents(student.parents ? student.parents.map((p) => ({
      id: p.id,
      name: p.name ?? p.fullName ?? '',
      relationship: p.relationship ?? '',
      email: p.email ?? '',
      phone: p.phone ?? '',
    })) : []);
    setParentSearch('');
    setParentResults([]);
    setEditingParentId(null);
    setEditParentForm({ fullName: '', relationship: '', email: '', phone: '' });
    setSelectedClass(null);
    setGradePickerOpen(false);
    setError(null);
  }, [visible, student]);

  useEffect(() => {
    if (!visible || !student) return;
    let mounted = true;
    getStructureClasses()
      .then((items) => {
        if (!mounted) return;
        const list = Array.isArray(items) ? items : [];
        setStructureClasses(list);
        if (student.classId && list.length > 0) {
          const match = list.find((c) => c.id === student.classId);
          setSelectedClass(match || null);
        } else {
          setSelectedClass(null);
        }
      })
      .catch(() => { if (mounted) setStructureClasses([]); });
    return () => { mounted = false; };
  }, [visible, student?.classId]);

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
        const items = data.items ?? [];
        setParentResults(items.filter((p) => !linkedParents.some((lp) => lp.id === p.id)));
      } catch {
        if (active) setParentResults([]);
      }
    };
    run();
    return () => { active = false; };
  }, [visible, parentSearch, linkedParents]);

  const addParent = (p) => {
    setLinkedParents((prev) => (prev.some((x) => x.id === p.id) ? prev : [...prev, { id: p.id, name: p.name, relationship: p.relationship ?? '', email: p.email ?? '', phone: p.phone ?? '' }]));
    setParentSearch('');
    setParentResults([]);
  };

  const removeParent = (id) => {
    setLinkedParents((prev) => prev.filter((p) => p.id !== id));
    if (editingParentId === id) setEditingParentId(null);
  };

  const startEditParent = (p) => {
    setEditingParentId(p.id);
    setEditParentForm({ fullName: p.name, relationship: p.relationship ?? '', email: p.email ?? '', phone: p.phone ?? '' });
  };

  const cancelEditParent = () => {
    setEditingParentId(null);
  };

  const saveParentEdit = async () => {
    if (!editingParentId) return;
    setError(null);
    try {
      await updateParent(editingParentId, {
        fullName: editParentForm.fullName.trim(),
        relationship: editParentForm.relationship.trim() || null,
        email: editParentForm.email.trim() || null,
        phone: editParentForm.phone.trim() || null,
      });
      setLinkedParents((prev) =>
        prev.map((p) =>
          p.id === editingParentId
            ? { ...p, name: editParentForm.fullName.trim(), relationship: editParentForm.relationship.trim(), email: editParentForm.email.trim(), phone: editParentForm.phone.trim() }
            : p
        )
      );
      setEditingParentId(null);
    } catch (e) {
      setError(e.message || 'Failed to update parent');
    }
  };

  const gradeLabel = selectedClass
    ? [selectedClass.educationLevel, selectedClass.name].filter(Boolean).join(' – ')
    : (student && (student.grade || student.section))
      ? [student.grade, student.section].filter(Boolean).join(' – ')
      : '';
  const selectGrade = (item) => {
    setSelectedClass(item);
    setGradePickerOpen(false);
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      setError('Full name is required.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await updateStudent(student.id, {
        fullName: fullName.trim(),
        gradeLabel: selectedClass?.educationLevel ?? null,
        sectionLabel: selectedClass?.name ?? null,
        rollNumber: student.rollNumber ?? null,
        classId: selectedClass?.id ?? null,
        dateOfBirth: dateOfBirth.trim() ? new Date(dateOfBirth.trim()).toISOString() : null,
        admissionDate: null,
        email: email.trim() || null,
        phone: phone.trim() || null,
        address: address.trim() || null,
        parentIds: linkedParents.map((p) => p.id),
      });
      onSaved?.();
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to update student');
    } finally {
      setSaving(false);
    }
  };

  if (!student) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalWrap} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Edit Student</Text>
                <Text style={styles.subtitle}>Update student information and parent/guardian links.</Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.sectionTitle}>Student Information</Text>
              <View style={styles.field}>
                <Text style={styles.label}>Full name</Text>
                <TextInput style={styles.input} value={fullName} onChangeText={setFullName} placeholder="Full name" placeholderTextColor={colors.textSecondary} />
              </View>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={colors.textSecondary} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>Phone</Text>
                  <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone" placeholderTextColor={colors.textSecondary} keyboardType="phone-pad" />
                </View>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Date of birth</Text>
                <TextInput style={styles.input} value={dateOfBirth} onChangeText={setDateOfBirth} placeholder="YYYY-MM-DD" placeholderTextColor={colors.textSecondary} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Grade / Class</Text>
                <Pressable style={styles.selectWrap} onPress={() => setGradePickerOpen((v) => !v)}>
                  <Text style={[styles.selectTriggerText, !gradeLabel && styles.placeholder]} numberOfLines={1}>{gradeLabel || 'Select grade/class'}</Text>
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} style={styles.selectIcon} />
                </Pressable>
                {gradePickerOpen && structureClasses.length > 0 && (
                  <ScrollView style={styles.pickerList} contentContainerStyle={styles.pickerListContent} nestedScrollEnabled keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator>
                    <Pressable style={styles.pickerOption} onPress={() => selectGrade(null)}><Text style={styles.pickerOptionText}>None</Text></Pressable>
                    {structureClasses.map((c) => (
                      <Pressable key={c.id} style={[styles.pickerOption, selectedClass?.id === c.id && styles.pickerOptionSelected]} onPress={() => selectGrade(c)}>
                        <Text style={styles.pickerOptionText}>{[c.educationLevel, c.name].filter(Boolean).join(' – ')}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                )}
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Address</Text>
                <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Address" placeholderTextColor={colors.textSecondary} />
              </View>

              <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Parent / Guardian</Text>
              {linkedParents.map((p) => (
                <View key={p.id} style={styles.parentCard}>
                  {editingParentId === p.id ? (
                    <>
                      <TextInput style={styles.input} value={editParentForm.fullName} onChangeText={(t) => setEditParentForm((f) => ({ ...f, fullName: t }))} placeholder="Full name" placeholderTextColor={colors.textSecondary} />
                      <TextInput style={styles.input} value={editParentForm.relationship} onChangeText={(t) => setEditParentForm((f) => ({ ...f, relationship: t }))} placeholder="Relationship" placeholderTextColor={colors.textSecondary} />
                      <TextInput style={styles.input} value={editParentForm.email} onChangeText={(t) => setEditParentForm((f) => ({ ...f, email: t }))} placeholder="Email" placeholderTextColor={colors.textSecondary} keyboardType="email-address" />
                      <TextInput style={styles.input} value={editParentForm.phone} onChangeText={(t) => setEditParentForm((f) => ({ ...f, phone: t }))} placeholder="Phone" placeholderTextColor={colors.textSecondary} keyboardType="phone-pad" />
                      <View style={styles.editParentActions}>
                        <Pressable style={styles.smallBtn} onPress={cancelEditParent}><Text style={styles.smallBtnText}>Cancel</Text></Pressable>
                        <Pressable style={[styles.smallBtn, styles.smallBtnPrimary]} onPress={saveParentEdit}><Text style={styles.smallBtnTextPrimary}>Save</Text></Pressable>
                      </View>
                    </>
                  ) : (
                    <>
                      <View style={styles.parentRow}>
                        <View style={styles.flex1}>
                          <Text style={styles.parentName}>{p.name}</Text>
                          <Text style={styles.parentMeta}>{[p.relationship, p.email, p.phone].filter(Boolean).join(' · ')}</Text>
                        </View>
                        <View style={styles.parentActions}>
                          <Pressable onPress={() => startEditParent(p)} style={styles.iconBtn}><MaterialCommunityIcons name="pencil" size={18} color={colors.primary} /></Pressable>
                          <Pressable onPress={() => removeParent(p.id)} style={styles.iconBtn}><MaterialCommunityIcons name="close-circle" size={18} color={colors.danger} /></Pressable>
                        </View>
                      </View>
                    </>
                  )}
                </View>
              ))}
              <View style={styles.field}>
                <Text style={styles.label}>Add existing parent</Text>
                <TextInput style={styles.input} value={parentSearch} onChangeText={setParentSearch} placeholder="Search by name or email..." placeholderTextColor={colors.textSecondary} />
                {parentResults.length > 0 && (
                  <View style={styles.resultsList}>
                    {parentResults.map((p) => (
                      <Pressable key={p.id} style={styles.resultRow} onPress={() => addParent(p)}>
                        <Text style={styles.resultName}>{p.name}</Text>
                        {p.email ? <Text style={styles.resultMeta}>{p.email}</Text> : null}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelBtnText}>Cancel</Text></Pressable>
              <Pressable style={styles.submitBtn} onPress={handleSave} disabled={saving}>
                <Text style={styles.submitBtnText}>{saving ? 'Saving…' : 'Save changes'}</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.gutter },
  modalWrap: { width: '100%', maxWidth: 520 },
  modal: { backgroundColor: colors.white, borderRadius: radii.card, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  closeBtn: { padding: 4 },
  body: { maxHeight: 420, marginBottom: 24 },
  sectionTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  field: { marginBottom: 16 },
  label: { ...typography.small, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.5, marginBottom: 6 },
  input: { ...typography.bodySmall, color: colors.textPrimary, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  selectWrap: { borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, paddingRight: 36 },
  selectTriggerText: { ...typography.bodySmall, color: colors.textPrimary },
  selectIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  placeholder: { color: colors.textSecondary },
  pickerList: { marginTop: 4, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, maxHeight: 180 },
  pickerListContent: { paddingBottom: 8 },
  pickerOption: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  pickerOptionSelected: { backgroundColor: colors.inputBackground },
  pickerOptionText: { ...typography.bodySmall, color: colors.textPrimary },
  parentCard: { marginBottom: 12, padding: 12, backgroundColor: colors.inputBackground, borderRadius: 8 },
  parentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  flex1: { flex: 1 },
  parentName: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  parentMeta: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  parentActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { padding: 4 },
  editParentActions: { flexDirection: 'row', gap: 8, marginTop: 8 },
  smallBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: colors.borderSubtle },
  smallBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  smallBtnPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
  smallBtnTextPrimary: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
  resultsList: { marginTop: 8, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8 },
  resultRow: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  resultName: { ...typography.bodySmall, color: colors.textPrimary },
  resultMeta: { ...typography.small, color: colors.textSecondary },
  errorText: { ...typography.small, color: colors.danger, marginTop: 8 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.borderSubtle },
  cancelBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  submitBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.primary },
  submitBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
});
