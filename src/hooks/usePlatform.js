import { Platform } from 'react-native';

export function usePlatform() {
  const isWeb = Platform.OS === 'web';
  const isNative = Platform.OS === 'ios' || Platform.OS === 'android';
  return { isWeb, isNative, platform: Platform.OS };
}
