import { FlatList, StyleSheet, Text, View, SafeAreaView,Dimensions, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import TodayScreen from '../components/TodayScreen';
import { container, text, colors } from '../styles';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

const Today = ({db, habits, setHabits, moods, setMoods, sleep, 
  setSleep, scales, setScales, scalerecords, setScalerecords, diary, setDiary, setStaterecords, 
  staterecords, states, setStates,  times, setTimes, timerecords, setTimerecords, weather, setWeather, 
  analytics, setAnalytics, load, loadx}) => {

  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth();
  var day = today.getDate();
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState(today);

  const NextDay = () => {
    setDate(new Date(date.setDate(date.getDate()+1)));
  };

  const PreviousDay = () => {
    setDate(new Date(date.setDate(date.getDate()-1)));
  };

  const firstDate = () => {
    const getDateFromRecord = (record) => new Date(record.year, record.month, record.day);
  
    const habitsDate = habits.length > 0 ? habits.reduce((min, habit) => Math.min(min, getDateFromRecord(habit)), Infinity) : Infinity;
    const moodsDate = moods.length > 0 ? moods.reduce((min, mood) => Math.min(min, getDateFromRecord(mood)), Infinity) : Infinity;
    const sleepDate = sleep.length > 0 ? sleep.reduce((min, sleepRecord) => Math.min(min, getDateFromRecord(sleepRecord)), Infinity) : Infinity;
    const scalerecordsDate = scalerecords.length > 0 ? scalerecords.reduce((min, scaleRecord) => Math.min(min, getDateFromRecord(scaleRecord)), Infinity) : Infinity;
    const diaryDate = diary.length > 0 ? diary.reduce((min, diaryEntry) => Math.min(min, getDateFromRecord(diaryEntry)), Infinity) : Infinity;
    const staterecordsDate = staterecords.length > 0 ? staterecords.reduce((min, stateRecord) => Math.min(min, getDateFromRecord(stateRecord)), Infinity) : Infinity;
    const timerecordsDate = timerecords.length > 0 ? timerecords.reduce((min, timeRecord) => Math.min(min, getDateFromRecord(timeRecord)), Infinity) : Infinity;
    const weatherDate = weather.length > 0 ? weather.reduce((min, weatherEntry) => Math.min(min, getDateFromRecord(weatherEntry)), Infinity) : Infinity;
  
    const minDate = Math.min(
      habitsDate,
      moodsDate,
      sleepDate,
      scalerecordsDate,
      diaryDate,
      staterecordsDate,
      timerecordsDate,
      weatherDate
    );
  
    return minDate !== Infinity ? minDate : null; // Convert Date to a string or format it as needed
  };
 
  const allDates = () => {
    let array = [];
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const startTimestamp = firstDate()==null?(new Date()).getTime():(new Date(firstDate())).getTime();
    const endTimestamp = (new Date()).getTime();
    const daysDifference = Math.round(Math.abs((startTimestamp - endTimestamp) / oneDay));
    for (let i = 0 ; i < daysDifference ; i++) {
      array.push({year:(new Date(endTimestamp-i*oneDay)).getFullYear(),month:(new Date(endTimestamp-i*oneDay)).getMonth(),day:(new Date(endTimestamp-i*oneDay)).getDate()});
    }
    if(array.length==0){
      array.push({year:(new Date()).getFullYear(),month:(new Date()).getMonth(),day:(new Date()).getDate()});
    }
    return array;
  };

  {/*
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    const completion2 = () => {
      const habitsTotal = habits.length > 0 ? habits.filter(c=>(c.year==year && c.month==month && c.day==day)).length : 0;
      const habitsCompletion = habits.filter(c=>(c.year==year && c.month==month && c.day==day)).length > 0 ? habits.filter(c=>(c.year==year && c.month==month && c.day==day)).reduce((sum,habit) => sum + habit.state==true?1:0) : 0;
      {/* 
      const moodsCompletion = moods.length > 0 ? moods.reduce((min, mood) => Math.min(min, getDateFromRecord(mood)), Infinity) : Infinity;
      const sleepCompletion = sleep.length > 0 ? sleep.reduce((min, sleepRecord) => Math.min(min, getDateFromRecord(sleepRecord)), Infinity) : Infinity;
      const scalerecordsCompletion = scalerecords.length > 0 ? scalerecords.reduce((min, scaleRecord) => Math.min(min, getDateFromRecord(scaleRecord)), Infinity) : Infinity;
      const diaryCompletion = diary.length > 0 ? diary.reduce((min, diaryEntry) => Math.min(min, getDateFromRecord(diaryEntry)), Infinity) : Infinity;
      const staterecordsCompletion = staterecords.length > 0 ? staterecords.reduce((min, stateRecord) => Math.min(min, getDateFromRecord(stateRecord)), Infinity) : Infinity;
      const timerecordsCompletion = timerecords.length > 0 ? timerecords.reduce((min, timeRecord) => Math.min(min, getDateFromRecord(timeRecord)), Infinity) : Infinity;
      const weatherCompletion = weather.length > 0 ? weather.reduce((min, weatherEntry) => Math.min(min, getDateFromRecord(weatherEntry)), Infinity) : Infinity;
    
      const minDate = habitsCompletion+moodsCompletion+sleepCompletion+scalerecordsCompletion+diaryCompletion+staterecordsCompletion+timerecordsCompletion+weatherCompletion;
    
      return habitsTotal==0?0:(habitsCompletion/habitsTotal)*100;
    };
    console.warn(habits.filter(c=>(c.year==year && c.month==month && c.day==day)))
    setCompletion(completion2);
  },[day]);

  */}


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
      <View style={{width:width*0.9,height:30, alignSelf:'center', borderBottomWidth:1, paddingBottom:8, marginBottom:10}}>
        <FlatList
          data={allDates()}
          renderItem={({ item }) => (
            <Pressable onPress={()=>setDate(new Date(item.year,item.month,item.day))} style={{justifyContent:'center',alignItems:'center'}}>
              <View style={{width:20, height:20,borderRadius:10, display: ((new Date(item.year,item.month,item.day)).getDate()== (new Date()).getDate() || date.getDate()== (new Date(item.year,item.month,item.day)).getDate())?'flex':'none', backgroundColor: ((new Date(item.year,item.month,item.day)).getDate()== (new Date()).getDate() && (new Date(date)).getDate()!== (new Date().getDate()))?colors.primary.blue:colors.primary.defaultdark, position:'absolute'}}/>
              <Text style={[text.regular, { color:  (date).getDate()== (new Date(item.year,item.month,item.day)).getDate()?colors.primary.white:colors.primary.black, marginHorizontal: 20 }]}>
                {item.day}
              </Text>
            </Pressable>   
          )}
          keyExtractor={(index) => 'date' + index.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          inverted={true}
          initialScrollIndex={0}
          initialNumToRender={allDates.length}
          contentContainerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: width * 0.9 / 2 -20,
          }}
        />
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

