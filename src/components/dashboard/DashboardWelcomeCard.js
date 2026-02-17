import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function DashboardWelcomeCard() {
  const { user } = useAuth();
  const { goTo } = useNavigation();
  const firstName = user?.fullName?.split(' ')[0] || 'Admin';

  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <MaterialCommunityIcons name="calendar-outline" size={14} color={colors.primary} />
        <Text style={styles.badgeText}>ACADEMIC YEAR 2024</Text>
      </View>
      <Text style={styles.greeting}>Good Morning, Admin {firstName}.</Text>
      <Text style={styles.subtitle}>Here&apos;s what&apos;s happening today.</Text>
      <Text style={styles.body}>
        Mid-term examinations start in 3 days. All class schedules for the science labs have been
        finalized and sent to teachers.
      </Text>
      <View style={styles.actions}>
        <Pressable style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]} onPress={() => goTo('manage-schedule')}>
          <Text style={styles.btnPrimaryText}>Manage Schedule</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.btnSecondary, pressed && styles.pressed]} onPress={() => goTo('reports')}>
          <Text style={styles.btnSecondaryText}>Daily Report</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dashboardWelcomeBg,
    borderRadius: radii.card,
    padding: spacing.cardPadding,
    marginBottom: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    marginBottom: 12,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.primary, letterSpacing: 0.5 },
  greeting: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 39,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 12,
  },
  body: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  actions: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  btnPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
  },
  btnPrimaryText: { fontSize: 14, fontWeight: '600', color: colors.white },
  btnSecondary: {
    backgroundColor: colors.white,
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  btnSecondaryText: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  pressed: { opacity: 0.9 },
});
