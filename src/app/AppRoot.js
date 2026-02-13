import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { RootScreen } from '../screens/RootScreen';

export function AppRoot() {
  return (
    <View style={styles.container}>
      <RootScreen />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
