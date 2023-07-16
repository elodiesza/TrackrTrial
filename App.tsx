import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Calendar from './screens/Calendar';
import Settings from './screens/Settings';
import Today from './screens/Today';
import Analytics from './screens/Analytics';
import Tracks from './screens/Tracks';
import Account from './screens/Settings/Account';
import About from './screens/Settings/About';
import Help from './screens/Settings/Help';
import Feather from '@expo/vector-icons/Feather';
import { SimpleLineIcons } from '@expo/vector-icons';
import { useEffect,useState } from 'react';
import * as SQLite from 'expo-sqlite';




const Tab = createBottomTabNavigator();

export default function App() {
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [habits, setHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [moods, setMoods] = useState([]);
  const [sleep, setSleep] = useState([]);
  const [states, setStates] = useState([]);
  const [scales, setScales] = useState([]);
  const [times, setTimes] = useState([]);


useEffect(() => {
  setIsLoading(true);
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS habits (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, type INTEGER, tag INTEGER, place INTEGER, UNIQUE(name,year,month,day))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM habits ORDER BY place,day;', null,
    (txObj, resultSet) => setHabits(resultSet.rows._array),
    (txObj, error) => console.log('error selecting habits')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS tags (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT, color TEXT, UNIQUE(tag))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM tags', null,
    (txObj, resultSet) => setTags(resultSet.rows._array),
    (txObj, error) => console.log('error selecting tags')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, year INTEGER, month INTEGER, day INTEGER, taskState INTEGER, recurring INTEGER, tag INTEGER, time TEXT, UNIQUE(task,year,month,day))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM tasks', null,
    (txObj, resultSet) => setTasks(resultSet.rows._array),
    (txObj, error) => console.log('error selecting habits')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS moods (id INTEGER PRIMARY KEY AUTOINCREMENT, mood TEXT, year INTEGER, month INTEGER, day INTEGER,UNIQUE(year,month,day))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM moods', null,
    (txObj, resultSet) => setMoods(resultSet.rows._array),
    (txObj, error) => console.log('error selecting habits')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS sleep (id INTEGER PRIMARY KEY AUTOINCREMENT, sleep INTEGER, wakeup INTEGER, year INTEGER, month INTEGER, day INTEGER, type INT, UNIQUE(sleep,year,month,day),UNIQUE(wakeup,year,month,day))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM sleep', null,
    (txObj, resultSet) => setSleep(resultSet.rows._array),
    (txObj, error) => console.log('error selecting habits')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, item TEXT, color TEXT)')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM states', null,
    (txObj, resultSet) => setStates(resultSet.rows._array),
    (txObj, error) => console.log('error selecting states')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS scales (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, min INTEGER, max INTEGER, mincolor TAXT, maxcolor TEXT, unit TEXT)')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM scales', null,
    (txObj, resultSet) => setScales(resultSet.rows._array),
    (txObj, error) => console.log('error selecting scales')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS times (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, type TEXT, min INTEGER, max INTEGER, mincolor TAXT, maxcolor TEXT)')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM times', null,
    (txObj, resultSet) => setTimes(resultSet.rows._array),
    (txObj, error) => console.log('error selecting times')
    );
  });
  setIsLoading(false);

},[load]);

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
        <Tab.Screen name="Today" children={()=><Today db={db} tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags} habits={habits} setHabits={setHabits} moods={moods} setMoods={setMoods} sleep={sleep} setSleep={setSleep} load={load} loadx={loadx}/>} 
        options={{ headerShown: false, tabBarShowLabel: false, 
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="Calendar" children={()=><Calendar db={db} habits={habits} tags={tags} tasks={tasks} setTasks={setTasks} setHabits={setHabits} setTags={setTags} load={load} loadx={loadx} moods={moods} setMoods={setMoods} sleep={sleep} setSleep={setSleep} states={states} setStates={setStates}/>} 
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
