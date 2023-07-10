import { TouchableOpacity, FlatList, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useState } from 'react';
import Swiper from 'react-native-swiper'
import MonthlyTasks from '../components/MonthlyTasks';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function CalendarElement({year, month, day, tasks, tags, setTags, load, loadx, db, setTasks}) {

  var today = new Date();
  var thisDay = today.getDate();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var days = [];

  const GetDaysInMonth = (month) => {
    var date = new Date(year, month, 1);
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
    if (days.length<42) {
      for (let i=days.length; i<42; i++) {
        days.push(0);
      }
    }
    return days;
  }

  var daysLength = GetDaysInMonth(month).length;

  var line1 = GetDaysInMonth(month).slice(0,7);
  var line2 = GetDaysInMonth(month).slice(7,14);
  var line3 = GetDaysInMonth(month).slice(14,21);
  var line4 = GetDaysInMonth(month).slice(21,28);
  var line5 = () => { 
    let list=[];
    if (daysLength>28) {
        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(month)[28+i]);
        }
        for (let i=0; i<(35-daysLength);i++){
            list.push(0);
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
    if (daysLength>34) {

        for (let i=0; i<7;i++){
          list.push(GetDaysInMonth(month)[35+i]);
        }
      return(list)
    }
    else {
      list.push(0,0,0,0,0,0,0);
      return(list)
    }
  }

  var daysLines = [line1,line2,line3,line4,line5(),line6()];

  const monthTodo = (tasks, year, month, day) => {
    if(day>0 && day<32) {
      return(tasks.filter(
        c=>(c.year==year && c.month==month && c.day==day)
      ))
    }
  };

  const CalendarCell = (date) => {
    return(
      <View style={[styles.calendarCell,{backgroundColor: date==0? 'lightgray' : 'white', borderColor: (date==thisDay && month==thisMonth && year==thisYear)? 'red':'gray', borderWidth: (date==thisDay && month==thisMonth && year==thisYear)? 2:0.5}]}>
        <View style={{height:15}}>
          <Text style={{textAlign:'right', textAlignVertical:'top', marginRight:3, opacity: date==0? 0 : 1}}>{date}</Text>
        </View>
        <View style={{flex:1, justifyContent: 'flex-end'}}>
          <FlatList data={monthTodo(tasks, year, month, date)}
          horizontal={false} scrollEnabled={true} renderItem={RenderTaskItem} bounces={false} />
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

  const CalendarTaskItem = ({task, tag}) => (
    <>
      <TouchableOpacity style={[styles.task,{backgroundColor: tags.filter(c=>c.id==tag).map(c=>c.color)[0]}]}>
        <Text style={{fontSize:10}}>{task}</Text>
      </TouchableOpacity>
    </>
  );
  const RenderTaskItem = ({item}) => (
    <CalendarTaskItem task={item.task} tag={item.tag} />
  );

  return (
    <View style={styles.container}>
        <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false}>
          <FlatList
            data={daysLines}
            renderItem={({item}) => CalendarLine(item)}
            keyExtractor={item => item.id}
          />
          <MonthlyTasks db={db} load={load} loadx={loadx} tags={tags} setTags={setTags} year={year} month={month} tasks={tasks} setTasks={setTasks}/>
        </Swiper>
    </View>
  );
}

const styles = StyleSheet.create({
  calendarCell: {
    alignContent: 'center',
    justifyContent: 'center',
    flex:1,
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
  container: {
    flex:14,
    alignContent: 'center',
    justifyContent: 'center',
  },
  task: {
    width: width/7-1,
    height: 14,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 2,
  }
});
