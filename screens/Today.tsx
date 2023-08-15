import { FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import Swiper from 'react-native-swiper';
import TodayTasks from '../components/TodayTasks';
import TodayScreen from '../components/TodayScreen';
import { container } from '../styles';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';


const Today = ({db, tasks, setTasks, tracks, setTracks, habits, setHabits, moods, setMoods, sleep, setSleep, load, loadx, scales, setScales, scalerecords, setScalerecords, diary, setDiary, setStaterecords, staterecords, states, setStates, sections, times, setTimes, timerecords, setTimerecords, weather, setWeather, stickers, setStickers, stickerrecords, setStickerrecords, analytics, setAnalytics}) => {

  var today = new Date();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(today);

  const NextDay = () => {
    setDate(new Date(date.setDate(date.getDate()+1)));
  };

  const PreviousDay = () => {
    setDate(new Date(date.setDate(date.getDate()-1)));
  };

  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={container.container}>
      <View style={container.header}>
        <Pressable onPress={PreviousDay}>
          <Feather name='chevron-left' size={40} />
        </Pressable>
        <Text style={container.headerdate}>
          {moment(date).format('dddd, DD MMMM YYYY')}
        </Text>
        <Pressable onPress={NextDay}>
          <Feather name='chevron-right' size={40}/>
        </Pressable>
      </View>
      <Swiper horizontal={false} showsButtons={false} showsPagination={false} loop={false}>
        <TodayScreen db={db} tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} 
        habits={habits} setHabits={setHabits} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        load={load} loadx={loadx} 
        year={date.getFullYear()} month={date.getMonth()} day={date.getDate()}
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        staterecords={staterecords} setStaterecords={setStaterecords}
        states={states} setStates={setStates}
        times={times} setTimes={setTimes}
        timerecords={times} setTimerecords={setTimes}
        scales={scales} setScales={setScales}
        weather={weather} setWeather={setWeather}
        stickers={stickers} setStickers={setStickers}
        stickerrecords={stickerrecords} setStickerrecords={setStickerrecords}
        analytics={analytics} setAnalytics={setAnalytics}
        />
        <TodayTasks db={db} 
        tasks={tasks} setTasks={setTasks} 
        tracks={tracks} setTracks={setTracks} load={load} 
        loadx={loadx} date={date} setDate={setDate}
        sections={sections}
        />
      </Swiper>
    </SafeAreaView>
  );
}

export default Today;

