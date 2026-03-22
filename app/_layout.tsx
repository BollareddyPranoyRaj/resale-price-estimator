import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#08111f' },
          headerTintColor: '#f8fafc',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: '#08111f' },
        }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="estimate" options={{ title: 'Estimate' }} />
        <Stack.Screen name="result" options={{ title: 'Your Result' }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
