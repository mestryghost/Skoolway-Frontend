import { useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { DAY_LABELS } from './scheduleUtils';

export function SlotEditModal({
  visible,
  slot,
  options,
  onSave,
  onClose,
}) {
  const { classes = [], subjects = [], teachers = [] } = options ?? {};
  const [classId, setClassId] = useState(slot?.classId ?? null);
  const [dayOfWeek, setDayOfWeek] = useState(slot?.dayOfWeek ?? 1);
  const [periodIndex, setPeriodIndex] = useState(slot?.periodIndex ?? 1);
  const [subjectId, setSubjectId] = useState(slot?.subjectId ?? null);
  const [teacherId, setTeacherId] = useState(slot?.teacherId ?? null);
  const [room, setRoom] = useState(slot?.room ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible) {
      setClassId(slot?.classId ?? (classes[0]?.id ?? null));
      setDayOfWeek(slot?.dayOfWeek ?? 1);
      setPeriodIndex(slot?.periodIndex ?? 1);
      setSubjectId(slot?.subjectId ?? (subjects[0]?.id ?? null));
      setTeacherId(slot?.teacherId ?? (teachers[0]?.id ?? null));
      setRoom(slot?.room ?? '');
      setError(null);
    }
  }, [visible, slot, classes, subjects, teachers]);

  const handleSave = async () => {
    if (!classId || !subjectId || !teacherId) {
      setError('Please select class, subject, and teacher.');
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        classId,
        dayOfWeek,
        periodIndex,
        subjectId,
        teacherId,
        room: room.trim() || undefined,
      });
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>{slot?.slotId ? 'Edit slot' : 'Add to timetable'}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Class</Text>
            <View style={styles.pickerWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {classes.map((c) => (
                  <Pressable
                    key={c.id}
                    style={[styles.chip, classId === c.id && styles.chipActive]}
                    onPress={() => setClassId(c.id)}
                  >
                    <Text style={[styles.chipText, classId === c.id && styles.chipTextActive]}>{c.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.label}>Day</Text>
            <View style={styles.pickerWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {DAY_LABELS.map((_, i) => (
                  <Pressable
                    key={i}
                    style={[styles.chip, dayOfWeek === i + 1 && styles.chipActive]}
                    onPress={() => setDayOfWeek(i + 1)}
                  >
                    <Text style={[styles.chipText, dayOfWeek === i + 1 && styles.chipTextActive]}>{DAY_LABELS[i]}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.label}>Period</Text>
            <View style={styles.pickerWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((p) => (
                  <Pressable
                    key={p}
                    style={[styles.chip, periodIndex === p && styles.chipActive]}
                    onPress={() => setPeriodIndex(p)}
                  >
                    <Text style={[styles.chipText, periodIndex === p && styles.chipTextActive]}>P{p}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.label}>Subject</Text>
            <View style={styles.pickerWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {subjects.map((s) => (
                  <Pressable
                    key={s.id}
                    style={[styles.chip, subjectId === s.id && styles.chipActive]}
                    onPress={() => setSubjectId(s.id)}
                  >
                    <Text style={[styles.chipText, subjectId === s.id && styles.chipTextActive]}>{s.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.label}>Teacher</Text>
            <View style={styles.pickerWrap}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pickerScroll}>
                {teachers.map((t) => (
                  <Pressable
                    key={t.id}
                    style={[styles.chip, teacherId === t.id && styles.chipActive]}
                    onPress={() => setTeacherId(t.id)}
                  >
                    <Text style={[styles.chipText, teacherId === t.id && styles.chipTextActive]}>{t.fullName}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <Text style={styles.label}>Room (optional)</Text>
            <TextInput
              style={styles.input}
              value={room}
              onChangeText={setRoom}
              placeholder="e.g. C101"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>
          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.saveBtn, saving && styles.saveBtnDisabled]} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveText}>{saving ? 'Saving…' : 'Save'}</Text>
            </Pressable>
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
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.cardSmall,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.gutter, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  title: { ...typography.h3, color: colors.textPrimary },
  body: { padding: spacing.gutter },
  label: { ...typography.small, color: colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  pickerWrap: { marginBottom: 16 },
  pickerScroll: { flexGrow: 0 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radii.pill,
    backgroundColor: colors.inputBackground,
    marginRight: 8,
  },
  chipActive: { backgroundColor: colors.primary },
  chipText: { ...typography.bodySmall, color: colors.textPrimary },
  chipTextActive: { color: colors.white, fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: radii.input,
    paddingHorizontal: 12,
    paddingVertical: 10,
    ...typography.body,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  error: { ...typography.small, color: colors.danger, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: spacing.gutter, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { ...typography.body, color: colors.textSecondary },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: radii.pill },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { ...typography.body, color: colors.white, fontWeight: '600' },
});