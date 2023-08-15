import React, { useState } from 'react';
import { View, Text,Dimensions,StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { container, colors } from '../styles';
import { SelectList } from 'react-native-dropdown-select-list'
import { Ionicons } from '@expo/vector-icons';
import HabitHabit from '../Analytics/HabitHabit';
import StateHabit from '../Analytics/StateHabit';
import MoodHabit from '../Analytics/MoodHabit';

const width = Dimensions.get('window').width;

function Analytics({db, habits, staterecords, scalerecords, stickerrecords, moods, sleep}) {

  const [indicator1, setIndicator1] = useState("");
  const [indicator2, setIndicator2] = useState("");
  const [result, setResult] = useState("");
  const [resultNumber, setResultNumber] = useState(0);

  const moodsNames = 'MOOD';
  const sleepqualityNames = 'SLEEP QUALITY';
  const habitsNames = [...new Set(habits.map((c) => c.name))];
  const uniqueStatesNames = [...new Set(staterecords.map(c=>c.name))];
  const uniqueScalesNames = [...new Set(scalerecords.map(c=>c.name))];
  const uniqueNames = [...new Set([ moodsNames, sleepqualityNames, ...uniqueScalesNames, ...uniqueStatesNames, ...habitsNames])];

  const habitsType = Array.from({ length:[...new Set(habits.map((c) => c.name))].length }, () => "habit");
  const statesType = Array.from({ length:[...new Set(staterecords.map((c) => c.name))].length }, () => "state");
  const scalesType = Array.from({ length:[...new Set(scalerecords.map((c) => c.name))].length }, () => "scale");
  const uniqueTypes = [ 'mood', 'sleepquality', ...scalesType, ...statesType, ...habitsType];


  const ToReview = () => { 
    return(
      <View style={[container.analytics,{backgroundColor:resultNumber>80?colors.pale.purple:colors.primary.gray,borderColor:resultNumber>80?colors.primary.purple:colors.primary.gray}]}>
        <Text> {result}</Text>
        <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
          <Ionicons name="close" size={24} color="black" />
          <Ionicons name="sync" size={24} color="black" />
          <Ionicons name="checkmark" size={24} color="black" />
        </View>
      </View>
    );
  };

  const LaunchAnalytics = () => {
    return(
      uniqueTypes[uniqueNames.indexOf(indicator1)] == "habit" && uniqueTypes[uniqueNames.indexOf(indicator2)] == "habit" ?
        HabitHabit(habits.filter(c=>c.name==indicator1),habits.filter(c=>c.name==indicator2),setResult,setResultNumber) :
      uniqueTypes[uniqueNames.indexOf(indicator1)] == "state" && uniqueTypes[uniqueNames.indexOf(indicator2)] == "habit" ?
        StateHabit(habits.filter(c=>c.name==indicator2),staterecords.filter(c=>c.name==indicator1),setResult,setResultNumber) :
      uniqueTypes[uniqueNames.indexOf(indicator1)] == "mood" && uniqueTypes[uniqueNames.indexOf(indicator2)] == "habit" ?
        MoodHabit(habits.filter(c=>c.name==indicator2),moods,setResult,setResultNumber) :
      undefined
    )
  }

  return (
    <SafeAreaView style={container.container}>
      <View style={container.header}>
          <Text style={{fontSize:20}}>ANALYTICS</Text>
      </View>
      <View style={container.body}>
        <View style={[container.button,{flex:undefined,width:width-20,height:80, margin:10}]}>
          <Text>LAUNCH ANALYTICS</Text>
        </View>
        <View style={{zIndex: 2,flexDirection:'row', alignItems:'flex-start', height:50, justifyContent:'center'}}>
          <SelectList 
          setSelected={(val) => setIndicator1(val)} 
          data={uniqueNames} 
          save="value"
          placeholder='indicator 1'
          boxStyles={{backgroundColor:colors.primary.white}}
          dropdownStyles={{backgroundColor:colors.primary.white,height:150}}
          />  
          <View style={{height:50,width:30,justifyContent:'center', alignItems:'center'}}>
            <Ionicons name="caret-forward" size={24} color="black" />
          </View>
          <SelectList 
          setSelected={(val) => setIndicator2(val)} 
          data={uniqueNames} 
          save="value"
          placeholder='indicator 2'
          boxStyles={{backgroundColor:colors.primary.white}}
          dropdownStyles={{backgroundColor:colors.primary.white,height:150}}
          />  
          <View style={{height:50,width:40,justifyContent:'center', alignItems:'center'}}>
            <Text style={{marginLeft:10,fontSize:20, fontWeight:'bold'}}>+1</Text>
          </View>
        </View>
        <Pressable onPress={()=>LaunchAnalytics()} style={[container.button,{flex:undefined,margin:10,height:50, width:width-20}]}>
          <Text>ANALYZE DUO</Text>
        </Pressable>
        <ToReview/>
        <View style={[container.section, {backgroundColor:colors.primary.white}]}>
          <Text>TO REVIEW</Text>
        </View>
        <View style={{flex:1}}>

        </View>
        <View style={[container.section, {backgroundColor:colors.primary.white}]}>
          <Text>RECORDS</Text>
        </View>
        <View style={{flex:1}}>

        </View>
      </View>
    </SafeAreaView>
  );
}

export default Analytics;
