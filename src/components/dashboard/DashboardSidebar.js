import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { Logo } from '../landing/Logo';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'view-dashboard-outline', activeIcon: 'view-dashboard' },
  { key: 'students', label: 'Students', icon: 'account-group-outline', activeIcon: 'account-group' },
  { key: 'parents', label: 'Parents', icon: 'account-multiple-outline', activeIcon: 'account-multiple' },
  { key: 'teachers', label: 'Teachers', icon: 'school-outline', activeIcon: 'school' },
  { key: 'transport', label: 'Transport', icon: 'bus-outline', activeIcon: 'bus' },
  { key: 'analytics', label: 'Analytics', icon: 'chart-bar', activeIcon: 'chart-bar' },
  { key: 'settings', label: 'Settings', icon: 'cog-outline', activeIcon: 'cog' },
];

export function DashboardSidebar({ activeKey = 'dashboard', onClose }) {
  const { logout } = useAuth();
  const { goTo } = useNavigation();

  const handleLogout = async () => {
    await logout();
    goTo('landing');
  };

  return (
    <View style={styles.sidebar}>
      <Pressable style={styles.logoSection} onPress={() => goTo('landing')}>
        <View style={styles.logoContainer}>
          <Logo />
        </View>
      </Pressable>
      {NAV_ITEMS.map((item) => {
        const isActive = activeKey === item.key;
        return (
          <Pressable
            key={item.key}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => goTo(item.key)}
          >
            <MaterialCommunityIcons
              name={isActive ? item.activeIcon : item.icon}
              size={20}
              color={isActive ? colors.primary : colors.textSecondary}
              style={styles.navIcon}
            />
            <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
      <View style={styles.spacer} />
      <Pressable style={styles.navItem} onPress={handleLogout}>
        <MaterialCommunityIcons
          name="logout"
          size={20}
          color={colors.textSecondary}
          style={styles.navIcon}
        />
        <Text style={styles.navLabel}>Logout</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    minHeight: '100%',
    backgroundColor: colors.white,
    paddingVertical: spacing.gutter,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: colors.borderSubtle,
  },
  logoSection: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  logoContainer: {
    transform: [{ scale: 0.85 }],
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: colors.dashboardWelcomeBg,
  },
  navIcon: { marginRight: 12 },
  navLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
  spacer: { flex: 1 },
});
