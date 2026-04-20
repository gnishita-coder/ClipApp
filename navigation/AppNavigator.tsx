import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';

import LoginScreen from '../screens/LoginScreen';
import OtpScreen from '../screens/OtpScreen';
import HomeScreen from '../screens/HomeScreen';
import CarSelectionScreen from '../screens/CarSelectionScreen';
import CarDetailScreen from '../screens/CarDetailScreen';

import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
      setUser(u);
      if (loading) setLoading(false);
    });

    return unsubscribe;
  }, []);

  // ✅ SHOW LOADING SCREEN WHILE CHECKING AUTH
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FE8723" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {user ? (
          // ✅ LOGGED IN FLOW
          <>
          
            <Stack.Screen name="CarSelection" component={CarSelectionScreen} />
            <Stack.Screen name="CarDetail" component={CarDetailScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          // ❌ NOT LOGGED IN FLOW
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}