import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function RegisterParentModal({ visible, onClose }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  const handleRegister = () => {
    // Placeholder: would call API to register parent
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalWrap} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Register Parent</Text>
                <Text style={styles.subtitle}>Add a new parent or guardian to the school directory.</Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close">
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>FIRST NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Sarah"
                    placeholderTextColor={colors.textSecondary}
                    value={firstName}
                    onChangeText={setFirstName}
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>LAST NAME</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Jenkins"
                    placeholderTextColor={colors.textSecondary}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.field}>
                  <Text style={styles.label}>EMAIL</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. parent@email.com"
                    placeholderTextColor={colors.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.field}>
                  <Text style={styles.label}>PHONE</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. +1 (555) 000-0000"
                    placeholderTextColor={colors.textSecondary}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>ROLE</Text>
                <View style={styles.selectWrap}>
                  <TextInput
                    style={styles.input}
                    placeholder="Select role (Mother / Father / Guardian)"
                    placeholderTextColor={colors.textSecondary}
                    value={role}
                    onChangeText={setRole}
                    editable={false}
                  />
                  <MaterialCommunityIcons name="chevron-down" size={20} color={colors.textSecondary} style={styles.selectIcon} />
                </View>
              </View>

              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons name="account-school-outline" size={18} color={colors.textSecondary} />
                  <Text style={styles.sectionTitle}>Link to Student(s)</Text>
                  <Pressable style={styles.sectionLink}>
                    <Text style={styles.sectionLinkText}>Link existing student</Text>
                  </Pressable>
                </View>
                <View style={styles.searchWrap}>
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search student by name or ID..."
                    placeholderTextColor={colors.textSecondary}
                    value={studentSearch}
                    onChangeText={setStudentSearch}
                  />
                  <MaterialCommunityIcons name="magnify" size={20} color={colors.textSecondary} style={styles.searchIcon} />
                </View>
              </View>
            </ScrollView>

            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={handleRegister}>
                <Text style={styles.submitBtnText}>Register Parent</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.gutter,
  },
  modalWrap: {
    width: '100%',
    maxWidth: 520,
  },
  modal: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: { ...typography.h3, color: colors.textPrimary, marginBottom: 4 },
  subtitle: { ...typography.bodySmall, color: colors.textSecondary },
  closeBtn: { padding: 4, marginTop: -4, marginRight: -4 },
  body: { maxHeight: 400, marginBottom: 24 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  field: { flex: 1, marginBottom: 20 },
  label: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  input: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  selectWrap: { position: 'relative' },
  selectIcon: { position: 'absolute', right: 12, top: '50%', marginTop: -10 },
  section: { marginTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary },
  sectionLink: {},
  sectionLinkText: { ...typography.bodySmall, color: colors.primary, textDecorationLine: 'underline', marginLeft: 'auto' },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    ...typography.bodySmall,
    color: colors.textPrimary,
    paddingVertical: 10,
    paddingRight: 8,
  },
  searchIcon: {},
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cancelBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
  },
  submitBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
});
