import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

function Stars({ count = 5 }) {
  return (
    <View style={styles.stars} accessibilityLabel={`${count} stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Text key={i} style={styles.star} aria-hidden="true">
          ★
        </Text>
      ))}
    </View>
  );
}

export function TestimonialCard({ quote, name, title, rating = 5 }) {
  return (
    <View style={styles.card} accessibilityRole="article">
      <Stars count={rating} />
      <Text style={styles.quote}>{quote}</Text>
      <View style={styles.author}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 280,
    backgroundColor: colors.cardSurface,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  stars: { flexDirection: 'row', marginBottom: 12 },
  star: { color: colors.primary, fontSize: 14 },
  quote: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    fontStyle: 'italic',
    flex: 1,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.accentMuted,
    marginRight: 12,
  },
  name: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  title: { ...typography.small, color: colors.textSecondary },
});
