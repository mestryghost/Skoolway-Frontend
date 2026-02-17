import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Breadcrumb } from '../common/Breadcrumb';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead } from '../../api/notifications';

export function NotificationsContent() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const pageSize = 20;

  const load = async (pageToLoad, isRefresh = false) => {
    if (loading && !isRefresh) return;
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const data = await fetchNotifications({ page: pageToLoad, pageSize });
      setTotal(data.total || 0);
      if (isRefresh || pageToLoad === 1) {
        setItems(data.items || []);
      } else {
        setItems((prev) => [...prev, ...(data.items || [])]);
      }
      setPage(pageToLoad);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const onEndReached = () => {
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    if (page < maxPage && !loading) {
      load(page + 1);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true, readAt: new Date().toISOString() } : n))
      );
    } catch {
      // ignore for now
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, isRead: true, readAt: n.readAt ?? new Date().toISOString() })));
    } catch {
      // ignore for now
    }
  };

  const renderItem = ({ item }) => {
    const isUnread = !item.isRead;
    return (
      <Pressable onPress={() => handleMarkRead(item.id)} style={[styles.item, isUnread && styles.itemUnread]}>
        <View style={styles.itemIconWrap}>
          <MaterialCommunityIcons
            name={iconForCategory(item.category)}
            size={20}
            color={isUnread ? colors.primary : colors.textSecondary}
          />
        </View>
        <View style={styles.itemBody}>
          <Text style={[styles.itemTitle, isUnread && styles.itemTitleUnread]}>{item.title}</Text>
          <Text style={styles.itemBodyText}>{item.body}</Text>
          <Text style={styles.itemMeta}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
        {isUnread && <View style={styles.unreadDot} />}
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <Breadcrumb segments={[{ label: 'Dashboard', screen: 'dashboard' }, { label: 'Notifications' }]} />
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Notifications</Text>
          <Text style={styles.subtitle}>Stay on top of what’s happening across your school.</Text>
        </View>
        <Pressable style={styles.clearBtn} onPress={handleMarkAllRead}>
          <MaterialCommunityIcons name="check-circle-outline" size={18} color={colors.primary} />
          <Text style={styles.clearBtnText}>Mark all as read</Text>
        </Pressable>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={() => load(1, true)}
        ListFooterComponent={loading && items.length > 0 ? <ActivityIndicator color={colors.primary} /> : null}
        ListEmptyComponent={
          !loading ? <Text style={styles.emptyText}>No notifications yet. You’re all caught up.</Text> : null
        }
      />
    </View>
  );
}

function iconForCategory(category) {
  switch ((category || '').toLowerCase()) {
    case 'students':
      return 'account-school';
    case 'parents':
      return 'account-multiple';
    case 'teachers':
      return 'school';
    case 'transport':
      return 'bus-clock';
    case 'tenant':
      return 'office-building';
    default:
      return 'bell-outline';
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, padding: spacing.gutter },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { ...typography.h2, color: colors.textPrimary },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary, marginTop: 4 },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    backgroundColor: colors.white,
  },
  clearBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  listContent: { paddingBottom: 32 },
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  itemUnread: {
    backgroundColor: colors.dashboardWelcomeBg,
  },
  itemIconWrap: { marginRight: 12, marginTop: 2 },
  itemBody: { flex: 1 },
  itemTitle: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '500' },
  itemTitleUnread: { fontWeight: '700' },
  itemBodyText: { ...typography.small, color: colors.textSecondary, marginTop: 2 },
  itemMeta: { ...typography.small, color: colors.textSecondary, marginTop: 4 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.badgeNew,
    marginLeft: 8,
    marginTop: 8,
  },
  errorText: { ...typography.small, color: colors.danger, marginBottom: 8 },
  emptyText: { ...typography.bodySmall, color: colors.textSecondary, textAlign: 'center', marginTop: 24 },
});

