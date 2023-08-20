import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import React from 'react';
import SleepLog from './Statistics/SleepLogStats';
import Swiper from 'react-native-swiper';
import Habits from './Statistics/HabitsStats';
import StatsHome from './Statistics/StatsHome';
import StatesStats from './Statistics/StatesStats';
import ScalesStats from './Statistics/ScalesStats';

const width = Dimensions.get('window').width;

const Statistics = ({year, month, habits, states, scales, scalerecords, staterecords, tracks, setHabits, setTracks, sleep, moods, stickers, stickerrecords, times, timerecords}) => {
  var today = new Date();

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
      <View style={styles.body}>
        <Swiper horizontal={true} showsButtons={false} showsPagination={true} loop={false}>
          <StatsHome habits={habits} states={states} scales={scales} scalerecords={scalerecords} 
          stickers={stickers} stickerrecords={stickerrecords} sleep={sleep} staterecords={staterecords} 
          month={month} year={year} tracks={tracks} moods={moods} daysInMonth={DaysInMonth(year,month)}
          times={times} timerecords={timerecords} />
          <Habits habits={habits} month={month} year={year} tracks={tracks}/>
          <StatesStats moods={moods} states={states} staterecords={staterecords} year={year} month={month} daysInMonth={DaysInMonth(year,month)}/>
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
