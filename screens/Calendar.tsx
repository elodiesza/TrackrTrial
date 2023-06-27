import { FlatList, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import Swiper from 'react-native-swiper'
import MonthlyTasks from '../components/MonthlyTasks';
import CalendarElement from '../components/CalendarElement';
import * as SQLite from 'expo-sqlite';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Calendar() {
  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]);

  const LastMonth = () => {
    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
  };
  const NextMonth = () => {
    if (month==11){
      setMonth(0);
      setYear(year+1);
    }
    else {
      setMonth(month+1);
    }
  };

  useEffect(() => {

    db.transaction(tx => {
      tx.executeSql('SELECT * FROM tasks', null,
      (txObj, resultSet) => setTasks(resultSet.rows._array),
      (txObj, error) => console.log('error selecting tasks')
      );
    });

    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER, month INTEGER, day INTEGER, UNIQUE(year,month,day))')
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

    setIsLoading(false);

  },[load]);


  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }


  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Pressable onPress={LastMonth}>
          <Feather name='chevron-left' size={40} style={{right:30}}/>
        </Pressable>
        <View>
          <Text style={{fontSize:10, textAlign:'center'}}>{moment(new Date(year,1,1)).format('YYYY')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{moment(new Date(0,month,1)).format('MMMM')}</Text>
        </View>
        <Pressable onPress={NextMonth}>
          <Feather name='chevron-right' size={40} style={{left:30}}/>
        </Pressable>
      </View>
      <CalendarElement year={year} month={month} day={day} tasks={tasks} tags={tags}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignContent: 'center',
    justifyContent: 'center',
  },
  calendarCell: {
    alignContent: 'center',
    justifyContent: 'center',
    flex:1,
    borderWidth:0.5,
    borderColor: 'gray',
    backgroundColor: 'white',
    width: width/7,
    height: (8/10)*(height/6),
  },
  header: {
    flex:1,
    marginTop: 48,
    alignContent: 'center',
    justifyContent: 'center',
    width: width,
    flexDirection: 'row',
  },
  calendarContainer: {
    flex:14,
    alignContent: 'center',
    justifyContent: 'center',
  },
});
