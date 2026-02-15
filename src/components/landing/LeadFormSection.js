import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { landingCopy } from '../../constants/landing';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function LeadFormSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!email.trim()) return;
    setSubmitted(true);
  };

  const { leadForm } = landingCopy;

  return (
    <View style={styles.wrapper} accessibilityRole="region">
      <View style={styles.inner}>
        <Text style={styles.title}>{leadForm.title}</Text>
        <Text style={styles.subtitle}>{leadForm.subtitle}</Text>
        {submitted ? (
          <Text
            style={styles.success}
            accessibilityLiveRegion="polite"
          >
            Thanks! We&apos;ll get back to you.
          </Text>
        ) : (
          <View style={styles.formRow}>
            <TextInput
              style={styles.input}
              placeholder={leadForm.placeholder}
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email address"
            />
            <Pressable
              style={({ pressed }) => [
                styles.cta,
                pressed && styles.pressed,
              ]}
              onPress={handleSubmit}
              accessibilityRole="button"
              accessibilityLabel={leadForm.cta}
            >
              <Text style={styles.ctaText}>{leadForm.cta}</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.textPrimary,
    marginHorizontal: spacing.pageHorizontal,
    borderRadius: radii.card,
    padding: spacing.sectionGap,
    marginVertical: spacing.sectionGap,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  inner: { maxWidth: 560 },
  title: {
    ...typography.h2,
    color: colors.white,
  },
  subtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },
  input: {
    flex: 1,
    minWidth: 200,
    height: 48,
    backgroundColor: colors.cardSurface,
    borderRadius: radii.pill,
    paddingHorizontal: 20,
    fontSize: 16,
    color: colors.textPrimary,
  },
  cta: {
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  ctaText: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  pressed: { opacity: 0.9 },
  success: {
    ...typography.body,
    color: colors.primary,
    marginTop: 16,
  },
});
