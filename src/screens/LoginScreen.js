import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationContext';
import { login } from '../api/auth';
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

export function LoginScreen() {
  const { setAuth } = useAuth();
  const { goTo } = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSignIn = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const response = await login(email, password);
      setAuth(response);
    } catch (e) {
      setError(e.message || 'Sign in failed');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <Text style={styles.welcome}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Enter your credentials to access your dashboard
          </Text>
          <AuthInput
            label="Email Address"
            placeholder="admin@school.edu"
            value={email}
            onChangeText={setEmail}
            icon={<IconEnvelope />}
          />
          <View style={styles.passwordWrap}>
            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Password</Text>
              <Pressable onPress={() => {}} accessibilityRole="link">
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>
            </View>
            <View style={styles.inputRow}>
              <View style={styles.icon}><IconLock /></View>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [styles.checkboxRow, pressed && styles.pressed]}
            onPress={() => setKeepSignedIn(!keepSignedIn)}
          >
            <View style={[styles.checkbox, keepSignedIn && styles.checkboxChecked]} />
            <Text style={styles.checkboxLabel}>Keep me signed in</Text>
          </Pressable>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Pressable
            style={({ pressed }) => [styles.signInBtn, (pressed || isSubmitting) && styles.pressed]}
            onPress={handleSignIn}
            disabled={isSubmitting}
            accessibilityRole="button"
          >
            <Text style={styles.signInBtnText}>{isSubmitting ? 'Signing in…' : 'Sign In'}</Text>
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
          <View style={styles.signUpRow}>
            <Text style={styles.signUpPrompt}>Don&apos;t have a school account? </Text>
            <Pressable onPress={() => goTo('signup')} accessibilityRole="link">
              <Text style={styles.signUpLink}>Sign up</Text>
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
  page: {
    flex: 1,
    backgroundColor: colors.authBackground,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  logoTop: { marginBottom: 24 },
  iconText: { fontSize: 16 },
  welcome: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  passwordWrap: { marginBottom: 16 },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: { fontSize: 14, fontWeight: '500', color: colors.textPrimary },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordInput: {
    height: 48,
    backgroundColor: colors.inputBackground,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    paddingLeft: 44,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  forgotText: { fontSize: 14, color: colors.primary, fontWeight: '500' },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    marginRight: 10,
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxLabel: { ...typography.bodySmall, color: colors.textPrimary },
  pressed: { opacity: 0.9 },
  signInBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonPaddingVertical,
    borderRadius: radii.pill,
    alignItems: 'center',
    marginBottom: 24,
  },
  signInBtnText: { fontSize: 16, fontWeight: '600', color: colors.white },
  errorText: { color: '#b91c1c', fontSize: 14, marginBottom: 12 },
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
  signUpRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  signUpPrompt: { ...typography.bodySmall, color: colors.textSecondary },
  signUpLink: { fontSize: 14, fontWeight: '600', color: colors.primary },
  footer: {
    marginTop: 48,
    alignItems: 'center',
  },
  footerCopy: { ...typography.small, color: colors.textSecondary },
  footerLinks: { flexDirection: 'row', gap: 16, marginTop: 8 },
  footerLink: { ...typography.small, color: colors.textSecondary },
});
