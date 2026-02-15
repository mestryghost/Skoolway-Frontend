import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '../contexts/NavigationContext';
import { AuthCard } from '../components/auth/AuthCard';
import { AuthInput } from '../components/auth/AuthInput';
import { Logo } from '../components/landing/Logo';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing, radii } from '../theme/spacing';

function IconEnvelope() {
  return <Text style={styles.iconText}>✉</Text>;
}
function IconLock() {
  return <Text style={styles.iconText}>🔒</Text>;
}

export function SignupScreen() {
  const { goTo } = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <View style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Pressable onPress={() => goTo('landing')} style={styles.logoTop}>
          <Logo />
        </Pressable>
        <AuthCard>
          <Text style={styles.heading}>Create your account</Text>
          <Text style={styles.subtitle}>
            Join Skoolway to manage your school in one place
          </Text>
          <AuthInput
            label="Full name"
            placeholder="Jane Doe"
            value={name}
            onChangeText={setName}
          />
          <AuthInput
            label="Email Address"
            placeholder="admin@school.edu"
            value={email}
            onChangeText={setEmail}
            icon={<IconEnvelope />}
          />
          <AuthInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<IconLock />}
          />
          <AuthInput
            label="Confirm password"
            placeholder="••••••••"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon={<IconLock />}
          />
          <Pressable
            style={({ pressed }) => [styles.signUpBtn, pressed && styles.pressed]}
            accessibilityRole="button"
          >
            <Text style={styles.signUpBtnText}>Sign Up</Text>
          </Pressable>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.dividerLine} />
          </View>
          <View style={styles.socialRow}>
            <Pressable style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialLabel}>Google</Text>
            </Pressable>
            <Pressable style={({ pressed }) => [styles.socialBtn, pressed && styles.pressed]}>
              <Text style={styles.socialIcon}>MS</Text>
              <Text style={styles.socialLabel}>Microsoft</Text>
            </Pressable>
          </View>
          <View style={styles.signInRow}>
            <Text style={styles.signInPrompt}>Already have an account? </Text>
            <Pressable onPress={() => goTo('login')} accessibilityRole="link">
              <Text style={styles.signInLink}>Sign in</Text>
            </Pressable>
          </View>
        </AuthCard>
        <View style={styles.footer}>
          <Text style={styles.footerCopy}>© {new Date().getFullYear()} Skoolway Platform</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Help Center</Text>
            <Text style={styles.footerLink}>Privacy</Text>
            <Text style={styles.footerLink}>Terms</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.authBackground },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  logoTop: { marginBottom: 24 },
  iconText: { fontSize: 16 },
  heading: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  pressed: { opacity: 0.9 },
  signUpBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonPaddingVertical,
    borderRadius: radii.pill,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  signUpBtnText: { fontSize: 16, fontWeight: '600', color: colors.white },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.borderSubtle },
  dividerText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginHorizontal: 16,
    fontWeight: '600',
  },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.white,
  },
  socialIcon: { fontSize: 16, fontWeight: '700', color: colors.textPrimary },
  socialLabel: { fontSize: 14, color: colors.textPrimary },
  signInRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  signInPrompt: { ...typography.bodySmall, color: colors.textSecondary },
  signInLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
  footer: { marginTop: 48, alignItems: 'center' },
  footerCopy: { ...typography.small, color: colors.textSecondary },
  footerLinks: { flexDirection: 'row', gap: 16, marginTop: 8 },
  footerLink: { ...typography.small, color: colors.textSecondary },
});
