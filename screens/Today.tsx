import { FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import TodayScreen from '../components/TodayScreen';
import { container, text } from '../styles';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';


const Today = ({db, habits, setHabits, moods, setMoods, sleep, 
  setSleep, scales, setScales, scalerecords, setScalerecords, diary, setDiary, setStaterecords, 
  staterecords, states, setStates,  times, setTimes, timerecords, setTimerecords, weather, setWeather, 
  analytics, setAnalytics, load, loadx}) => {

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
              <Feather name='chevron-left' size={30} />
            </Pressable>
            <View style={{alignItems:'center', marginHorizontal:20}}>
              <Text style={[text.title,{display: (date.getDate()==today.getDate() && date.getMonth()==today.getMonth() && date.getFullYear()==today.getFullYear())? 'flex':'none'}]}>
                TODAY
              </Text>
              <Text style={text.regular}>
                {moment(date).format('dddd, DD MMMM YYYY')}
              </Text>
            </View>
            <Pressable onPress={NextDay}>
              <Feather name='chevron-right' size={30}/>
            </Pressable>
          </View>
        <TodayScreen db={db}  
        habits={habits} setHabits={setHabits} 
        moods={moods} setMoods={setMoods} 
        sleep={sleep} setSleep={setSleep} 
        year={date.getFullYear()} month={date.getMonth()} day={date.getDate()}
        scalerecords={scalerecords} setScalerecords={setScalerecords}
        diary={diary} setDiary={setDiary}
        staterecords={staterecords} setStaterecords={setStaterecords}
        states={states} setStates={setStates}
        times={times} setTimes={setTimes}
        timerecords={timerecords} setTimerecords={setTimerecords}
        scales={scales} setScales={setScales}
        weather={weather} setWeather={setWeather}
        analytics={analytics} setAnalytics={setAnalytics}
        load={load} loadx={loadx}
        />
    </SafeAreaView>
  );
}

export default Today;

