import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WizardCard } from './WizardCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function WizardStep3Import({ onNext, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <WizardCard>
        <Text style={styles.title}>Step 3 — User Import</Text>
        <Text style={styles.subtitle}>
          Add teachers, students, and parents. You can upload CSV, add manually, or use magic invite links later.
        </Text>
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>CSV upload, manual add, and magic links will be available here.</Text>
          <Text style={styles.placeholderSub}>For now, continue to complete setup.</Text>
        </View>
        <View style={styles.row}>
          <Pressable style={styles.btnSecondary} onPress={onBack}>
            <Text style={styles.btnSecondaryText}>Back</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={() => onNext({})}>
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
  placeholder: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: colors.inputBackground, borderRadius: radii.cardSmall, marginBottom: 24 },
  placeholderText: { ...typography.bodySmall, color: colors.textSecondary },
  placeholderSub: { ...typography.small, color: colors.textSecondary, marginTop: 8 },
  row: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center' },
  btnSecondary: { flex: 1, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
