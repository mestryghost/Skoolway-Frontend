import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import { Logo } from '../landing/Logo';
import { colors } from '../../theme/colors';
import { useEffect, useState } from 'react';
import { fetchUnreadCount } from '../../api/notifications';

export function DashboardTopNav({ onMenuPress }) {
  const { goTo } = useNavigation();
  const { user } = useAuth();
  const displayName = user?.fullName?.split(' ')[0] || 'Admin';
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await fetchUnreadCount();
        if (!isMounted) return;
        setUnread(data.unread ?? 0);
      } catch {
        if (isMounted) setUnread(0);
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <View style={styles.topNav}>
      <View style={styles.left}>
        <Pressable onPress={() => goTo('dashboard')} style={styles.logoWrap}>
          <Logo />
        </Pressable>
        {onMenuPress && (
          <Pressable onPress={onMenuPress} style={styles.menuBtn} accessibilityLabel="Open menu">
            <Text style={styles.menuIcon}>☰</Text>
          </Pressable>
        )}
      </View>
      <View style={styles.searchWrap}>
        <TextInput
          style={styles.searchInput}
          placeholder="Quick search..."
          placeholderTextColor={colors.textSecondary}
          editable={false}
        />
      </View>
      <View style={styles.right}>
        <Pressable style={styles.iconBtn} onPress={() => goTo('notifications')}>
          <MaterialCommunityIcons name="bell-outline" size={20} color={colors.textPrimary} />
          {unread > 0 && <View style={styles.badge} />}
        </Pressable>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{displayName.charAt(0)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colors.dashboardNavBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
    ...Platform.select({
      web: { boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
    }),
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoWrap: { padding: 4 },
  menuBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  menuIcon: { fontSize: 22, color: colors.textPrimary },
  searchWrap: { flex: 1, maxWidth: 400, marginHorizontal: 24 },
  searchInput: {
    height: 40,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: colors.textPrimary,
  },
  right: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { position: 'relative', padding: 8 },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badgeNew,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 16, fontWeight: '600', color: colors.white },
});
