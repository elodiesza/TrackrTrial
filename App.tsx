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
import useDatabase from './db'; // Import the useDatabase function

const Tab = createBottomTabNavigator();

export default function App() {

  const {
    isLoading,
    habits,
    tracks,
    tasks,
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
    sections,
    progress,
    weather,
    stickers,
    stickerrecords,
    analytics,
    statuslist,
    statusrecords,
    loadx,
    setTracks,
    setHabits,
    setTasks,
    setMoods,
    setSleep,
    setStates,
    setStaterecords,
    setScales,
    setScalerecords,
    setTimes,
    setTimerecords,
    setDiary,
    setDb,
    setIsLoading,
    setSections,
    setProgress,
    setWeather,
    setStickers,
    setStickerrecords,
    setAnalytics,
    setStatuslist,
    setStatusrecords,
  } = useDatabase();


  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Today">
        <Tab.Screen name="Analytics" children={()=><Analytics db={db}
        habits={habits} staterecords={staterecords} scalerecords={scalerecords} stickerrecords={stickerrecords}
        moods={moods} sleep={sleep} analytics={analytics} setAnalytics={setAnalytics}/>}
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="activity" size={28} />  
            </View>)}}
        />
        <Tab.Screen name="Tracks" children={()=><Tracks 
        tracks={tracks} setTracks={setTracks} db={db}
        sections={sections} setSections={setSections}
        tasks={tasks} setTasks={setTasks}
        progress={progress} setProgress={setProgress}
        statuslist={statuslist} setStatuslist={setStatuslist}
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <SimpleLineIcons name="notebook" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="Today" children={()=><Today db={db} 
        tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
        habits={habits} setHabits={setHabits} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        load={load} loadx={loadx}
        scales={scales} setScales={setScales} 
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        staterecords={staterecords} setStaterecords={setStaterecords}
        states={states} setStates={setStates}
        sections={sections}
        times={times} setTimes={setTimes}
        timerecords={timerecords} setTimerecords={setTimerecords}
        weather={weather} setWeather={setWeather}
        stickers={stickers} setStickers={setStickers}
        stickerrecords={stickerrecords} setStickerrecords={setStickerrecords}
        analytics={analytics} setAnalytics={setAnalytics}
        statuslist={statuslist} setStatuslist={setStatuslist}
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}
        />} 
        options={{ headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="Calendar" children={()=><Calendar db={db} habits={habits} tracks={tracks} 
        tasks={tasks} setTasks={setTasks} 
        setHabits={setHabits} setTracks={setTracks} 
        load={load} loadx={loadx} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        states={states} setStates={setStates} 
        staterecords={staterecords} setStaterecords={setStaterecords}
        scales={scales} setScales={setScales} 
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        weather={weather} setWeather={setWeather}
        stickers={stickers} stickerrecords={stickerrecords}
        times={times} setTimes={setTimes}
        timerecords={timerecords} setTimerecords={setTimerecords}
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
