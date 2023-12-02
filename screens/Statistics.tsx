import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import SleepLog from './Statistics/SleepLogStats';
import Swiper from 'react-native-swiper';
import Habits from './Statistics/HabitsStats';
import StatsHome from './Statistics/StatsHome';
import StatesStats from './Statistics/StatesStats';
import ScalesStats from './Statistics/ScalesStats';
import { Feather } from '@expo/vector-icons';
import { container } from '../styles';
import { useEffect, useState } from 'react';
import moment from 'moment';

const width = Dimensions.get('window').width;

const Statistics = ({habits, states, scales, scalerecords, staterecords, sleep, moods, stickers, stickerrecords, times, timerecords}) => {
  var today = new Date();
  const thisDay= today.getDate();
  const thisMonth= today.getMonth();
  const thisYear= today.getFullYear();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(true);

  useEffect(() => {
    if (habits.filter(c=>(c.year==year && c.month==month-1))==undefined) {
      setFirstMonth(true);
    }
    else{
      setFirstMonth(false);
    }
    if (habits.filter(c=>(c.year==year && c.month==month+1))==undefined) {
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
    if (habits.filter(c=>(c.year==year && c.month==month-2))==""){
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
    if (habits.filter(c=>(c.year==year && c.month==month+1))==""){
      setLastMonth(true);
    }
    setFirstMonth(false);
  };

  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();


  if (!habits || habits.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={container.header}>
                <Pressable onPress={displayMonth==true? ()=>LastMonth(habits): ()=>setYear(year-1)}>
                <Feather name='chevron-left' size={40} style={{right:30}} color={'black'}/>
                </Pressable>
                <Pressable onPress={()=>setDisplayMonth(!displayMonth)}>
                <Text style={{fontSize:10, textAlign:'center'}}>{displayMonth==true?moment(new Date(year,1,1)).format('YYYY'):moment(new Date(0,month,1)).format('MMMM')}</Text>
                <Text style={{fontSize:22, textAlign:'center'}}>{displayMonth==true?moment(new Date(0,month,1)).format('MMMM'):moment(new Date(year,1,1)).format('YYYY')}</Text>
                </Pressable>
                <Pressable onPress={displayMonth==true? ()=>NextMonth(habits): ()=>setYear(year+1)}>
                <Feather name='chevron-right' size={40} style={{left:30}} color={'black'}/>
                </Pressable>
        </View>
      <View style={styles.body}>
        <Swiper horizontal={true} showsButtons={false} showsPagination={true} loop={false}>
          <StatsHome habits={habits} states={states} scales={scales} scalerecords={scalerecords} 
          stickers={stickers} stickerrecords={stickerrecords} sleep={sleep} staterecords={staterecords} 
          month={month} year={year} moods={moods.filter(c=>(c.year==year && c.month==month))} daysInMonth={DaysInMonth(year,month)}
          times={times} timerecords={timerecords} />
          <Habits habits={habits} month={month} year={year}/>
          <StatesStats moods={moods.filter(c=>(c.year==year && c.month==month))} states={states} staterecords={staterecords} year={year} month={month} daysInMonth={DaysInMonth(year,month)}/>
          <ScalesStats scales={scales} scalerecords={scalerecords} times={times} timerecords={timerecords} year={year} month={month} daysInMonth={DaysInMonth(year,month)}/>
          <SleepLog sleep={sleep} year={year} month={month}/>
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
