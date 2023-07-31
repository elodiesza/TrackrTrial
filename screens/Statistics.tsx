import { FlatList, SafeAreaView, Pressable, StyleSheet, Text, View, Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import React from 'react';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import SleepLog from './Statistics/SleepLog';
import Mood from './Statistics/Mood';
import Swiper from 'react-native-swiper';
import Habits from './Statistics/Habits';
import StatsHome from './Statistics/StatsHome';

const width = Dimensions.get('window').width;

const Statistics = ({year, month, habits, tracks, setHabits, setTracks, sleep, load, loadx, moods}) => {
  var today = new Date();

  const DaysInMonth = (year, month) => new Date(year, month+1, 0).getDate();


  if (!habits || habits.length === 0) {
    // Render loading state or placeholder component
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
          <StatsHome habits={habits} month={month} year={year} tracks={tracks} moods={moods} daysInMonth={DaysInMonth(year,month)}/>
          <Habits habits={habits} month={month} year={year} tracks={tracks}/>
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
