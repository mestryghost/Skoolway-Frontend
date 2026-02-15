import { StyleSheet, Text, View } from 'react-native';
import { landingCopy } from '../../constants/landing';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function FeatureGrid() {
  const features = landingCopy.features;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.sectionTitle}>
        Unified Management, Infinite Possibilities
      </Text>
      <View style={styles.grid}>
        {features.map((f) => (
          <View
            key={f.id}
            style={styles.card}
            accessibilityRole="article"
          >
            <View style={styles.iconPlaceholder} />
            <Text style={styles.cardTitle}>{f.title}</Text>
            <Text style={styles.cardDesc}>
              Streamline operations and scale with confidence.
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingVertical: spacing.sectionGap,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: spacing.sectionGap,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
  },
  card: {
    width: '23%',
    minWidth: 240,
    flexGrow: 1,
    backgroundColor: colors.cardSurface,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  iconPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentMuted,
    opacity: 0.5,
    marginBottom: 12,
  },
  cardTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  cardDesc: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
