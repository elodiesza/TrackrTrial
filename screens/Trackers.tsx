import { Pressable, Text, View, Dimensions, SafeAreaView } from 'react-native';
import { useState, useEffect } from 'react';
import moment from 'moment';
import TrackersElement from '../components/TrackersElement';
import { container } from '../styles';
import { Feather } from '@expo/vector-icons';


const Trackers = ({db, habits, setHabits, load, loadx, moods, setMoods, sleep, setSleep, states, setStates, staterecords, setStaterecords, scales, setScales, scalerecords, setScalerecords, diary, setDiary, weather, setWeather, stickers, stickerrecords, times, setTimes, timerecords, setTimerecords}) => {
  const [isLoading, setIsLoading] = useState(false);

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();
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
      <TrackersElement year={year} month={month} 
      load={load} loadx={loadx} db={db}
      habits={habits} setHabits={setHabits} 
      moods={moods} setMoods={setMoods} 
      sleep={sleep} setSleep={setSleep} 
      states={states} setStates={setStates} 
      staterecords={staterecords} setStaterecords={setStaterecords}
      scales={scales} setScales={setScales} 
      scalerecords={scalerecords} setScalerecords={setScalerecords}
      weather={weather} setWeather={setWeather}
      times={times} setTimes={setTimes}
      timerecords={timerecords} setTimerecords={setTimerecords}
      load={load} loadx={loadx}
      />
    </SafeAreaView>
  );
};

export default Trackers;