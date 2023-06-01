import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Trackers from './screens/Trackers';
import Calendar from './screens/Calendar';
import Settings from './screens/Settings';
import Statistics from './screens/Statistics';
import Today from './screens/Today';
import Feather from '@expo/vector-icons/Feather';

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Today/>
    </View>
  );
}


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Statistics" component={Statistics} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="activity" size={28} />  
            </View>)}}
        />
        <Tab.Screen name="Trackers" component={Trackers} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather name="check-square" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="Today" component={HomeScreen} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="Calendar" component={Calendar} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather name="calendar" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="Settings" component={Settings} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="settings" size={28} />  
            </View>)}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
