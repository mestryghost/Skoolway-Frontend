import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { Logo } from './Logo';

export function Header({ scrolled = false }) {
  const { goTo } = useNavigation();
  const headerStyle = [
    styles.header,
    scrolled && styles.headerScrolled,
  ];

  return (
    <View
      style={headerStyle}
      pointerEvents="box-none"
      accessibilityRole="banner"
    >
      <View style={styles.inner}>
        <Pressable onPress={() => goTo('landing')} style={styles.logoWrap}>
          <Logo />
        </Pressable>
        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [styles.signIn, pressed && styles.pressed]}
            onPress={() => goTo('login')}
            accessibilityRole="link"
            accessibilityLabel="Sign in"
          >
            <Text style={styles.signInText}>Sign in</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.cta,
              pressed && styles.ctaPressed,
            ]}
            onPress={() => goTo('signup')}
            accessibilityRole="button"
            accessibilityLabel="Get Started"
          >
            <Text style={styles.ctaText}>Get Started</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: spacing.headerHeight,
    justifyContent: 'center',
    paddingHorizontal: spacing.pageHorizontal,
    position: Platform.OS === 'web' ? 'sticky' : 'relative',
    top: 0,
    zIndex: 100,
    backgroundColor: 'transparent',
  },
  headerScrolled: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      },
    }),
  },
  logoWrap: { padding: 4 },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.gutter,
  },
  signIn: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 44,
    justifyContent: 'center',
  },
  signInText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  cta: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  ctaPressed: { opacity: 0.9 },
  pressed: { opacity: 0.8 },
  ctaText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
});
