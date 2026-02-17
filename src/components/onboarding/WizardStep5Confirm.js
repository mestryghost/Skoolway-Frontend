import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { WizardCard } from './WizardCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function WizardStep5Confirm({ schoolName, tenantCode, onComplete, onBack, isSubmitting }) {
  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <WizardCard>
        <Text style={styles.title}>Step 5 — Confirm & Activate</Text>
        <Text style={styles.subtitle}>Review and complete setup. Your school will go live.</Text>
        <View style={styles.summary}>
          <Text style={styles.summaryLabel}>School</Text>
          <Text style={styles.summaryValue}>{schoolName || '—'}</Text>
          <Text style={styles.summaryLabel}>Tenant code</Text>
          <Text style={styles.summaryValue}>{tenantCode || '—'}</Text>
        </View>
        <View style={styles.row}>
          <Pressable style={styles.btnSecondary} onPress={onBack} disabled={isSubmitting}>
            <Text style={styles.btnSecondaryText}>Back</Text>
          </Pressable>
          <Pressable style={[styles.btn, isSubmitting && styles.btnDisabled]} onPress={onComplete} disabled={isSubmitting}>
            <Text style={styles.btnText}>{isSubmitting ? 'Activating…' : 'Complete Setup'}</Text>
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
  summary: { backgroundColor: colors.inputBackground, borderRadius: radii.cardSmall, padding: 16, marginBottom: 24 },
  summaryLabel: { ...typography.small, color: colors.textSecondary },
  summaryValue: { ...typography.body, color: colors.textPrimary, marginBottom: 12 },
  row: { flexDirection: 'row', gap: 12 },
  btn: { flex: 1, backgroundColor: colors.primary, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center' },
  btnSecondary: { flex: 1, paddingVertical: spacing.buttonPaddingVertical, borderRadius: radii.pill, alignItems: 'center', borderWidth: 1, borderColor: colors.primary },
  btnDisabled: { opacity: 0.6 },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: colors.primary },
  btnText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
