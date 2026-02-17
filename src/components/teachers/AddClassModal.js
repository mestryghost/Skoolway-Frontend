import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function AddClassModal({ visible, onClose }) {
  const [gradeSection, setGradeSection] = useState('');
  const [room, setRoom] = useState('');
  const [capacity, setCapacity] = useState('');
  const [assignedTeacher, setAssignedTeacher] = useState('');

  const handleSubmit = () => {
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalWrap} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Add New Class</Text>
                <Text style={styles.subtitle}>Create a new class and assign a teacher.</Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose}>
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>
            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>GRADE / SECTION</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Grade 10-A"
                    placeholderTextColor={colors.textSecondary}
                    value={gradeSection}
                    onChangeText={setGradeSection}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>ROOM</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. C101"
                    placeholderTextColor={colors.textSecondary}
                    value={room}
                    onChangeText={setRoom}
                  />
                </View>
              </View>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>CAPACITY</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 30"
                    placeholderTextColor={colors.textSecondary}
                    value={capacity}
                    onChangeText={setCapacity}
                    keyboardType="number-pad"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>ASSIGNED TEACHER</Text>
                  <View style={styles.selectWrap}>
                    <TextInput
                      style={styles.input}
                      placeholder="Select teacher"
                      placeholderTextColor={colors.textSecondary}
                      value={assignedTeacher}
                      editable={false}
                    />
                    <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} style={styles.selectIcon} />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Create Class</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: spacing.gutter },
  modalWrap: { width: '100%', maxWidth: 520 },
  modal: { backgroundColor: colors.white, borderRadius: radii.card, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  closeBtn: { padding: 4, marginTop: -4, marginRight: -4 },
  body: { marginBottom: 24 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  field: { flex: 1 },
  label: { ...typography.small, color: colors.textSecondary, fontWeight: '600', letterSpacing: 0.5, marginBottom: 8 },
  input: { ...typography.bodySmall, color: colors.textPrimary, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 12 },
  selectWrap: { position: 'relative' },
  selectIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  cancelBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.borderSubtle },
  cancelBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  submitBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: radii.pill, backgroundColor: colors.primary },
  submitBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
});
