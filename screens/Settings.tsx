import { ImageBackground, View, Text, StyleSheet, Pressable,SafeAreaView } from 'react-native';
import { container,colors } from '../styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './Settings/Account';
import About from './Settings/About';
import Help from './Settings/Help';
import Preferences from './Settings/Preferences';
import Data from './Settings/Data';
import SettingsHome from './Settings/SettingsHome';
import DeleteDB from './Settings/DeleteDB';
import Linkdata from './Settings/Linkdata';

const Stack = createNativeStackNavigator();

const SettingsNavigator =({db, tasks, setTasks, tracks, setTracks, load, loadx, 
   logs, setLogs, habits, setHabits, moods, setMoods, sleep, setSleep, scalerecords, 
   setScalerecords, scales, setScales, states, setStates, staterecords, setStaterecords, 
   times, setTimes, weather, setWeather, timerecords, setTimerecords, diary, 
   setDiary, stickers, setStickers, stickerrecords, setStickerrecords,
  analytics, setAnalytics})=> {


    return (
    <Stack.Navigator screenOptions={{headerShown:false}}> 
      <Stack.Screen name="SettingsHome" component={SettingsHome} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="About" component={About}/>
      <Stack.Screen name="Data" component={Data}/>
      <Stack.Screen name="Preferences" component={()=>Preferences({db})} />
      <Stack.Screen name="Help" component={Help} />
      <Stack.Screen
        name="DeleteDB"
        component={()=>DeleteDB({db, tasks, setTasks, tracks, setTracks, load, loadx,
           logs, setLogs, habits, setHabits, moods, setMoods, sleep, setSleep, scalerecords, 
           setScalerecords, scales, setScales, states, setStates, staterecords, setStaterecords, 
           times, setTimes, weather, setWeather, timerecords, setTimerecords, diary, setDiary, 
           stickers, setStickers, stickerrecords, setStickerrecords,analytics, setAnalytics})} />
      <Stack.Screen
        name="Linkdata"
        component={()=>Linkdata({db, tasks, setTasks, tracks, setTracks, load, loadx,
          logs, setLogs, habits, setHabits, moods, setMoods, sleep, setSleep, scalerecords, 
          setScalerecords, scales, setScales, states, setStates, staterecords, setStaterecords, 
          times, setTimes, weather, setWeather, timerecords, setTimerecords, diary, setDiary, 
          stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics})} />

    </Stack.Navigator>
  );
}

function Settings({db, tasks, setTasks, tracks, setTracks,load, loadx, 
  logs, setLogs, 
  habits, setHabits, moods, setMoods, sleep, setSleep, scalerecords, setScalerecords, 
  scales, setScales, states, setStates, staterecords, setStaterecords, times, setTimes, 
  weather, setWeather, timerecords, setTimerecords, diary, setDiary, stickers, 
  setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics}) {


  return (
      <SafeAreaView style={container.container}>
          <View style={container.header}>
              <Text style={container.headertitle}>SETTINGS</Text>
          </View>
          <SettingsNavigator db={db} tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
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
        stickers={stickers} setStickers={setStickers}
        stickerrecords={stickerrecords} setStickerrecords={setStickerrecords}
        analytics={analytics} setAnalytics={setAnalytics}/>
      </SafeAreaView>
  );
}

export default Settings;
