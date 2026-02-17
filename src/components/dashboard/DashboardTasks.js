import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const TASKS = [
  { id: 15, name: 'Teacher Performance Reviews', dept: 'HR', priority: 'High' },
  { id: 18, name: 'Quarterly Budget Approval', dept: 'Finance', priority: 'Medium' },
  { id: 20, name: 'New Bus Route Finalization', dept: 'Ops', priority: 'High' },
  { id: 22, name: 'Parent-Teacher Council', dept: 'Comm', priority: 'Low' },
  { id: 24, name: 'IT Infrastructure Maintenance', dept: 'IT', priority: 'Medium' },
];

export function DashboardTasks() {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Pending Admin Tasks</Text>
        <Pressable>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
      {TASKS.map((t) => (
        <View key={t.id} style={styles.row}>
          <View style={styles.numWrap}>
            <Text style={styles.num}>{t.id}</Text>
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.taskName}>{t.name}</Text>
            <Text style={styles.meta}>
              {t.dept}, {t.priority} Priority
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardSurface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { ...typography.h3, color: colors.textPrimary },
  viewAll: { fontSize: 14, fontWeight: '600', color: colors.primary },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  numWrap: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.inputBackground, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  num: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  rowBody: { flex: 1 },
  taskName: { ...typography.bodySmall, color: colors.textPrimary, fontWeight: '500' },
  meta: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
});
