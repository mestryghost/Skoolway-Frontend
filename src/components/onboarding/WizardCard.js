import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';

export function WizardCard({ children }) {
  return <View style={styles.card}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: radii.card,
    padding: spacing.sectionGap,
    width: '100%',
    maxWidth: 520,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
});
