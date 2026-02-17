import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { AuthProvider } from '../contexts/AuthContext';
import { NavigationProvider } from '../contexts/NavigationContext';
import { RootScreen } from '../screens/RootScreen';

export function AppRoot() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <View style={styles.container}>
          <RootScreen />
          <StatusBar style="auto" />
        </View>
      </NavigationProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
