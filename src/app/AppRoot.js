import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { NavigationProvider } from '../contexts/NavigationContext';
import { RootScreen } from '../screens/RootScreen';

export function AppRoot() {
  return (
    <NavigationProvider>
      <View style={styles.container}>
        <RootScreen />
        <StatusBar style="auto" />
      </View>
    </NavigationProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
