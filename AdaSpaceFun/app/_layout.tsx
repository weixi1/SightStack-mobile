import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import  UserProvider  from './usercontext'; // 确保路径正确

import { Colors } from '@/constants/Colors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  // 加载字体
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // 隐藏启动屏
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // 如果字体未加载完成，返回 null
  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.headerBackground,
          },
          headerTintColor: theme.text,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
        <Stack.Screen name="rules" options={{ headerShown: true, title: "Rules", headerTitle: "Rules" }} />
        <Stack.Screen name="signup" options={{ headerShown: true, title: "SignUp", headerTitle: "Sign Up" }} />
        <Stack.Screen name="login" options={{ headerShown: true, title: "LogIn", headerTitle: "Log In" }} />
        <Stack.Screen name="main" options={{ headerShown: true, title: "Game", headerTitle: "Game" }} />
        <Stack.Screen name="account" options={{ headerShown: true, title: "Account", headerTitle: "Account" }} />
        <Stack.Screen name="leaderboard" options={{ headerShown: true, title: "Leaderboard", headerTitle: "Leaderboard" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </UserProvider>
  );
}