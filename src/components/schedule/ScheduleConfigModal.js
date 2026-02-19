import { useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const DEFAULT_BREAKS = [
  { afterPeriodIndex: 2, durationMinutes: 15, label: 'Short break' },
  { afterPeriodIndex: 4, durationMinutes: 45, label: 'Lunch' },
];

function BreakRow({ breakItem, periodCount, onChange, onRemove, canRemove }) {
  return (
    <View style={styles.breakRow}>
      <View style={styles.breakRowLeft}>
        <Text style={styles.breakRowLabel}>After period</Text>
        <TextInput
          style={[styles.input, styles.inputSmall]}
          value={String(breakItem.afterPeriodIndex)}
          onChangeText={(t) => {
            const n = Math.max(1, Math.min(periodCount, parseInt(t, 10) || 1));
            onChange({ ...breakItem, afterPeriodIndex: n });
          }}
          keyboardType="number-pad"
          placeholder="2"
        />
      </View>
      <View style={styles.breakRowMid}>
        <Text style={styles.breakRowLabel}>Duration (min)</Text>
        <TextInput
          style={[styles.input, styles.inputSmall]}
          value={String(breakItem.durationMinutes)}
          onChangeText={(t) => {
            const n = Math.max(0, Math.min(120, parseInt(t, 10) || 0));
            onChange({ ...breakItem, durationMinutes: n });
          }}
          keyboardType="number-pad"
          placeholder="15"
        />
      </View>
      <View style={styles.breakRowRight}>
        <Text style={styles.breakRowLabel}>Label (optional)</Text>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          value={breakItem.label ?? ''}
          onChangeText={(t) => onChange({ ...breakItem, label: t.trim() || null })}
          placeholder="e.g. Lunch"
        />
      </View>
      {canRemove && (
        <Pressable style={styles.removeBtn} onPress={onRemove} hitSlop={8}>
          <MaterialCommunityIcons name="close-circle" size={24} color={colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

export function ScheduleConfigModal({ visible, config, onSave, onClose }) {
  const [periodCount, setPeriodCount] = useState(config?.periodCount ?? 8);
  const [periodDuration, setPeriodDuration] = useState(String(config?.periodDurationMinutes ?? 45));
  const [firstStart, setFirstStart] = useState(config?.firstPeriodStartTime ?? '08:00');
  const [breaks, setBreaks] = useState(config?.breaks?.length ? [...config.breaks] : DEFAULT_BREAKS);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && config) {
      setPeriodCount(config.periodCount ?? 8);
      setPeriodDuration(String(config.periodDurationMinutes ?? 45));
      setFirstStart(config.firstPeriodStartTime ?? '08:00');
      setBreaks(config.breaks?.length ? config.breaks.map((b) => ({ ...b })) : DEFAULT_BREAKS);
      setError(null);
    }
  }, [visible, config]);

  const updateBreak = (index, next) => {
    setBreaks((prev) => {
      const out = [...prev];
      out[index] = next;
      return out;
    });
  };

  const addBreak = () => {
    const used = new Set(breaks.map((b) => b.afterPeriodIndex));
    let after = 1;
    while (used.has(after) && after <= periodCount) after++;
    if (after > periodCount) after = Math.max(1, periodCount);
    setBreaks((prev) => [...prev, { afterPeriodIndex: after, durationMinutes: 15, label: '' }]);
  };

  const removeBreak = (index) => {
    setBreaks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const pd = parseInt(periodDuration, 10);
    if (isNaN(pd) || pd < 5 || pd > 120) {
      setError('Period duration must be 5–120 minutes.');
      return;
    }
    const validBreaks = breaks
      .filter((b) => b.afterPeriodIndex >= 1 && b.afterPeriodIndex <= periodCount && b.durationMinutes >= 0 && b.durationMinutes <= 120)
      .map((b) => ({
        afterPeriodIndex: b.afterPeriodIndex,
        durationMinutes: b.durationMinutes,
        label: b.label?.trim() || null,
      }));
    const unique = validBreaks.filter((b, i, arr) => arr.findIndex((x) => x.afterPeriodIndex === b.afterPeriodIndex) === i);
    setError(null);
    setSaving(true);
    try {
      await onSave({
        periodCount,
        periodDurationMinutes: pd,
        firstPeriodStartTime: firstStart.trim() || '08:00',
        breaks: unique,
      });
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Timetable settings</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <MaterialCommunityIcons name="close" size={24} color={colors.textSecondary} />
            </Pressable>
          </View>
          <ScrollView style={styles.body} keyboardShouldPersistTaps="handled">
            <Text style={styles.label}>Periods per day</Text>
            <TextInput
              style={styles.input}
              value={String(periodCount)}
              onChangeText={(t) => setPeriodCount(Math.max(1, Math.min(20, parseInt(t, 10) || 1)))}
              keyboardType="number-pad"
              placeholder="8"
            />
            <Text style={styles.label}>First period start (HH:mm)</Text>
            <TextInput
              style={styles.input}
              value={firstStart}
              onChangeText={setFirstStart}
              placeholder="08:00"
            />
            <Text style={styles.label}>Lesson period duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={periodDuration}
              onChangeText={setPeriodDuration}
              keyboardType="number-pad"
              placeholder="45"
            />
            <View style={styles.breaksSection}>
              <View style={styles.breaksSectionHeader}>
                <Text style={styles.label}>Break periods</Text>
                <Text style={styles.hint}>Different breaks can have different lengths (e.g. short break 15 min, lunch 45 min).</Text>
                <Pressable style={styles.addBreakBtn} onPress={addBreak}>
                  <MaterialCommunityIcons name="plus" size={18} color={colors.primary} />
                  <Text style={styles.addBreakText}>Add break</Text>
                </Pressable>
              </View>
              {breaks.map((b, index) => (
                <BreakRow
                  key={index}
                  breakItem={b}
                  periodCount={periodCount}
                  onChange={(next) => updateBreak(index, next)}
                  onRemove={() => removeBreak(index)}
                  canRemove={breaks.length > 1}
                />
              ))}
            </View>
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
    maxWidth: 480,
    maxHeight: '90%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.gutter, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  title: { ...typography.h3, color: colors.textPrimary },
  body: { padding: spacing.gutter },
  label: { ...typography.small, color: colors.textSecondary, marginBottom: 6, fontWeight: '600' },
  hint: { ...typography.small, color: colors.textSecondary, marginTop: 2, marginBottom: 8 },
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
  breaksSection: { marginTop: 8, marginBottom: 16 },
  breaksSectionHeader: { marginBottom: 12 },
  addBreakBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, alignSelf: 'flex-start' },
  addBreakText: { ...typography.bodySmall, color: colors.primary, fontWeight: '600' },
  breakRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.inputBackground,
    borderRadius: radii.input,
  },
  breakRowLeft: { width: 72 },
  breakRowMid: { width: 80 },
  breakRowRight: { flex: 1, minWidth: 0 },
  breakRowLabel: { ...typography.small, color: colors.textSecondary, marginBottom: 4, fontWeight: '600' },
  inputSmall: { marginBottom: 0 },
  inputFlex: { marginBottom: 0, flex: 1 },
  removeBtn: { padding: 4, marginLeft: 4 },
  error: { ...typography.small, color: colors.danger, marginBottom: 12 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, padding: spacing.gutter, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20 },
  cancelText: { ...typography.body, color: colors.textSecondary },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: radii.pill },
  saveBtnDisabled: { opacity: 0.7 },
  saveText: { ...typography.body, color: colors.white, fontWeight: '600' },
});
