import { StyleSheet, Modal, TouchableWithoutFeedback, Alert, Pressable, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import TrackersElement from '../components/TrackersElement';

const width = Dimensions.get('window').width;

const Trackers = ({db, states, tags, setStates, setTags, load, loadx, moods, setMoods}) => {

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
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
      <TrackersElement 
      db={db} 
      year={year} 
      month={month} 
      load={load} 
      loadx={loadx} 
      setStates={setStates} 
      states={states}
      tags={tags}
      setTags={setTags}
      moods={moods}
      setMoods={setMoods}
      />
    </SafeAreaView>
  );
}

export default Trackers;



const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
  },
  cell: {
    width: 25,
    height: 25,
    borderColor: 'black',
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dialogBox: {
    position: 'absolute',
    flex: 1,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    top: 200,
  },
  deleteBox: {
    flex: 1, 
    top: 200,
    position: 'absolute',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: 'lightgray',
    borderRadius: 20,
    paddingHorizontal: 10,
    padding: 15,
  },
  button: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    marginTop: 20,
  },
});