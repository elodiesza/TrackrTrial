import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import SleepLog from './Statistics/SleepLog';
import Mood from './Statistics/Mood';
import Swiper from 'react-native-swiper';
import Habits from './Statistics/Habits';

const width = Dimensions.get('window').width;

const Statistics = ({states, tags, setStates, setTags, sleep, load, loadx, moods}) => {
  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();

  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(true);

  useEffect(() => {
    if (states.filter(c=>(c.year==year && c.month==month-1))=="") {
      setFirstMonth(true);
    }
    else{
      setFirstMonth(false);
    }
    if (states.filter(c=>(c.year==year && c.month==month+1))=="") {
      setLastMonth(true);
    }
    else{
      setLastMonth(false);
    }
  },[])

  const LastMonth = () => {
    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
    if (states.filter(c=>(c.year==year && c.month==month-2))==""){
      setFirstMonth(true);
    }
    setLastMonth(false);
  };

  const NextMonth = () => {
    if (month==11){
      setMonth(0);
      setYear(year+1);
    }
    else {
      setMonth(month+1);
    }
    if (states.filter(c=>(c.year==year && c.month==month+2))==""){
      setLastMonth(true);
    }
    setFirstMonth(false);
  };


  if (!states || states.length === 0) {
    // Render loading state or placeholder component
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={displayMonth==true?firstMonth? undefined:()=>LastMonth(states):(states.filter(c=>c.year==year-1).length==0? undefined: ()=>(setYear(year-1), setMonth(12-states.filter(c=>c.year==year+1).length)))}>
          <Feather name='chevron-left' size={40} style={{right:30}} color={displayMonth==true?firstMonth? 'lightgray':'black':'lightgray'}/>
        </Pressable>
        <Pressable onPress={()=>setDisplayMonth(!displayMonth)}>
          <Text style={{fontSize:10, textAlign:'center'}}>{displayMonth==true?moment(new Date(year,1,1)).format('YYYY'):moment(new Date(0,month,1)).format('MMMM')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{displayMonth==true?moment(new Date(0,month,1)).format('MMMM'):moment(new Date(year,1,1)).format('YYYY')}</Text>
        </Pressable>
        <Pressable onPress={displayMonth==true?lastMonth? undefined:NextMonth:(states.filter(c=>c.year==year+1).length==0? undefined: ()=>(setYear(year+1), setMonth(states.filter(c=>c.year==year+1).length-1)))}>
          <Feather name='chevron-right' size={40} style={{left:30}} color={displayMonth==true?lastMonth?'lightgray':'black':'lightgray'}/>
        </Pressable>
      </View>
      <View style={styles.body}>
        <Swiper horizontal={true} showsButtons={false} showsPagination={true} loop={false}>
          <Habits states={states} month={month} year={year} tags={tags}/>
          <Mood moods={moods.filter(c=>(c.year==year && c.month==month))} daysInMonth={DaysInMonth(year,month)}/>
          <SleepLog sleep={sleep} load={load} loadx={loadx} year={year} month={month}/>
        </Swiper>
      </View>
    </SafeAreaView>
  );
}

export default Statistics;

const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: width,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'gray',    
  },
  body: {
    flex:1,
  }
});
