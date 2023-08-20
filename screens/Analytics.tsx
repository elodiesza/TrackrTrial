import React, { useEffect, useState } from 'react';
import { View, Text,Dimensions,StyleSheet, Pressable, SafeAreaView, FlatList } from 'react-native';
import { container, colors } from '../styles';
import { SelectList } from 'react-native-dropdown-select-list'
import { Ionicons } from '@expo/vector-icons';
import HabitHabit from '../Analytics/HabitHabit';
import StateHabit from '../Analytics/StateHabit';
import MoodHabit from '../Analytics/MoodHabit';
import ScaleHabit from '../Analytics/ScaleHabit';
import uuid from 'react-native-uuid';

const width = Dimensions.get('window').width;

function Analytics({db, habits, staterecords, scalerecords, stickerrecords, moods, sleep, analytics, setAnalytics}) {

  const [indicator1, setIndicator1] = useState("");
  const [indicator2, setIndicator2] = useState("");

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

  const [type1,setType1] = useState(uniqueTypes[uniqueNames.indexOf(indicator1)]);
  const [type2,setType2] = useState(uniqueTypes[uniqueNames.indexOf(indicator2)]);

  useEffect(() => {
    setType1(uniqueTypes[uniqueNames.indexOf(indicator1)]);
    setType2(uniqueTypes[uniqueNames.indexOf(indicator2)]);
  }, [indicator1,indicator2])

  const AddRecord = (ind1, type1, ind2, type2, status) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          "INSERT INTO analytics (id, indicator1, type1, indicator2, type2, status ) VALUES (?,?,?,?,?,?)",
          [uuid.v4(),ind1, type1, ind2, type2, status],
          (tx, results) => {
            console.log('Results', results.rowsAffected);
            if (results.rowsAffected > 0) {
              setAnalytics([...analytics, {
                id : uuid.v4(),
                indicator1:ind1,
                type1:type1,
                indicator2:ind2,
                type2:type2,
                status:status,
              }]);
            } else alert('Failed to add record');
          }
        );
      }
    );
  }

  const RecordObject = ({ind1,typ1,ind2,typ2,status}) => { 
    let result = LaunchAnalytics(ind1,ind2,typ1,typ2)==undefined? '' : LaunchAnalytics(ind1,ind2,typ1,typ2).result;
    let resultNumber = LaunchAnalytics(ind1,ind2,typ1,typ2)==undefined? 0 : LaunchAnalytics(ind1,ind2,typ1,typ2).resultNumber;
    return(
      <View style={[container.analytics,{backgroundColor:resultNumber>80?colors.pale.purple:colors.primary.gray,borderColor:resultNumber>80?colors.primary.purple:colors.primary.gray}]}>
        <Text> {result}</Text>
        <View style={{flex:1,flexDirection:'row', justifyContent:'flex-end', alignItems:'flex-end'}}>
          <Ionicons name="close" size={24} color="black" />
          <Ionicons name="sync" size={24} color="black" />
          <Ionicons onPress={()=>AddRecord(ind1,typ1,ind2,typ2,2)} name="checkmark" size={24} color="black" style={{display: status==2?"none":"flex"}} />
        </View>
      </View>
    );
  };

  const LaunchAnalytics = (ind1, ind2, type1, type2) => {
    return(
      type1 == "habit" && type2 == "habit" ?
        {'result':HabitHabit(habits.filter(c=>c.name==ind1),habits.filter(c=>c.name==ind2)).result,
        'resultNumber': HabitHabit(habits.filter(c=>c.name==ind1),habits.filter(c=>c.name==ind2)).resultNumber} :
      (type1 == "state" && type2 == "habit")||(type2 == "state" && type1 == "habit")?
        {'result':StateHabit(staterecords.filter(c=>c.name==(type1=='state'?ind1:ind2)),habits.filter(c=>c.name==(type1=='habit'?ind1:ind2)),type1=="state"?true:false).result,
        'resultNumber': StateHabit(staterecords.filter(c=>c.name==(type1=='state'?ind1:ind2)),habits.filter(c=>c.name==(type1=='habit'?ind1:ind2)),type1=="state"?true:false).resultNumber} :
      (type1 == "mood" && type2 == "habit")||(type2 == "mood" && type1 == "habit")?
        {'result':MoodHabit(moods,habits.filter(c=>c.name==(type1=='habit'?ind1:ind2)),type1=="mood"?true:false).result,
        'resultNumber': MoodHabit(moods,habits.filter(c=>c.name==(type1=='habit'?ind1:ind2)),type1=="mood"?true:false).resultNumber} :
      (type1 == "scale" && type2 == "habit")||(type2 == "scale" && type1 == "habit")?
        {'result':ScaleHabit(scalerecords.filter(c=>c.name==(type1=='scale'?ind1:ind2)),habits.filter(c=>c.name==(type1=='habit'?ind1:ind2)),type1=="scale"?true:false).result,
        'resultNumber': ScaleHabit(scalerecords.filter(c=>c.name==(type1=='scale'?ind1:ind2)),habits.filter(c=>c.name==(type1=='habit'?ind1:ind2)),type1=="scale"?true:false).resultNumber} :
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
        <Pressable onPress={()=>LaunchAnalytics(indicator1,type1,indicator2,type2)} 
        style={[container.button,{flex:undefined,margin:10,height:50, width:width-20}]}>
          <Text>ANALYZE DUO</Text>
        </Pressable>
        {indicator1!==undefined && indicator2!==undefined && type1!==undefined && type2!==undefined && 
          <RecordObject ind1={indicator1} typ1={type1} ind2={indicator2} typ2={type2} status={0}/>
        }
        <View style={[container.section, {backgroundColor:colors.primary.white}]}>
          <Text>TO REVIEW</Text>
        </View>
        <View style={{flex:1}}>

        </View>
        <View style={[container.section, {backgroundColor:colors.primary.white}]}>
          <Text>RECORDS</Text>
        </View>
        <View style={{flex:1}}>
          {analytics!==undefined &&
            <FlatList
              data={analytics.filter(c=>c.status==2)}
              renderItem={({ item }) => (
                <RecordObject ind1={item.indicator1} typ1={item.type1} ind2={item.indicator2} typ2={item.type2} status={2}/>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          }
        </View>
      </View>
    </SafeAreaView>
  );
}

export default Analytics;
