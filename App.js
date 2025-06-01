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

              // Figma 기준 아이콘 매핑
              if (route.name === 'Home') {
                // Figma: home 아이콘
                return (
                  <View style={{ alignItems: 'center' }}>
                    <Icon name={focused ? 'home' : 'home'} size={28} color={color} />
                  </View>
                );
              } else if (route.name === 'Search') {
                iconName = focused ? 'search' : 'search';
                return <Icon name={iconName} size={28} color={color} />;
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
                    <Icon name="add" size={22} color={focused ? '#000' : '#000'} />
                  </View>
                );
              } else if (route.name === 'Inbox') {
                iconName = focused ? 'mail' : 'mail-outline';
                return <Icon name={iconName} size={28} color={color} />;
              } else if (route.name === 'Profile') {
                iconName = focused ? 'person' : 'person-outline';
                return <Icon name={iconName} size={28} color={color} />;
              }

              // 기본 반환값 (사용되지 않음)
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
              tabBarLabel: '홈',
            }}
          />
          <Tab.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              tabBarLabel: '디스커버',
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
              tabBarLabel: '받은편지함',
            }}
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              tabBarLabel: '나',
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;