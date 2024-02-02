import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen'
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import { FONTS } from './constants/fonts';
import { useCallback } from 'react';
import { Onboarding, SplashScreen2, Login, Signup, Welcome, HomeScreen, 
  Training, GraphTab, Profile, BluetoothScreen, DataMonitor, DataTimer, EditProfile, Insight, CalibrationScreen, DetailScreen, MuscleGroup } from './screens';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { StyleSheet, Text, View } from 'react-native';
import BottomTabNavigation from './navigation/BottomTabNavigation'

SplashScreen.preventAutoHideAsync()

const Stack = createNativeStackNavigator()

export default function App() {
  const [fontsLoaded] = useFonts(FONTS);

  const onLayoutRootView = useCallback(async ()=>{
    if(fontsLoaded) {
      await SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
      return null
  }

  return (
      
    <Provider store={store}>
   <SafeAreaProvider onLayout={onLayoutRootView}>
      <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SplashScreen2"
        screenOptions={{ headerShown: false }}
      ><Stack.Screen name="SplashScreen2" component={SplashScreen2} />
      <Stack.Screen name="Onboarding" component={Onboarding}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="BottomTabNavigation" component={BottomTabNavigation}/>
        <Stack.Screen name="Welcome" component={Welcome}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}/>
        <Stack.Screen name="Training" component={Training}/>
        <Stack.Screen name="EditProfile" component={EditProfile}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="BluetoothScreen" component={BluetoothScreen}/>
        <Stack.Screen name="CalibrationScreen" component={CalibrationScreen}/>
        <Stack.Screen name="Insight" component={Insight}/>
        <Stack.Screen name="DataMonitor" component={DataMonitor}/>
        <Stack.Screen name="DataTimer" component={DataTimer}/>
        <Stack.Screen name="DetailScreen" component={DetailScreen}/>
        <Stack.Screen name="MuscleGroup" component={MuscleGroup}/>
        <Stack.Screen name="GraphTab" component={GraphTab}/>
        </Stack.Navigator>
  
      </NavigationContainer>
  </SafeAreaProvider>
  </Provider>
  );
}

