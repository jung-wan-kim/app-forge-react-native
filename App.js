import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, Text } from 'react-native';

// SVG 아이콘 임포트
import HomeIcon from './src/components/icons/HomeIcon';
import DiscoverIcon from './src/components/icons/DiscoverIcon';
import AddIcon from './src/components/icons/AddIcon';
import InboxIcon from './src/components/icons/InboxIcon';
import ProfileIcon from './src/components/icons/ProfileIcon';

// 화면 임포트
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import UploadScreen from './src/screens/UploadScreen';
import InboxScreen from './src/screens/InboxScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
              // Figma 기준 SVG 아이콘 사용
              if (route.name === 'Home') {
                return <HomeIcon size={28} color={color} filled={focused} />;
              } else if (route.name === 'Search') {
                return <DiscoverIcon size={28} color={color} />;
              } else if (route.name === 'Upload') {
                // TikTok 스타일 업로드 버튼
                return (
                  <View style={{
                    width: 45,
                    height: 30,
                    borderRadius: 8,
                    backgroundColor: focused ? '#fff' : 'rgba(255, 255, 255, 0.9)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                    <View style={{
                      position: 'absolute',
                      left: -4,
                      width: 20,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: '#00f2ea',
                    }} />
                    <View style={{
                      position: 'absolute',
                      right: -4,
                      width: 20,
                      height: 30,
                      borderRadius: 8,
                      backgroundColor: '#ff0050',
                    }} />
                    <AddIcon size={22} color={focused ? '#000' : '#000'} />
                  </View>
                );
              } else if (route.name === 'Inbox') {
                return <InboxIcon size={28} color={color} filled={focused} />;
              } else if (route.name === 'Profile') {
                return <ProfileIcon size={28} color={color} filled={focused} />;
              }

              return null;
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
              fontWeight: '500',
            },
            headerShown: false,
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              tabBarLabel: 'Home',
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              tabBarLabel: 'Discover',
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
              tabBarLabel: 'Inbox',
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              tabBarLabel: 'Me',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;