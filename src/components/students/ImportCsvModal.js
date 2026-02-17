import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export function ImportCsvModal({ visible, onClose }) {
  const [fileName, setFileName] = useState('');

  const handleImport = () => {
    // Placeholder: would process CSV
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
                <Text style={styles.title}>Import CSV</Text>
                <Text style={styles.subtitle}>Upload a CSV file to import students into the directory.</Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={onClose} accessibilityLabel="Close">
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            <Pressable style={styles.dropZone}>
              <MaterialCommunityIcons name="cloud-upload-outline" size={48} color={colors.textSecondary} style={styles.dropIcon} />
              <Text style={styles.dropTitle}>Drag and drop your file here</Text>
              <Text style={styles.dropSub}>or click to browse</Text>
              {fileName ? <Text style={styles.fileName}>{fileName}</Text> : null}
            </Pressable>

            <View style={styles.footer}>
              <Pressable style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.submitBtn} onPress={handleImport}>
                <Text style={styles.submitBtnText}>Import</Text>
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
  modalWrap: { width: '100%', maxWidth: 520 },
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
  dropZone: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.borderSubtle,
    borderRadius: radii.cardSmall,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: colors.inputBackground,
  },
  dropIcon: { marginBottom: 12 },
  dropTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  dropSub: { ...typography.small, color: colors.textSecondary },
  fileName: { ...typography.small, color: colors.primary, marginTop: 8 },
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
