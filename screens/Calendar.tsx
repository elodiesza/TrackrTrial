import { FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import Swiper from 'react-native-swiper'
import MonthlyTasks from '../components/MonthlyTasks';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function App() {

  const [addTodoVisible, setAddTodoVisible] = useState(false);
  const [statex, setStatex] = useState(false);
  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();

  var days = [];

  const GetDaysInMonth = (month) => {
    var date = new Date(thisYear, thisMonth, 1);
    var firstDay = date.getDay();
    if (firstDay == 0) {
      for (let i=0; i<6; i++) {
        days.push(0);
      }
      while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
      }
    }
    else {
      for (let i=1; i<firstDay; i++) {
        days.push(0);
      }
      while (date.getMonth() === month) {
        days.push(new Date(date).getDate());
        date.setDate(date.getDate() + 1);
      }
    }

    return days;
  }

  var daysLength = GetDaysInMonth(thisMonth).length;

  var line1 = GetDaysInMonth(thisMonth).slice(0,7);
  var line2 = GetDaysInMonth(thisMonth).slice(7,14);
  var line3 = GetDaysInMonth(thisMonth).slice(14,21);
  var line4 = GetDaysInMonth(thisMonth).slice(21,28);
  var line5 = () => { 
    let list=[];
    if (daysLength>28) {
        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(thisMonth)[29+i]);
        }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }
  var line6 = () => { 
    let list=[];
    if (daysLength>35) {

        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(thisMonth)[36+i]);
        }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }

  var daysLines = [line1,line2,line3,line4,line5(),line6()];


  const CalendarCell = (date) => {
    return(
      <View style={[styles.calendarCell,{backgroundColor: date==0? 'lightgray' : 'white'}]}>
        <View style={{height:15, flex:1}}>
          <Text style={{textAlign:'right', textAlignVertical:'top', marginRight:3, opacity: date==0? 0 : 1}}>{date}</Text>
        </View>
        
      </View>
    )
  }

  const CalendarLine = (line) => {
    return (
      <View style={styles.container}>
          <FlatList
            data={line}
            renderItem={({item}) => CalendarCell(item)}
            keyExtractor={item => item.id}
            horizontal={true}
            bounces={false}
          />
      </View>
    )
  }

  return (
    <View style={styles.container}>
       <View style={styles.header}>
        <Feather name='chevron-left' size={40} style={{right:30}}/>
        <View>
          <Text style={{fontSize:10, textAlign:'center'}}>{moment(new Date(2023,5,1)).format('YYYY')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{moment(new Date(0,5,1)).format('MMMM')}</Text>
        </View>
        <Feather name='chevron-right' size={40} style={{left: 30}}/>
      </View>
      <View style={styles.calendarContainer}>
        <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false}>
          <FlatList
            data={daysLines}
            renderItem={({item}) => CalendarLine(item)}
            keyExtractor={item => item.id}
          />
          <MonthlyTasks/>
        </Swiper>
      </View>
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
