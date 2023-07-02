import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Trackers from './screens/Trackers';
import Calendar from './screens/Calendar';
import Settings from './screens/Settings';
import Statistics from './screens/Statistics';
import Today from './screens/Today';
import Account from './screens/Settings/Account';
import About from './screens/Settings/About';
import Help from './screens/Settings/Help';
import Feather from '@expo/vector-icons/Feather';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect,useState } from 'react';
import * as SQLite from 'expo-sqlite';

const Stack = createNativeStackNavigator();

function SettingsNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
      <Stack.Screen name="About" component={About} options={{ headerShown: false }} />
      <Stack.Screen name="Help" component={Help} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}


const Tab = createBottomTabNavigator();



export default function App() {
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [states, setStates] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);
  const [moods, setMoods] = useState([]);


useEffect(() => {
  setIsLoading(true);
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS states (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, year INTEGER, month INTEGER, day INTEGER, state INTEGER, type INTEGER, tag INTEGER, place INTEGER, UNIQUE(name,year,month,day))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM states ORDER BY place,day;', null,
    (txObj, resultSet) => setStates(resultSet.rows._array),
    (txObj, error) => console.log('error selecting states')
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
    (txObj, error) => console.log('error selecting states')
    );
  });
  db.transaction(tx => {
    tx.executeSql('CREATE TABLE IF NOT EXISTS moods (id INTEGER PRIMARY KEY AUTOINCREMENT, mood TEXT, year INTEGER, month INTEGER, day INTEGER,UNIQUE(year,month,day))')
  });
  db.transaction(tx => {
    tx.executeSql('SELECT * FROM moods', null,
    (txObj, resultSet) => setMoods(resultSet.rows._array),
    (txObj, error) => console.log('error selecting states')
    );
  });

  setIsLoading(false);

},[load]);

  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Today">
        <Tab.Screen name="Statistics" children={()=><Statistics states={states} tags={tags} setStates={setStates} setTags={setTags} load={load} loadx={loadx}/>} 
          options={{ headerShown: false, tabBarShowLabel: false,
            tabBarIcon: ({focused}) => (
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Feather name="activity" size={28} />  
            </View>)}}
        />
        <Tab.Screen name="Trackers" children={()=><Trackers db={db} states={states} tags={tags} setStates={setStates} setTags={setTags} load={load} loadx={loadx}/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather name="check-square" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="Today" children={()=><Today db={db} tasks={tasks} setTasks={setTasks} tags={tags} setTags={setTags} states={states} setStates={setStates} moods={moods} setMoods={setMoods} load={load} loadx={loadx}/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
             <Feather name="sun" size={28} />  
          </View>) }}
        />
        <Tab.Screen name="Calendar" children={()=><Calendar db={db} states={states} tags={tags} tasks={tasks} setTasks={setTasks} setStates={setStates} setTags={setTags} load={load} loadx={loadx}/>} 
        options={{ headerShown: false, tabBarShowLabel: false,
          tabBarIcon: ({focused}) => (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <Feather name="calendar" size={28} />  
          </View>)}}
        />
        <Tab.Screen name="Settings" component={SettingsNavigator}
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
