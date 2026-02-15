import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { landingCopy } from '../../constants/landing';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function FeatureChips() {
  const chips = landingCopy.featureChips;

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {chips.map((chip) => (
          <View
            key={chip.label}
            style={styles.chip}
            accessibilityRole="summary"
          >
            <Text style={styles.chipValue}>{chip.value}</Text>
            <Text style={styles.chipLabel}>{chip.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.pageHorizontal,
    paddingVertical: spacing.sectionGap,
    marginBottom: 0,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  scrollView: { flexGrow: 0 },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.gutter,
    paddingVertical: 8,
  },
  chip: {
    height: spacing.chipHeight,
    minWidth: 160,
    backgroundColor: colors.cardSurface,
    borderRadius: radii.cardSmall,
    paddingHorizontal: spacing.cardPadding,
    justifyContent: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  chipValue: {
    ...typography.h3,
    color: colors.primary,
  },
  chipLabel: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
