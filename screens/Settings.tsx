import { View, Text, StyleSheet, Pressable,SafeAreaView } from 'react-native';
import { container } from '../styles';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Account from './Settings/Account';
import About from './Settings/About';
import Help from './Settings/Help';
import Customization from './Settings/Customization';
import Data from './Settings/Data';
import SettingsHome from './Settings/SettingsHome';
import DeleteDB from './Settings/DeleteDB';
import AddDB from './Settings/AddDB';
const Stack = createNativeStackNavigator();

const SettingsNavigator =({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
  statuslist, setStatuslist, statusrecords, setStatusrecords})=> {
  
    return (
    <Stack.Navigator>
      <Stack.Screen name="SettingsHome" component={SettingsHome} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
      <Stack.Screen name="Data" component={Data} options={{ headerShown: false }} />
      <Stack.Screen name="Customization" component={Customization} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
      <Stack.Screen name="DeleteDB" component={()=>DeleteDB({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
    statuslist, setStatuslist, statusrecords, setStatusrecords})} options={{ headerShown: false }} />
      <Stack.Screen name="AddDB" component={()=>AddDB({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
    statuslist, setStatuslist, statusrecords, setStatusrecords})} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

function Settings({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scalerecords, setScalerecords, diary, setDiary, staterecords, setStaterecords, states, times, timerecords, scales, setStates, setTimes, setTimerecords, setScales, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics,
  statuslist, setStatuslist, statusrecords, setStatusrecords}) {


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
        analytics={analytics} setAnalytics={setAnalytics}
        statusrecords={statusrecords} setStatusrecords={setStatusrecords}
        statuslist={statuslist} setStatuslist={setStatuslist}/>
    </SafeAreaView>
      
  );
}

export default Settings;
