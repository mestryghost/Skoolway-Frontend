import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { getStructureClasses, createClass } from '../../api/structure';

export function AddClassModal({ visible, onClose, onSaved }) {
  const [grade, setGrade] = useState('');
  const [customGrade, setCustomGrade] = useState('');
  const [stream, setStream] = useState('');
  const [gradeOptions, setGradeOptions] = useState([]);
  const [gradePickerOpen, setGradePickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visible) return;
    setGrade('');
    setCustomGrade('');
    setStream('');
    setGradePickerOpen(false);
    setError(null);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    getStructureClasses()
      .then((items) => {
        if (!mounted) return;
        const list = Array.isArray(items) ? items : [];
        const levels = [...new Set(list.map((c) => c.educationLevel).filter(Boolean))].sort();
        setGradeOptions(levels);
      })
      .catch(() => { if (mounted) setGradeOptions([]); });
    return () => { mounted = false; };
  }, [visible]);

  const handleSubmit = async () => {
    const educationLevel = (grade === 'Other' ? customGrade : grade).trim();
    const name = stream.trim();
    if (!educationLevel) {
      setError('Grade is required.');
      return;
    }
    if (!name) {
      setError('Stream is required.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await createClass({ educationLevel, name });
      onSaved?.();
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to create class');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalWrap} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Add New Class</Text>
                <Text style={styles.subtitle}>
                  Add a stream to a grade. Class = Grade + Stream (e.g. Grade 10 – Stream A). No room needed.
                </Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.field}>
                <Text style={styles.label}>Grade</Text>
                {gradeOptions.length > 0 ? (
                  <>
                    <Pressable
                      style={styles.selectWrap}
                      onPress={() => setGradePickerOpen((v) => !v)}
                    >
                      <Text
                        style={[styles.selectText, !grade && styles.placeholder]}
                        numberOfLines={1}
                      >
                        {grade === 'Other' ? `Other: ${customGrade || '...'}` : (grade || 'Select grade')}
                      </Text>
                      <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} style={styles.selectIcon} />
                    </Pressable>
                    {gradePickerOpen && (
                      <ScrollView style={styles.pickerList} nestedScrollEnabled keyboardShouldPersistTaps="handled">
                        {gradeOptions.map((level) => (
                          <Pressable
                            key={level}
                            style={[styles.pickerOption, grade === level && styles.pickerOptionSelected]}
                            onPress={() => { setGrade(level); setGradePickerOpen(false); }}
                          >
                            <Text style={styles.pickerOptionText}>{level}</Text>
                          </Pressable>
                        ))}
                        <Pressable
                          style={[styles.pickerOption, grade === 'Other' && styles.pickerOptionSelected]}
                          onPress={() => { setGrade('Other'); setGradePickerOpen(false); }}
                        >
                          <Text style={styles.pickerOptionText}>Other (type below)</Text>
                        </Pressable>
                      </ScrollView>
                    )}
                    {grade === 'Other' && (
                      <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        placeholder="e.g. Grade 10, Form 1"
                        placeholderTextColor={colors.textSecondary}
                        value={customGrade}
                        onChangeText={setCustomGrade}
                      />
                    )}
                  </>
                ) : (
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Grade 10, Form 1"
                    placeholderTextColor={colors.textSecondary}
                    value={grade}
                    onChangeText={setGrade}
                  />
                )}
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Stream</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. A, B, C"
                  placeholderTextColor={colors.textSecondary}
                  value={stream}
                  onChangeText={setStream}
                  autoCapitalize="characters"
                />
              </View>
              <Text style={styles.hint}>
                This creates one class (Grade + Stream). Add more streams to the same grade to see how many streams each grade has.
              </Text>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
            </ScrollView>
            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={handleSubmit} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Text style={styles.submitBtnText}>Create Class</Text>
                )}
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
  closeBtn: { padding: 4, marginTop: -4, marginRight: -4 },
  body: { marginBottom: 24 },
  field: { marginBottom: 20 },
  label: { ...typography.small, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  input: { ...typography.bodySmall, color: colors.textPrimary, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  selectWrap: { borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12, paddingRight: 36 },
  selectText: { ...typography.bodySmall, color: colors.textPrimary },
  placeholder: { color: colors.textSecondary },
  selectIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  pickerList: { marginTop: 4, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, maxHeight: 200 },
  pickerOption: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  pickerOptionSelected: { backgroundColor: colors.inputBackground },
  pickerOptionText: { ...typography.bodySmall, color: colors.textPrimary },
  hint: { ...typography.small, color: colors.textSecondary, marginTop: 8 },
  errorText: { ...typography.small, color: colors.danger, marginTop: 12 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle },
  cancelBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  submitBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.primary, minWidth: 120, alignItems: 'center' },
  submitBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
});
