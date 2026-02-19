import { useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function ScheduleConfigModal({ visible, config, onSave, onClose }) {
  const [periodCount, setPeriodCount] = useState(config?.periodCount ?? 8);
  const [breakAfterPeriod, setBreakAfterPeriod] = useState(config?.breakAfterPeriod ?? 4);
  const [periodDuration, setPeriodDuration] = useState(String(config?.periodDurationMinutes ?? 45));
  const [firstStart, setFirstStart] = useState(config?.firstPeriodStartTime ?? '08:00');
  const [breakDuration, setBreakDuration] = useState(String(config?.breakDurationMinutes ?? 15));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (visible && config) {
      setPeriodCount(config.periodCount ?? 8);
      setBreakAfterPeriod(config.breakAfterPeriod ?? 4);
      setPeriodDuration(String(config.periodDurationMinutes ?? 45));
      setFirstStart(config.firstPeriodStartTime ?? '08:00');
      setBreakDuration(String(config.breakDurationMinutes ?? 15));
      setError(null);
    }
  }, [visible, config]);

  const handleSave = async () => {
    const pd = parseInt(periodDuration, 10);
    const bd = parseInt(breakDuration, 10);
    if (isNaN(pd) || pd < 5 || pd > 120) {
      setError('Period duration must be 5–120 minutes.');
      return;
    }
    if (isNaN(bd) || bd < 0 || bd > 60) {
      setError('Break duration must be 0–60 minutes.');
      return;
    }
    if (breakAfterPeriod < 0 || breakAfterPeriod > periodCount) {
      setError('Break after period must be 0 to ' + periodCount);
      return;
    }
    setError(null);
    setSaving(true);
    try {
      await onSave({
        periodCount,
        breakAfterPeriod,
        periodDurationMinutes: pd,
        firstPeriodStartTime: firstStart.trim() || '08:00',
        breakDurationMinutes: bd,
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
            <Text style={styles.label}>Break after period (0 = none)</Text>
            <TextInput
              style={styles.input}
              value={String(breakAfterPeriod)}
              onChangeText={(t) => setBreakAfterPeriod(Math.max(0, Math.min(periodCount, parseInt(t, 10) || 0)))}
              keyboardType="number-pad"
              placeholder="4"
            />
            <Text style={styles.label}>First period start (HH:mm)</Text>
            <TextInput
              style={styles.input}
              value={firstStart}
              onChangeText={setFirstStart}
              placeholder="08:00"
            />
            <Text style={styles.label}>Period duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={periodDuration}
              onChangeText={setPeriodDuration}
              keyboardType="number-pad"
              placeholder="45"
            />
            <Text style={styles.label}>Break duration (minutes)</Text>
            <TextInput
              style={styles.input}
              value={breakDuration}
              onChangeText={setBreakDuration}
              keyboardType="number-pad"
              placeholder="15"
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
    maxWidth: 400,
    maxHeight: '90%',
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.gutter, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  title: { ...typography.h3, color: colors.textPrimary },
  body: { padding: spacing.gutter },
  label: { ...typography.small, color: colors.textSecondary, marginBottom: 6, fontWeight: '600' },
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
