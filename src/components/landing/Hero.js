import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '../../contexts/NavigationContext';
import { landingCopy } from '../../constants/landing';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function Hero() {
  const { goTo } = useNavigation();
  const { hero } = landingCopy;

  return (
    <View style={styles.wrapper} accessibilityRole="main">
      <View style={styles.inner}>
        <View style={styles.left}>
          <Text style={styles.h1}>
            {hero.title}
            <Text style={styles.h1Highlight}>{hero.titleHighlight}</Text>
          </Text>
          <Text style={styles.subtitle}>{hero.subtitle}</Text>
          <View style={styles.ctaRow}>
            <Pressable
              style={({ pressed }) => [
                styles.ctaPrimary,
                pressed && styles.pressed,
              ]}
              onPress={() => goTo('signup')}
              accessibilityRole="button"
              accessibilityLabel={hero.ctaPrimary}
            >
              <Text style={styles.ctaPrimaryText}>{hero.ctaPrimary}</Text>
              <Text style={styles.ctaPrimaryText}> →</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.ctaSecondary,
                pressed && styles.pressed,
              ]}
              onPress={() => goTo('signup')}
              accessibilityRole="button"
              accessibilityLabel={hero.ctaSecondary}
            >
              <Text style={styles.ctaSecondaryText}>{hero.ctaSecondary}</Text>
            </Pressable>
          </View>
          <Text style={styles.trust}>{hero.trust}</Text>
        </View>
        <View style={styles.right}>
          <View style={styles.heroCard}>
            <View style={styles.heroCardInner}>
              <View style={styles.mockScreen} />
              {Platform.OS === 'web' && (
                <View style={styles.decorStar} pointerEvents="none" />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: spacing.heroMinHeight,
    paddingVertical: spacing.sectionGap,
    paddingHorizontal: spacing.pageHorizontal,
  },
  inner: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    gap: spacing.sectionGap,
    alignItems: 'center',
  },
  left: {
    flex: 1,
    minWidth: 280,
  },
  h1: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  h1Highlight: { color: colors.primary },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 16,
    maxWidth: 480,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 24,
  },
  ctaPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctaPrimaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  ctaSecondary: {
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ctaSecondaryText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.primary,
  },
  pressed: { opacity: 0.9 },
  trust: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 24,
  },
  right: {
    flex: 1,
    minWidth: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: radii.card + 4,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    padding: 24,
  },
  heroCardInner: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: radii.card,
    minHeight: 280,
    overflow: 'hidden',
    position: 'relative',
  },
  mockScreen: {
    flex: 1,
    minHeight: 280,
    backgroundColor: colors.pageBackground,
  },
  decorStar: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentMuted,
    opacity: 0.6,
  },
});
