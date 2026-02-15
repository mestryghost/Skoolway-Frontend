import { StyleSheet, Text, View } from 'react-native';
import { landingCopy } from '../../constants/landing';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { PricingCard } from './PricingCard';

export function PricingSection() {
  const plans = landingCopy.pricing;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Transparent Pricing for Every Scale</Text>
      <View style={styles.grid}>
        {plans.map((plan) => (
          <PricingCard
            key={plan.name}
            name={plan.name}
            price={plan.price}
            period={plan.period}
            cta={plan.cta}
            recommended={plan.recommended}
          />
        ))}
      </View>
      <Text style={styles.note}>Schools billed per seat. No hidden fees.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: spacing.sectionGap,
    paddingHorizontal: spacing.pageHorizontal,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.sectionGap,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.gutter,
    justifyContent: 'center',
  },
  note: {
    ...typography.small,
    textAlign: 'center',
    marginTop: spacing.gutter,
    opacity: 0.8,
  },
});
