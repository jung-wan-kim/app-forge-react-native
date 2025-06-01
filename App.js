import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

// 화면 임포트
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import UploadScreen from './src/screens/UploadScreen';
import InboxScreen from './src/screens/InboxScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminScreen from './src/screens/AdminScreen';

// Supabase 설정
import './src/config/supabase';

const Tab = createBottomTabNavigator();

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = 'home';
              } else if (route.name === 'Search') {
                iconName = 'search';
              } else if (route.name === 'Upload') {
                return (
                  <View style={{
                    width: 60,
                    height: 34,
                    borderRadius: 8,
                    backgroundColor: '#fff',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                    <View style={{
                      position: 'absolute',
                      left: -2,
                      width: 24,
                      height: 34,
                      borderRadius: 8,
                      backgroundColor: '#00f2ea',
                    }} />
                    <View style={{
                      position: 'absolute',
                      right: -2,
                      width: 24,
                      height: 34,
                      borderRadius: 8,
                      backgroundColor: '#ff0050',
                    }} />
                    <Icon name="add" size={24} color="#000" />
                  </View>
                );
              } else if (route.name === 'Inbox') {
                iconName = 'inbox';
              } else if (route.name === 'Profile') {
                iconName = 'person';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
            tabBarStyle: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              borderTopWidth: 0,
              position: 'absolute',
              elevation: 0,
              height: 80,
              paddingBottom: 25,
              paddingTop: 10,
            },
            tabBarLabelStyle: {
              fontSize: 10,
              marginTop: -5,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: '홈',
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              tabBarLabel: '친구',
            }}
          />
          <Tab.Screen 
            name="Upload" 
            component={UploadScreen}
            options={{
              tabBarLabel: '',
            }}
          />
          <Tab.Screen 
            name="Inbox" 
            component={InboxScreen}
            options={{
              tabBarLabel: '받은 편지함',
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              tabBarLabel: '프로필',
            }}
          />
          <Tab.Screen 
            name="Admin" 
            component={AdminScreen}
            options={{
              tabBarIcon: ({ focused, color, size }) => (
                <Icon name="settings" size={size} color={color} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;