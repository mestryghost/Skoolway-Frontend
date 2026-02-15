import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

export function AuthCard({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 24,
    padding: spacing.sectionGap,
    width: '100%',
    maxWidth: 440,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
});
