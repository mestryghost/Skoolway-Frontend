import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export function SystemStatus() {
  return (
    <View style={styles.card}>
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.title}>System Status</Text>
      <Text style={styles.subtitle}>All modules operational</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  icon: { fontSize: 28, color: colors.success, marginBottom: 8 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
});
