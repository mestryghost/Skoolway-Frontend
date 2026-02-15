import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

const BULLETS = [
  'Up to 500 students',
  'Core modules included',
  'Email support',
];

export function PricingCard({
  name,
  price,
  period,
  cta,
  recommended,
  bullets = BULLETS,
}) {
  const cardStyle = [
    styles.card,
    recommended && styles.cardRecommended,
  ];

  return (
    <View style={cardStyle} accessibilityRole="article">
      {recommended && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>RECOMMENDED</Text>
        </View>
      )}
      <Text style={recommended ? styles.nameLight : styles.name}>{name}</Text>
      <View style={styles.priceRow}>
        <Text style={recommended ? styles.priceLight : styles.price}>
          {price}
        </Text>
        {period ? (
          <Text style={recommended ? styles.periodLight : styles.period}>
            {period}
          </Text>
        ) : null}
      </View>
      <View style={styles.bullets}>
        {bullets.map((b, i) => (
          <Text
            key={i}
            style={recommended ? styles.bulletLight : styles.bullet}
          >
            • {b}
          </Text>
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [
          recommended ? styles.ctaLight : styles.cta,
          pressed && styles.pressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={cta}
      >
        <Text
          style={recommended ? styles.ctaTextLight : styles.ctaText}
        >
          {cta}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 260,
    backgroundColor: colors.cardSurface,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardRecommended: {
    backgroundColor: colors.primary,
    transform: [{ scale: 1.02 }],
  },
  badge: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 1,
  },
  name: { ...typography.h3, color: colors.textPrimary },
  nameLight: { ...typography.h3, color: colors.white },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 8 },
  price: { ...typography.h1, fontSize: 32, color: colors.textPrimary },
  priceLight: { ...typography.h1, fontSize: 32, color: colors.white },
  period: { ...typography.body, color: colors.textSecondary, marginLeft: 4 },
  periodLight: { ...typography.body, color: 'rgba(255,255,255,0.9)', marginLeft: 4 },
  bullets: { marginTop: 16 },
  bullet: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  bulletLight: { ...typography.bodySmall, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  cta: {
    marginTop: 24,
    paddingVertical: spacing.buttonPaddingVertical,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  ctaLight: {
    marginTop: 24,
    paddingVertical: spacing.buttonPaddingVertical,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  ctaText: { fontSize: 14, fontWeight: '600', color: colors.white },
  ctaTextLight: { fontSize: 14, fontWeight: '600', color: colors.primary },
  pressed: { opacity: 0.9 },
});
