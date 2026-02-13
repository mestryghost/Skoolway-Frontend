import { StyleSheet, Text, View } from 'react-native';
import { usePlatform } from '../hooks/usePlatform';

export function RootScreen() {
  const { isWeb, isNative } = usePlatform();
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Skoolway</Text>
      <Text style={styles.subtitle}>
        {isWeb ? 'Web' : isNative ? 'Mobile' : 'Unknown'} • Ready to build
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 24, fontWeight: '600' },
  subtitle: { marginTop: 8, opacity: 0.7 },
});
