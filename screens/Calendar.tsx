import { FlatList, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import Swiper from 'react-native-swiper'
import MonthlyTasks from '../components/MonthlyTasks';
import CalendarElement from '../components/CalendarElement';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function Calendar() {

  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [statex, setStatex] = useState(false);

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);

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
      <CalendarElement year={year} month={month} day={day}/>
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
