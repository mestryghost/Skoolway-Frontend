import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';

const logoSource = require('../../../assets/logo.png');

export function Logo() {
  return (
    <View style={styles.container} accessibilityRole="header">
      <Image
        source={logoSource}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Skoolway logo"
      />
      <Text style={styles.title}>Skoolway</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 100,
    height: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
});
