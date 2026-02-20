import { useState, useRef } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, radii } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { importStudents } from '../../api/students';

const CSV_HEADERS = ['First Name', 'Last Name', 'Email', 'Phone', 'Grade', 'Stream', 'Date of Birth', 'Address'];
const TEMPLATE_ROW = 'Jane,Doe,jane.doe@example.com,+1234567890,Grade 10,Stream A,2010-05-15,123 Main St';
const TEMPLATE_CSV = [CSV_HEADERS.join(','), TEMPLATE_ROW].join('\n');

const HEADER_TO_KEY = {
  'first name': 'firstName',
  'last name': 'lastName',
  'email': 'email',
  'phone': 'phone',
  'grade': 'gradeLabel',
  'stream': 'sectionLabel',
  'section': 'sectionLabel', // backwards compatibility
  'date of birth': 'dateOfBirth',
  'address': 'address',
};

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim());
    const obj = {};
    headers.forEach((h, j) => {
      const key = HEADER_TO_KEY[h] || h;
      obj[key] = values[j] ?? '';
    });
    rows.push(obj);
  }
  return { headers, rows };
}

function validateRow(row, index) {
  const first = (row.firstName ?? '').trim();
  const last = (row.lastName ?? '').trim();
  if (!first && !last) return `Row ${index + 1}: First name and last name are required.`;
  return null;
}

