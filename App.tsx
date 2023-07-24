import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from './screens/Calendar';
import Settings from './screens/Settings';
import Today from './screens/Today';
import Analytics from './screens/Analytics';
import Tracks from './screens/Tracks';
import Feather from '@expo/vector-icons/Feather';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useEffect,useState } from 'react';
import * as SQLite from 'expo-sqlite';
import useDatabase from './db'; // Import the useDatabase function

const Tab = createBottomTabNavigator();

export default function App() {

  const {
    isLoading,
    habits,
    tags,
    tasks,
    moods,
    sleep,
    states,
    staterecords,
    scales,
    scalerecords,
    diary,
    load,
    db,
    loadx,
    setTags,
    setHabits,
    setTasks,
    setMoods,
    setSleep,
    setStates,
    setStaterecords,
    setScales,
    setScalerecords,
    setDiary,
    setDb,
    setIsLoading
  } = useDatabase();


  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Today">
        <Tab.Screen name="Analytics" children={()=><Analytics/>} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="activity" size={28} />  
            </View>)}}
        />
        <Tab.Screen name="Tracks" children={()=><Tracks/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <SimpleLineIcons name="notebook" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="Today" children={()=><Today db={db} 
        tasks={tasks} setTasks={setTasks} 
        tags={tags} setTags={setTags} 
        habits={habits} setHabits={setHabits} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        load={load} loadx={loadx}
        scales={scales} setScales={setScales} 
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        />} 
        options={{ headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="Calendar" children={()=><Calendar db={db} habits={habits} tags={tags} 
        tasks={tasks} setTasks={setTasks} 
        setHabits={setHabits} setTags={setTags} 
        load={load} loadx={loadx} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        states={states} setStates={setStates} 
        staterecords={staterecords} setStaterecords={setStaterecords}
        scales={scales} setScales={setScales} 
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        />} 
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
