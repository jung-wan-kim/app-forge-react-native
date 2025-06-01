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
                iconName = 'add-box';
              } else if (route.name === 'Inbox') {
                iconName = 'inbox';
              } else if (route.name === 'Profile') {
                iconName = 'person';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#fff',
            tabBarInactiveTintColor: '#8e8e93',
            tabBarStyle: {
              backgroundColor: '#000',
              borderTopWidth: 0,
            },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Search" component={SearchScreen} />
          <Tab.Screen name="Upload" component={UploadScreen} />
          <Tab.Screen name="Inbox" component={InboxScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
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