export function ImportCsvModal({ visible, onClose, onSaved }) {
  const [step, setStep] = useState('upload'); // 'upload' | 'preview' | 'result'
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null); // { created, failed, errors }
  const fileInputRef = useRef(null);

  const reset = () => {
    setStep('upload');
    setFileName('');
    setRows([]);
    setValidationErrors({});
    setResult(null);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDownloadTemplate = () => {
    if (Platform.OS !== 'web') return;
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e?.target?.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result || '';
        const { rows: parsed } = parseCsv(text);
        setRows(parsed);
        const errs = {};
        parsed.forEach((row, i) => {
          const msg = validateRow(row, i);
          if (msg) errs[i] = msg;
        });
        setValidationErrors(errs);
        setStep('preview');
      } catch {
        setRows([]);
        setValidationErrors({ 0: 'Could not parse CSV.' });
        setStep('preview');
      }
    };
    reader.readAsText(file, 'UTF-8');
  };

  const triggerFileInput = () => {
    if (Platform.OS === 'web' && fileInputRef.current) fileInputRef.current.click();
  };

  const handleImport = async () => {
    const validRows = rows
      .map((row, i) => ({ row, i }))
      .filter(({ i }) => !validationErrors[i])
      .map(({ row }) => ({
        firstName: (row.firstName ?? '').trim() || null,
        lastName: (row.lastName ?? '').trim() || null,
        email: (row.email ?? '').trim() || null,
        phone: (row.phone ?? '').trim() || null,
        gradeLabel: (row.gradeLabel ?? '').trim() || null,
        sectionLabel: (row.sectionLabel ?? '').trim() || null,
        dateOfBirth: (row.dateOfBirth ?? '').trim() || null,
        address: (row.address ?? '').trim() || null,
      }));
    if (validRows.length === 0) return;
    setImporting(true);
    setResult(null);
    try {
      const data = await importStudents(validRows);
      setResult(data);
      setStep('result');
      onSaved?.();
    } catch (e) {
      setResult({ created: 0, failed: validRows.length, errors: [{ row: 0, message: e.message || 'Import failed' }] });
      setStep('result');
    } finally {
      setImporting(false);
    }
  };

  const validCount = rows.length - Object.keys(validationErrors).length;
  const previewRows = rows.slice(0, 15);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Pressable style={styles.modalWrap} onPress={(e) => e.stopPropagation()}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Import students from CSV</Text>
                <Text style={styles.subtitle}>
                  {step === 'upload' && 'Upload a CSV file with student details. Use the template so columns match.'}
                  {step === 'preview' && `Preview: ${rows.length} row(s). ${validCount} valid.`}
                  {step === 'result' && (result ? `Imported ${result.created} student(s). ${result.failed} failed.` : '')}
                </Text>
              </View>
              <Pressable style={styles.closeBtn} onPress={handleClose} accessibilityLabel="Close">
                <MaterialCommunityIcons name="close" size={24} color={colors.textPrimary} />
              </Pressable>
            </View>

            {step === 'upload' && (
              <>
                {Platform.OS === 'web' && (
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                  />
                )}
                <Pressable style={styles.dropZone} onPress={triggerFileInput}>
                  <MaterialCommunityIcons name="cloud-upload-outline" size={48} color={colors.textSecondary} style={styles.dropIcon} />
                  <Text style={styles.dropTitle}>{Platform.OS === 'web' ? 'Choose a CSV file' : 'CSV import'}</Text>
                  <Text style={styles.dropSub}>{Platform.OS === 'web' ? 'or drag and drop' : 'Open in a browser to import from CSV.'}</Text>
                  {fileName ? <Text style={styles.fileName}>{fileName}</Text> : null}
                </Pressable>
                {Platform.OS === 'web' && (
                <Pressable style={styles.templateBtn} onPress={handleDownloadTemplate}>
                  <MaterialCommunityIcons name="file-download-outline" size={18} color={colors.primary} />
                  <Text style={styles.templateBtnText}>Download template</Text>
                </Pressable>
                )}
                <Text style={styles.templateHint}>Columns: {CSV_HEADERS.join(', ')}. Date format: YYYY-MM-DD.</Text>
              </>
            )}

            {step === 'preview' && (
              <>
                <ScrollView style={styles.previewScroll} nestedScrollEnabled showsVerticalScrollIndicator>
                  <View style={styles.previewTable}>
                    <View style={styles.previewHeader}>
                      <Text style={[styles.previewCell, styles.previewCellHead]}>#</Text>
                      <Text style={[styles.previewCell, styles.previewCellHead, styles.previewCellName]}>Name</Text>
                      <Text style={[styles.previewCell, styles.previewCellHead]}>Grade</Text>
                      <Text style={[styles.previewCell, styles.previewCellHead]}>Status</Text>
                    </View>
                    {previewRows.map((row, i) => {
                      const first = (row.firstName ?? '').trim();
                      const last = (row.lastName ?? '').trim();
                      const name = `${first} ${last}`.trim() || '—';
                      const err = validationErrors[i];
                      return (
                        <View key={i} style={[styles.previewRow, err && styles.previewRowError]}>
                          <Text style={styles.previewCell}>{i + 1}</Text>
                          <Text style={[styles.previewCell, styles.previewCellName]} numberOfLines={1}>{name}</Text>
                          <Text style={styles.previewCell} numberOfLines={1}>{row.gradeLabel || '—'}</Text>
                          <Text style={styles.previewCell}>{err ? 'Invalid' : 'OK'}</Text>
                        </View>
                      );
                    })}
                  </View>
                  {rows.length > 15 && (
                    <Text style={styles.previewMore}>… and {rows.length - 15} more row(s). All will be imported.</Text>
                  )}
                </ScrollView>
                <View style={styles.previewFooter}>
                  <Text style={styles.previewSummary}>
                    {validCount} of {rows.length} row(s) valid. {validCount === 0 ? 'Fix errors or choose another file.' : ''}
                  </Text>
                </View>
              </>
            )}

            {step === 'result' && result && (
              <View style={styles.resultBlock}>
                <View style={styles.resultRow}>
                  <MaterialCommunityIcons name="check-circle" size={24} color={colors.success} />
                  <Text style={styles.resultText}>{result.created} student(s) imported.</Text>
                </View>
                {result.failed > 0 && (
                  <View style={styles.resultRow}>
                    <MaterialCommunityIcons name="alert-circle" size={24} color={colors.danger} />
                    <Text style={styles.resultText}>{result.failed} failed.</Text>
                  </View>
                )}
                {result.errors && result.errors.length > 0 && (
                  <ScrollView style={styles.errorList} nestedScrollEnabled>
                    {result.errors.slice(0, 10).map((err, i) => (
                      <Text key={i} style={styles.errorItem}>Row {err.row}: {err.message}</Text>
                    ))}
                    {result.errors.length > 10 && (
                      <Text style={styles.errorItem}>… and {result.errors.length - 10} more.</Text>
                    )}
                  </ScrollView>
                )}
              </View>
            )}

            <View style={styles.footer}>
              {step === 'result' ? (
                <Pressable style={styles.submitBtn} onPress={handleClose}>
                  <Text style={styles.submitBtnText}>Close</Text>
                </Pressable>
              ) : (
                <>
                  <Pressable style={styles.cancelBtn} onPress={step === 'preview' ? () => setStep('upload') : handleClose}>
                    <Text style={styles.cancelBtnText}>{step === 'preview' ? 'Back' : 'Cancel'}</Text>
                  </Pressable>
                  {step === 'preview' && (
                    <Pressable
                      style={[styles.submitBtn, validCount === 0 && styles.submitBtnDisabled]}
                      onPress={handleImport}
                      disabled={validCount === 0 || importing}
                    >
                      {importing ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Text style={styles.submitBtnText}>Import {validCount} student(s)</Text>
                      )}
                    </Pressable>
                  )}
                </>
              )}
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
  modalWrap: { width: '100%', maxWidth: 560 },
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
    marginBottom: 12,
    backgroundColor: colors.inputBackground,
  },
  dropIcon: { marginBottom: 12 },
  dropTitle: { ...typography.bodySmall, fontWeight: '600', color: colors.textPrimary, marginBottom: 4 },
  dropSub: { ...typography.small, color: colors.textSecondary },
  fileName: { ...typography.small, color: colors.primary, marginTop: 8 },
  templateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  templateBtnText: { ...typography.bodySmall, color: colors.primary, fontWeight: '500' },
  templateHint: { ...typography.small, color: colors.textSecondary },
  previewScroll: { maxHeight: 280, marginBottom: 16 },
  previewTable: { borderWidth: 1, borderColor: colors.borderSubtle, borderRadius: 8, overflow: 'hidden' },
  previewHeader: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12, backgroundColor: colors.pageBackground, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  previewRow: { flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  previewRowError: { backgroundColor: '#FEF2F2' },
  previewCell: { ...typography.small, color: colors.textPrimary, width: 36 },
  previewCellHead: { fontWeight: '600', color: colors.textSecondary },
  previewCellName: { flex: 1, minWidth: 100 },
  previewMore: { ...typography.small, color: colors.textSecondary, marginTop: 8 },
  previewFooter: { marginBottom: 8 },
  previewSummary: { ...typography.bodySmall, color: colors.textSecondary },
  resultBlock: { marginBottom: 24 },
  resultRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  resultText: { ...typography.bodySmall, color: colors.textPrimary },
  errorList: { maxHeight: 120, marginTop: 8 },
  errorItem: { ...typography.small, color: colors.danger, marginBottom: 4 },
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
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  cancelBtnText: { ...typography.bodySmall, color: colors.textPrimary },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: radii.pill,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnDisabled: { opacity: 0.5 },
  submitBtnText: { ...typography.bodySmall, color: colors.white, fontWeight: '600' },
});
