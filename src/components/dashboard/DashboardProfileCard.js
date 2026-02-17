import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

export function DashboardProfileCard() {
  const { user } = useAuth();
  const name = user?.fullName || 'Sarah Jenkins';
  const initial = name.split(' ').map((n) => n[0]).join('').slice(0, 2);

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{initial}</Text>
      </View>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.role}>Chief Administrator</Text>
      <View style={styles.actions}>
        <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
          <Text style={styles.btnText}>Profile</Text>
        </Pressable>
        <Pressable style={({ pressed }) => [styles.btn, pressed && styles.pressed]}>
          <Text style={styles.btnText}>Settings</Text>
        </Pressable>
      </View>
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
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 24, fontWeight: '600', color: colors.white },
  name: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  role: { ...typography.bodySmall, color: colors.textSecondary, marginBottom: 16 },
  actions: { flexDirection: 'row', gap: 12 },
  btn: {
    paddingVertical: spacing.buttonPaddingVertical,
    paddingHorizontal: spacing.buttonPaddingHorizontal,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnText: { fontSize: 14, fontWeight: '600', color: colors.primary },
  pressed: { opacity: 0.9 },
});
