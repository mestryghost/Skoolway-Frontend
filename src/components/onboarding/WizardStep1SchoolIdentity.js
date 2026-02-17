import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AuthInput } from '../auth/AuthInput';
import { WizardCard } from './WizardCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const INSTITUTION_TYPE_PILLS = [
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'TVET', label: 'TVET' },
  { value: 'University', label: 'University' },
];

function toggleSet(set, value) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function WizardStep1SchoolIdentity({ onSubmit, isSubmitting }) {
  const [selectedTypes, setSelectedTypes] = useState(new Set());
  const [schoolName, setSchoolName] = useState('');
  const [nemisCode, setNemisCode] = useState('');
  const [knecCode, setKnecCode] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [county, setCounty] = useState('');
  const [subCounty, setSubCounty] = useState('');
  const [schoolType, setSchoolType] = useState('');
  const [tvetRegistrationNumber, setTvetRegistrationNumber] = useState('');
  const [tvetCategory, setTvetCategory] = useState('');
  const [cueStatus, setCueStatus] = useState('');
  const [accreditationNumber, setAccreditationNumber] = useState('');

  const hasPrimaryOrSecondary = selectedTypes.has('Primary') || selectedTypes.has('Secondary');
  const hasTVET = selectedTypes.has('TVET');
  const hasUniversity = selectedTypes.has('University');

  const handlePillPress = (value) => {
    setSelectedTypes((prev) => toggleSet(prev, value));
  };

  const handleSubmit = () => {
    const institutionTypes = Array.from(selectedTypes);
    const payload = {
      institutionTypes,
      schoolName: schoolName.trim(),
      nemisCode: hasPrimaryOrSecondary ? (nemisCode.trim() || undefined) : undefined,
      knecCode: hasPrimaryOrSecondary ? (knecCode.trim() || undefined) : undefined,
      registrationNumber: (registrationNumber.trim() || undefined),
      county: (county.trim() || undefined),
      subCounty: (subCounty.trim() || undefined),
      schoolType: hasPrimaryOrSecondary ? (schoolType.trim() || undefined) : undefined,
      tvetRegistrationNumber: hasTVET ? (tvetRegistrationNumber.trim() || undefined) : undefined,
      tvetCategory: hasTVET ? (tvetCategory.trim() || undefined) : undefined,
      cueStatus: hasUniversity ? (cueStatus.trim() || undefined) : undefined,
      accreditationNumber: hasUniversity ? (accreditationNumber.trim() || undefined) : undefined,
    };
    onSubmit(payload);
  };

  const canSubmit = schoolName.trim().length > 0 && selectedTypes.size > 0;

  return (
    <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
      <WizardCard>
        <Text style={styles.title}>Step 1 — School Identity</Text>
        <Text style={styles.subtitle}>Choose all that apply. Only relevant fields will appear in the next steps.</Text>

        <Text style={styles.label}>Institution type (pick one or more)</Text>
        <View style={styles.pillRow}>
          {INSTITUTION_TYPE_PILLS.map((opt) => (
            <Pressable
              key={opt.value}
              style={[styles.pill, selectedTypes.has(opt.value) && styles.pillSelected]}
              onPress={() => handlePillPress(opt.value)}
            >
              <Text style={[styles.pillText, selectedTypes.has(opt.value) && styles.pillTextSelected]}>
                {opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <AuthInput label="School name" placeholder="e.g. Riverside Academy" value={schoolName} onChangeText={setSchoolName} />

        {hasPrimaryOrSecondary && (
          <>
            <AuthInput label="NEMIS code (4-character)" placeholder="Optional for now" value={nemisCode} onChangeText={setNemisCode} />
            <AuthInput label="KNEC code" placeholder="Optional" value={knecCode} onChangeText={setKnecCode} />
            <AuthInput label="Registration number" placeholder="Optional" value={registrationNumber} onChangeText={setRegistrationNumber} />
            <AuthInput label="County" placeholder="e.g. Nairobi" value={county} onChangeText={setCounty} />
            <AuthInput label="Sub-county" placeholder="Optional" value={subCounty} onChangeText={setSubCounty} />
            <AuthInput label="School type" placeholder="e.g. Public, Private" value={schoolType} onChangeText={setSchoolType} />
          </>
        )}

        {hasTVET && (
          <>
            <AuthInput label="TVET registration number" placeholder="Optional" value={tvetRegistrationNumber} onChangeText={setTvetRegistrationNumber} />
            <AuthInput label="TVET category" placeholder="Optional" value={tvetCategory} onChangeText={setTvetCategory} />
          </>
        )}

        {hasUniversity && (
          <>
            <AuthInput label="CUE status" placeholder="Optional" value={cueStatus} onChangeText={setCueStatus} />
            <AuthInput label="Accreditation number" placeholder="Optional" value={accreditationNumber} onChangeText={setAccreditationNumber} />
          </>
        )}

        <Pressable
          style={[styles.btn, (!canSubmit || isSubmitting) && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          <Text style={styles.btnText}>{isSubmitting ? 'Creating…' : 'Continue'}</Text>
        </Pressable>
      </WizardCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: spacing.gutter },
  title: { ...typography.h2, color: colors.textPrimary, marginBottom: 8 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 24 },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary, marginBottom: 8 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  pill: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radii.pill, borderWidth: 1, borderColor: colors.borderSubtle },
  pillSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontSize: 14, color: colors.textPrimary },
  pillTextSelected: { color: colors.white },
  btn: { backgroundColor: colors.primary, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center', marginTop: 24 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
