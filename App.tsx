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
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();


function HomeScreen() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Settings}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Today">
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
        <Tab.Screen name="Today" component={Today} 
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
