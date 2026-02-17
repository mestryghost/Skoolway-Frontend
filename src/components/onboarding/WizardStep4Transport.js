import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WizardCard } from './WizardCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function WizardStep4Transport({ onNext, onBack }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <WizardCard>
        <Text style={styles.title}>Step 4 — Transport (Optional)</Text>
        <Text style={styles.subtitle}>Configure buses, drivers, and routes later from your dashboard.</Text>
        <View style={styles.row}>
          <Pressable style={styles.btnSecondary} onPress={onBack}>
            <Text style={styles.btnSecondaryText}>Back</Text>
          </Pressable>
          <Pressable style={styles.btn} onPress={() => onNext({})}>
            <Text style={styles.btnText}>Skip & Continue</Text>
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
  row: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center' },
  btnSecondary: { flex: 1, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
