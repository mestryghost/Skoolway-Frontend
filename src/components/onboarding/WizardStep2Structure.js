import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { WizardCard } from './WizardCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const DEFAULT_CLASSES = {
  Primary: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'],
  Secondary: ['Form 1', 'Form 2', 'Form 3', 'Form 4'],
  TVET: ['Year 1', 'Year 2', 'Year 3'],
  University: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
};

const DEFAULT_SUBJECTS = {
  Primary: ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE'],
  Secondary: ['Mathematics', 'English', 'Kiswahili', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History'],
  TVET: ['Core trade', 'Mathematics', 'English', 'Life skills'],
  University: ['Core modules', 'Electives'],
};

function initialLevelState(levels) {
  const state = {};
  levels.forEach((level) => {
    state[level] = {
      classNames: (DEFAULT_CLASSES[level] ?? []).join('\n'),
      subjectNames: (DEFAULT_SUBJECTS[level] ?? []).join('\n'),
    };
  });
  return state;
}

export function WizardStep2Structure({ onNext, onBack }) {
  const { selectedInstitutionTypes } = useAuth();
  const levels = (selectedInstitutionTypes && selectedInstitutionTypes.length > 0)
    ? selectedInstitutionTypes
    : ['Primary'];

  const [levelState, setLevelState] = useState(() => initialLevelState(levels));

  useEffect(() => {
    setLevelState((prev) => {
      const next = { ...prev };
      levels.forEach((level) => {
        if (!next[level]) next[level] = { classNames: (DEFAULT_CLASSES[level] ?? []).join('\n'), subjectNames: (DEFAULT_SUBJECTS[level] ?? []).join('\n') };
      });
      return next;
    });
  }, [levels.join(',')]);

  const handleClassChange = (level, value) => {
    setLevelState((prev) => ({ ...prev, [level]: { ...prev[level], classNames: value } }));
  };

  const handleSubjectChange = (level, value) => {
    setLevelState((prev) => ({ ...prev, [level]: { ...prev[level], subjectNames: value } }));
  };

  const handleSubmit = () => {
    const levelStructures = levels.map((level) => {
      const s = levelState[level] || { classNames: '', subjectNames: '' };
      const classes = s.classNames.split('\n').map((x) => x.trim()).filter(Boolean);
      const subjects = s.subjectNames.split('\n').map((x) => x.trim()).filter(Boolean);
      return { level, classNames: classes, subjectNames: subjects };
    });
    onNext({ levelStructures });
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <WizardCard>
        <Text style={styles.title}>Step 2 — School Structure</Text>
        <Text style={styles.subtitle}>
          Set classes and subjects for each level you selected. Only relevant sections are shown.
        </Text>

        {levels.map((level) => (
          <View key={level} style={styles.section}>
            <Text style={styles.sectionTitle}>{level}</Text>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Classes (one per line)</Text>
              <TextInput
                style={styles.textArea}
                value={levelState[level]?.classNames ?? ''}
                onChangeText={(v) => handleClassChange(level, v)}
                placeholder={level === 'Primary' ? 'Grade 1, Grade 2...' : level === 'Secondary' ? 'Form 1, Form 2...' : 'One per line'}
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>
            <View style={styles.inputWrap}>
              <Text style={styles.label}>Subjects (one per line)</Text>
              <TextInput
                style={styles.textArea}
                value={levelState[level]?.subjectNames ?? ''}
                onChangeText={(v) => handleSubjectChange(level, v)}
                placeholder="Mathematics, English, ..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        ))}

        <View style={styles.row}>
          <Pressable style={styles.btnSecondary} onPress={onBack}>
            <Text style={styles.btnSecondaryText}>Back</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={handleSubmit}>
            <Text style={styles.btnText}>Continue</Text>
          </Pressable>
        </View>
      </WizardCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.gutter },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 24 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 },
  inputWrap: { marginBottom: 16 },
  textArea: {
    height: 100,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  row: { flexDirection: 'row', gap: 12, marginTop: 24 },
  btn: { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.buttonPaddingVertical, borderRadius: 24, alignItems: 'center' },
  btnSecondary: { flex: 1, paddingVertical: spacing.buttonPaddingVertical, borderRadius: 24, alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
