import { StyleSheet, Modal, TouchableWithoutFeedback, Alert, Pressable, ScrollView, SafeAreaView, Dimensions, Text, View, TouchableOpacity, TextInput, FlatList, Button } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import Feather from '@expo/vector-icons/Feather';
import moment from 'moment';
import TrackersElement from '../components/TrackersElement';
import * as SQLite from 'expo-sqlite';

const width = Dimensions.get('window').width;

const Trackers = () => {

  var today = new Date();
  var thisMonth = today.getMonth();
  var thisYear = today.getFullYear();
  var thisDay = today.getDate();

  const [db,setDb] = useState(SQLite.openDatabase('example.db'));
  const [month,setMonth] = useState(thisMonth);
  const [year,setYear] = useState(thisYear);
  const [day, setDay] = useState(thisDay);
  const [isLoading, setIsLoading] = useState(true);
  const [load, loadx] = useState(false);
  const [states, setStates] = useState([]);
  const [firstMonth, setFirstMonth] = useState(false);
  const [lastMonth, setLastMonth] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM states', null,
      (txObj, resultSet) => setStates(resultSet.rows._array),
      (txObj, error) => console.log('error selecting states')
      );
    });
    if (states.filter(c=>(c.year==year && c.month==month-1)).length==0) {
      setFirstMonth(true);
    }
    if (states.filter(c=>(c.year==year && c.month==month+1)).length==0) {
      setLastMonth(true);
    }
    setIsLoading(false);
  },[load]);

  if (isLoading) {
    return (
      <View>
        <Text> Is Loading...</Text>
      </View>
    )
  }



  const LastMonth = () => {
    if (month==0){
      setMonth(11);
      setYear(year-1);
    }
    else {
      setMonth(month-1);
    }
    if (month==1){
      if (states.filter(c=>(c.year==year-1 && c.month==11)).length==0) {
        setFirstMonth(true);
      }
      else{
        setFirstMonth(false);
      }
    }
    else {
      if (states.filter(c=>(c.year==year && c.month==month-2)).length==0) {
        setFirstMonth(true);
      }
      else{
        setFirstMonth(false);
      }
    }
    if (month==10){
      if (states.filter(c=>(c.year==year+1 && c.month==0)).length==0) {
        setLastMonth(true);
      }
      else{
        setLastMonth(false);
      }
    }
    else {
      if (states.filter(c=>(c.year==year && c.month==month)).length==0) {
        setLastMonth(true);
      }
      else{
        setLastMonth(false);
      }
    }
  };

  const NextMonth = () => {
    if (month==11){
      setMonth(0);
      setYear(year+1);
    }
    else {
      setMonth(month+1);
    }
    if (month==1){
      if (states.filter(c=>(c.year==year-1 && c.month==11)).length==0) {
        setFirstMonth(true);
      }
      else{
        setFirstMonth(false);
      }
    }
    else {
      if (states.filter(c=>(c.year==year && c.month==month)).length==0) {
        setFirstMonth(true);
      }
      else{
        setFirstMonth(false);
      }
    }
    if (month==10){
      if (states.filter(c=>(c.year==year+1 && c.month==0)).length==0) {
        setLastMonth(true);
      }
      else{
        setLastMonth(false);
      }
    }
    else {
      if (states.filter(c=>(c.year==year && c.month==month+2)).length==0) {
        setLastMonth(true);
      }
      else{
        setLastMonth(false);
      }
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={firstMonth? undefined:LastMonth}>
          <Feather name='chevron-left' size={40} style={{right:30}} color={firstMonth? 'lightgray':'black'}/>
        </Pressable>
        <View>
          <Text style={{fontSize:10, textAlign:'center'}}>{moment(new Date(year,1,1)).format('YYYY')}</Text>
          <Text style={{fontSize:22, textAlign:'center'}}>{moment(new Date(0,month,1)).format('MMMM')}</Text>
        </View>
        <Pressable onPress={lastMonth? undefined:NextMonth}>
          <Feather name='chevron-right' size={40} style={{left:30}} color={lastMonth?'lightgray':'black'}/>
        </Pressable>
      </View>
      <TrackersElement db={db} year={year} month={month}/>
    </SafeAreaView>
  );
}

export default Trackers;



const styles = StyleSheet.create({
  container: {
    flex:16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flex: 1,
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
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
