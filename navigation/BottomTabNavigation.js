import { View, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, FONTS } from '../constants';
import { Insight, Profile, GraphTab, Training, EditProfile, HomeScreen, Welcome, DetailScreen, MuscleGroup, DataMonitor } from '../screens';
import { FontAwesome, Feather, Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator()

const BottomTabNavigation = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarStyle: {
                    position: 'absolute',
                    backgroundColor: COLORS.background,
                    bottom: 0,
                    right: 0,
                    left: 0,
                    elevation: 0,
                    height: 68,
                    borderColor: COLORS.gray,
                },
            }}
        >
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {focused ? (
                                    <>
                                      
                                        <Ionicons name="home" size={25} color={COLORS.primary} />
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.primary,
                                            }}
                                        >
                                            Home
                                        </Text>
                                    </>
                                ) : (
                                    <React.Fragment>
    <Ionicons name="home" size={25} color={COLORS.gray} />
    <Text
      style={{
        ...FONTS.body4,
        color: COLORS.gray,
      }}
    >
      Home
    </Text>
  </React.Fragment>
                                )}
                            </View>
                        )
                    },
                }}
            />

            <Tab.Screen
                name="Insight"
                component={Insight}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {focused ? (
                                    <>
                                      
                                        <Ionicons name="analytics" size={25} color={COLORS.primary} />
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.primary,
                                            }}
                                        >
                                            Insights
                                        </Text>
                                    </>
                                ) : (
                                    <React.Fragment>
    <Ionicons name="analytics" size={25} color={COLORS.gray} />
    <Text
      style={{
        ...FONTS.body4,
        color: COLORS.gray,
      }}
    >
      Insights
    </Text>
  </React.Fragment>
                                )}
                            </View>
                        )
                    },
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {focused ? (
                                    <>
                                        <Ionicons name="person" size={25} color={COLORS.primary} />
                                        
                                        <Text
                                            style={{
                                                ...FONTS.body4,
                                                color: COLORS.primary,
                                            }}
                                        >
                                           Profile
                                        </Text>
                                    </>
                                ) : (
                                    <React.Fragment>
    <Ionicons name="person" size={25} color={COLORS.gray} />
    <Text
      style={{
        ...FONTS.body4,
        color: COLORS.gray,
      }}
    >
      Profile
    </Text>
  </React.Fragment>
                                    
                                    
                                )}
                            </View>
                        )
                    },
                }}
            />
        </Tab.Navigator>
    )
}

export default BottomTabNavigation;