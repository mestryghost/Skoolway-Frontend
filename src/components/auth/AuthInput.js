import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors } from '../../theme/colors';
import { radii } from '../../theme/spacing';

export function AuthInput({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  icon,
}) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputRow}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon]}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  icon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 48,
    backgroundColor: colors.inputBackground,
    borderRadius: radii.pill,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.textPrimary,
    flex: 1,
  },
  inputWithIcon: { paddingLeft: 44 },
});
