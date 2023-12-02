import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from './screens/Calendar';
import Settings from './screens/Settings';
import Today from './screens/Today';
import Analytics from './screens/Analytics';
import Feather from '@expo/vector-icons/Feather';
import useDatabase from './db'; // Import the useDatabase function
import Trackers from './screens/Trackers';
import { colors } from './styles';

const Tab = createBottomTabNavigator();

export default function App() {

  const {
    habits,
    moods,
    sleep,
    states,
    staterecords,
    scales,
    scalerecords,
    times,
    timerecords,
    diary,
    load,
    db,
    weather,
    analytics,
    loadx,
    setHabits,
    setMoods,
    setSleep,
    setStates,
    setStaterecords,
    setScales,
    setScalerecords,
    setTimes,
    setTimerecords,
    setDiary,
    setWeather,
    setAnalytics,
  } = useDatabase();


  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Today"
      screenOptions={{
        tabBarStyle: { shadowColor:colors.primary.black,shadowOffset:{height:2,width:2},shadowRadius:5,shadowOpacity:0.2, borderWidth:0.5,borderColor:colors.primary.gray},
      }}>
        <Tab.Screen name="Analytics" children={()=><Analytics db={db}
        habits={habits} staterecords={staterecords} scalerecords={scalerecords}
        moods={moods} sleep={sleep} analytics={analytics} setAnalytics={setAnalytics}/>}
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="activity" size={28} color={focused?colors.primary.black:colors.primary.defaultdark}/>  
            </View>)}}
        />
        <Tab.Screen name="Calendar" children={()=><Calendar db={db} habits={habits}
          setHabits={setHabits}
          load={load} loadx={loadx} 
          moods={moods} setMoods={setMoods} 
          sleep={sleep} setSleep={setSleep} 
          states={states} setStates={setStates} 
          staterecords={staterecords} setStaterecords={setStaterecords}
          scales={scales} setScales={setScales} 
          scalerecords={scalerecords} setScalerecords={setScalerecords}
          diary={diary} setDiary={setDiary}
          weather={weather} setWeather={setWeather}
          times={times} setTimes={setTimes}
          timerecords={timerecords} setTimerecords={setTimerecords}
          />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="calendar" size={28} color={focused?colors.primary.black:colors.primary.defaultdark}/>  
            </View>)}}
        />
        <Tab.Screen name="Today" children={()=><Today db={db} 
          habits={habits} setHabits={setHabits} 
          moods={moods} setMoods={setMoods} 
          sleep={sleep} setSleep={setSleep} 
          load={load} loadx={loadx}
          scales={scales} setScales={setScales} 
          scalerecords={scalerecords} setScalerecords={setScalerecords}
          diary={diary} setDiary={setDiary}
          staterecords={staterecords} setStaterecords={setStaterecords}
          states={states} setStates={setStates}
          times={times} setTimes={setTimes}
          timerecords={timerecords} setTimerecords={setTimerecords}
          weather={weather} setWeather={setWeather}
          analytics={analytics} setAnalytics={setAnalytics}
          />} 
          options={{ headerShown: false, tabBarShowLabel: false, 
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="sun" size={28} color={focused?colors.primary.black:colors.primary.defaultdark} />  
            </View>) }}
        />
        <Tab.Screen name="Trackers" children={()=><Trackers db={db} habits={habits}
          setHabits={setHabits}
          load={load} loadx={loadx} 
          moods={moods} setMoods={setMoods} 
          sleep={sleep} setSleep={setSleep} 
          states={states} setStates={setStates} 
          staterecords={staterecords} setStaterecords={setStaterecords}
          scales={scales} setScales={setScales} 
          scalerecords={scalerecords} setScalerecords={setScalerecords}
          diary={diary} setDiary={setDiary}
          weather={weather} setWeather={setWeather}
          times={times} setTimes={setTimes}
          timerecords={timerecords} setTimerecords={setTimerecords}
          />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="check" size={28} color={focused?colors.primary.black:colors.primary.defaultdark} />  
            </View>)}}
        />
        <Tab.Screen name="Settings" children={()=><Settings 
        db={db} 
        habits={habits} setHabits={setHabits} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        load={load} loadx={loadx} 
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        staterecords={staterecords} setStaterecords={setStaterecords}
        states={states} setStates={setStates}
        times={times} setTimes={setTimes}
        timerecords={timerecords} setTimerecords={setTimerecords}
        scales={scales} setScales={setScales}
        weather={weather} setWeather={setWeather}
        analytics={analytics} setAnalytics={setAnalytics}
        />} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="settings" size={28} color={focused?colors.primary.black:colors.primary.defaultdark} />  
            </View>)}}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
