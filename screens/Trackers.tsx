import { StyleSheet, Modal, TouchableWithoutFeedback, Alert, Pressable, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import TrackersElement from '../components/TrackersElement';
import { container } from '../styles';

const width = Dimensions.get('window').width;

const Trackers = ({db, habits, tracks, setHabits, setTracks, load, loadx, moods, setMoods, sleep, setSleep}) => {

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(true);


  useEffect(() => {
    if (habits.filter(c=>(c.year==year && c.month==month-1))=="") {
      setFirstMonth(true);
    }
    else{
      setFirstMonth(false);
    }
    if (habits.filter(c=>(c.year==year && c.month==month+1))=="") {
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
    if (habits.filter(c=>(c.year==year && c.month==month+2))==""){
      setLastMonth(true);
    }
    setFirstMonth(false);
  };


  return (
    <SafeAreaView style={container.container}>
      <View style={container.header}>
        <Pressable onPress={displayMonth==true?firstMonth? undefined:()=>LastMonth(habits):(habits.filter(c=>c.year==year-1).length==0? undefined: ()=>(setYear(year-1), setMonth(12-habits.filter(c=>c.year==year+1).length)))}>
          <Feather name='chevron-left' size={40} style={{right:30}} color={displayMonth==true?firstMonth? 'lightgray':'black':'lightgray'}/>
        </Pressable>
        <Pressable onPress={()=>setDisplayMonth(!displayMonth)}>
          <Text style={{fontSize:10, textAlign:'center'}}>{displayMonth==true?moment(new Date(year,1,1)).format('YYYY'):moment(new Date(0,month,1)).format('MMMM')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{displayMonth==true?moment(new Date(0,month,1)).format('MMMM'):moment(new Date(year,1,1)).format('YYYY')}</Text>
        </Pressable>
        <Pressable onPress={displayMonth==true?lastMonth? undefined:NextMonth:(habits.filter(c=>c.year==year+1).length==0? undefined: ()=>(setYear(year+1), setMonth(habits.filter(c=>c.year==year+1).length-1)))}>
          <Feather name='chevron-right' size={40} style={{left:30}} color={displayMonth==true?lastMonth?'lightgray':'black':'lightgray'}/>
        </Pressable>
      </View>
      <View style={{flex:1}}>

      </View>
    </SafeAreaView>
  );
}

export default Trackers;


