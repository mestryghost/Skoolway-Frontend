import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { landingCopy } from '../../constants/landing';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { TestimonialCard } from './TestimonialCard';

export function TestimonialsSection() {
  const items = landingCopy.testimonials;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Trusted by Visionary Educators</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((t, i) => (
          <TestimonialCard
            key={i}
            quote={t.quote}
            name={t.name}
            title={t.title}
            rating={t.rating}
          />
        ))}
      </ScrollView>
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
    zIndex: 1,
    elevation: 1,
  },
  title: {
    ...typography.h2,
    textAlign: 'center',
    marginBottom: spacing.gutter,
  },
  scrollContent: {
    flexDirection: 'row',
    gap: spacing.gutter,
    justifyContent: 'center',
    paddingHorizontal: spacing.gutter,
  },
});
